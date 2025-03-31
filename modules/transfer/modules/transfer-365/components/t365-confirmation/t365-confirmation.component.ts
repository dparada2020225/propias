import { Component, OnInit } from '@angular/core';
import { IAccount } from '../../../../../../models/account.inteface';
import { V3IAchAccount } from '../../../transfer-ach/interfaces/ach-account-interface';
import { IDataReading } from '@adf/components';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { I365ConfirmationState, I365FormValues, I365HomeState } from '../../interfaces/state.interface';
import { E365UrlCollection } from '../../enum/url-collection.enum';
import { UtilService } from '../../../../../../service/common/util.service';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { T365dVoucherService } from '../../services/definition/t365d-voucher.service';
import { HandleTokenRequestService } from '../../../../../../service/common/handle-token-request.service';
import { ModalTokenComponent } from '../../../../../../view/private/token/modal-token/modal-token.component';
import { ERequestTypeTransaction } from '../../../../../../enums/transaction-header.enum';
import {
  IACHTransactionResponse,
  TAchTransactionResponse
} from '../../../transfer-ach/interfaces/ach-transfer.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { T365TransactionService } from '../../services/transaction/t365-transaction.service';
import { UtilTransactionService } from '../../../../../../service/common/util-transaction.service';
import { HttpStatusCode } from '../../../../../../enums/http-status-code.enum';
import { EACHTypeTransaction } from '../../../transfer-ach/enum/transfer-ach.enum';
import { IUserInfo } from '../../../../../../models/user-info.interface';
import { IACHBiesGeneralParameterBank } from '../../../../../../models/ach-general-parameters.interface';
import { T365RouteProtected } from '../../enum/route-protected.enum';
import {
  S365TransferRequestBuilder,
} from '../../../../interface/365-transfer.interface';
import { Product } from '../../../../../../enums/product.enum';
import { ETMACHTypeTransaction } from '../../../../../transaction-manager/modules/ach/enum/form-control-name.enum';

@Component({
  selector: 'byte-t365-confirmation',
  templateUrl: './t365-confirmation.component.html',
  styleUrls: ['./t365-confirmation.component.scss']
})
export class T365ConfirmationComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  sourceAccountSelected!: IAccount;
  targetAccountSelected!: V3IAchAccount;
  bankSettingSelected!: IACHBiesGeneralParameterBank;
  formValues!: I365FormValues;

  voucherLayout!: IDataReading;
  isShowNextButton = true;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get isTokenRequired() {
    return this.handleTokenRequest.isTokenRequired();
  }


  constructor(
    private utils: UtilService,
    private router: Router,
    private parameterManagement: ParameterManagementService,
    private confirmationVoucherDefinitionService: T365dVoucherService,
    private handleTokenRequest: HandleTokenRequestService,
    private modalService: NgbModal,
    private transfer365Service: T365TransactionService,
    private utilsTransaction: UtilTransactionService,
  ) { }

  ngOnInit(): void {
    this.initState();
    this.initDefinition();
    this.utils.hideLoader();
  }

  initState() {
    const state = this.parameterManagement.getParameter<I365HomeState>(PROTECTED_PARAMETER_STATE);

    this.bankSettingSelected = state.bankSelected;
    this.sourceAccountSelected = state.sourceAccountSelected;
    this.targetAccountSelected = state.targetAccountSelected;
    this.formValues = state.formValues;
  }

  initDefinition() {
    this.voucherLayout = this.confirmationVoucherDefinitionService.buildVoucherConfirmationLayout({
      formValues: this.formValues,
      targetAccountSelected: this.targetAccountSelected,
      sourceAccountSelected: this.sourceAccountSelected,
      bankSelected: this.bankSettingSelected,
    });
  }

  previous() {
    this.utils.showLoader();
    const state = this.parameterManagement.getParameter<I365HomeState>(PROTECTED_PARAMETER_STATE);
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        ...state,
      },
      [PROTECTED_PARAMETER_ROUTE]: T365RouteProtected.HOME,
    });

    this.router.navigate([E365UrlCollection.HOME]).finally(() => {});
  }

  nextStep() {
    this.handleExecuteTransaction();
  }

  handleExecuteTransaction() {
    if (this.isTokenRequired) {
      this.openTokenModal();
      return;
    }

    this.executeTransaction()
      .subscribe({
        next: (response) => {
          this.handleResponseTransaction(response);
        }
      })
  }

  openTokenModal() {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${this.utils.getProfile() || 'byte-theme'} sm-600`,
      size: 'lg',
    });

    modal.componentInstance.typeTransaction = ERequestTypeTransaction.ACH_TRANSFER;
    modal.componentInstance.executeService = (token: string) => this.executeTransaction(token);

    modal.dismissed.subscribe(() => {
      return;
    });

    (modal.result as Promise<TAchTransactionResponse>).then(
      (result) => {
        if (!result) return;
        this.handleResponseTransaction(result);
      },
      (error) => error);
  }

  executeTransaction(token?: string) {
    this.utils.showLoader();
    const dataToExecuteTransaction = this.buildBodyRequest();

    return this.transfer365Service.transaction365(this.isTokenRequired, dataToExecuteTransaction, token as string)
      .pipe(
        map(response => this.utilsTransaction.handleResponseTransaction<IACHTransactionResponse>(response)),
        catchError(error => of(this.utilsTransaction.handleErrorTransaction<IACHTransactionResponse>(error))),
      );
  }

  private buildBodyRequest() {
    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');
    const clientType = this.parameterManagement.getParameter('clientType');
    const { formValues } = this.parameterManagement.getParameter<I365HomeState>(PROTECTED_PARAMETER_STATE);

    return new S365TransferRequestBuilder()
      .sourceProduct(this.sourceAccountSelected.product.toString())
      .sourceSubProduct(this.sourceAccountSelected.subproduct.toString())
      .sourceCurrency(this.sourceAccountSelected.currency)
      .sourceAccountNumber(this.sourceAccountSelected.account)
      .sourceAmount(formValues.amount)
      .targetBank(this.targetAccountSelected.bank.toString())
      .targetProduct(Product[this.targetAccountSelected.type] ?? '01')
      .targetAccountNumber(this.targetAccountSelected.account)
      .targetCurrency(this.targetAccountSelected.currency)
      .targetAmount(formValues.amount)
      .commentary(formValues.comment)
      .targetAccountIdentificationNumber(this.targetAccountSelected.documentNumber)
      .clientType(clientType)
      .clientNumber(userInfo.customerCode)
      .sourceAccountName(this.sourceAccountSelected.name)
      .targetAccountType(this.targetAccountSelected.clientType)
      .targetAccountIdentificationType(this.targetAccountSelected.identificationType)
      .targetAccountName(this.targetAccountSelected.name)
      .targetAccountStatus(this.targetAccountSelected.status ?? 'A')
      .targetBankName(this.targetAccountSelected.bankName)
      .targetAccountEmail(this.targetAccountSelected.email)
      .targetAccountCreationDate(this.targetAccountSelected.creationDate)
      .targetAccountModificationDate(this.targetAccountSelected.modificationDate)
      .targetAccountCreationUser(this.targetAccountSelected.userOfCreation)
      .targetAccountModificationUser(this.targetAccountSelected.userOfModification)
      .serviceType(ETMACHTypeTransaction.NORMAL_365)
      .achTransferenceType(ETMACHTypeTransaction.NORMAL_365)
      .clientId(userInfo.customerCode)
      .build();
  }

  handleResponseTransaction(response: TAchTransactionResponse) {
    console.log(response);
    if (+response?.status !== HttpStatusCode.SUCCESS_TRANSACTION && +response?.status !== +HttpStatusCode.SIGNATURE_TRACKING) {
      this.isShowNextButton = false;
      this.utils.hideLoader();
      this.showAlert('error', response?.message ?? '');
      this.utils.scrollToTop();
      return;
    }

    const status = +response.data?.errorCode;
    const message = response.data?.errorDescription ?? 'error:st-missing-connection';

    if (status !== 0 && status !== +HttpStatusCode.SIGNATURE_TRACKING) {
      this.isShowNextButton = false;
      this.utils.hideLoader();
      this.showAlert('error', message);
      this.utils.scrollToTop();
      return;
    }

    const isSignatureTrackingTransaction = status=== Number(HttpStatusCode.SIGNATURE_TRACKING);
    const state = this.parameterManagement.getParameter<I365HomeState>(PROTECTED_PARAMETER_STATE);

    const responseService = {
      reference: response?.data?.referenceNumber ?? '',
      dateTime: response?.data?.dateTime ?? '',
    }

    const parameters: I365ConfirmationState = {
      ...state,
      transactionResponse: isSignatureTrackingTransaction ? null : responseService,
      message: isSignatureTrackingTransaction ? message : undefined,
      typeTransaction: isSignatureTrackingTransaction ? EACHTypeTransaction.SIGNATURE_TRACKING : EACHTypeTransaction.DEFAULT,
    };

    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: parameters,
      [PROTECTED_PARAMETER_ROUTE]: T365RouteProtected.VOUCHER,

    });

    this.router.navigate([E365UrlCollection.VOUCHER]).finally(() => {});
  }

  showAlert(typeAlert: string, message: string) {
    this.typeAlert = typeAlert;
    this.messageAlert = message;
  }

}
