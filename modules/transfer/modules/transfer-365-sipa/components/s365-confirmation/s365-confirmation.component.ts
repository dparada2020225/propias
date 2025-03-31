import { Component, OnInit } from '@angular/core';
import { IAccount } from '../../../../../../models/account.inteface';
import { UtilService } from '../../../../../../service/common/util.service';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { ES365UrlCollection } from '../../enum/url-collection.enum';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { IS365HomeState } from '../../interfaces/state.interface';
import { S368dVoucherService } from '../../services/definition/s368d-voucher.service';
import { IDataReading } from '@adf/components';
import { ModalTokenComponent } from '../../../../../../view/private/token/modal-token/modal-token.component';
import { ERequestTypeTransaction } from '../../../../../../enums/transaction-header.enum';
import {
  IACHTransactionResponse,
  TAchTransactionResponse
} from '../../../transfer-ach/interfaces/ach-transfer.interface';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpStatusCode } from '../../../../../../enums/http-status-code.enum';
import { EACHTypeTransaction } from '../../../transfer-ach/enum/transfer-ach.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilTransactionService } from '../../../../../../service/common/util-transaction.service';
import { IAMS365Account } from '../../../../../accounts-management/interfaces/am-account-list.interface';
import { HandleTokenRequestService } from '../../../../../../service/common/handle-token-request.service';
import {
  S365TransferRequestBuilder,
} from '../../../../interface/365-transfer.interface';
import { Product } from '../../../../../../enums/product.enum';
import { ETMACHTypeTransaction } from '../../../../../transaction-manager/modules/ach/enum/form-control-name.enum';
import { S365TransactionService } from '../../services/transaction/s365-transaction.service';
import { S365TransferRouteProtected } from '../../enum/route-protected.enum';
import { IUserInfo } from '../../../../../../models/user-info.interface';
import { IS365TransferReason, IS365TransferResponse } from '../../interfaces/transfer.interface';

@Component({
  selector: 'byte-s365-confirmation',
  templateUrl: './s365-confirmation.component.html',
  styleUrls: ['./s365-confirmation.component.scss']
})
export class S365ConfirmationComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  voucherLayout!: IDataReading;

  sourceAccountSelected!: IAccount;
  targetAccountSelected!: IAMS365Account;
  reasonSelected!: IS365TransferReason;

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
    private s365VoucherDefinition: S368dVoucherService,
    private modalService: NgbModal,
    private transfer365Service: S365TransactionService,
    private utilsTransaction: UtilTransactionService,
    private handleTokenRequest: HandleTokenRequestService,
  ) { }

  ngOnInit(): void {
    this.initState();
    this.initDefinition();
    this.utils.hideLoader();
  }

  initState() {
    const state = this.parameterManagement.getParameter<IS365HomeState>(PROTECTED_PARAMETER_STATE);

    this.sourceAccountSelected = state.sourceAccountSelected;
    this.targetAccountSelected = state.targetAccountSelected;
    this.reasonSelected = state.reasonSelected;
  }

  initDefinition() {
    const state = this.parameterManagement.getParameter<IS365HomeState>(PROTECTED_PARAMETER_STATE);

    this.voucherLayout = this.s365VoucherDefinition.buildConfirmationVoucherLayout(state);
  }

  previous() {
    this.utils.showLoader();
    this.router.navigate([ES365UrlCollection.HOME]).finally(() => {});
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

    const bodyRequest = this.buildBodyRequestToExecuteTransfer();
    return this.transfer365Service.transfer(bodyRequest, this.isTokenRequired, token as string)
      .pipe(
        map((response) => this.utilsTransaction.handleResponseTransaction<IS365TransferResponse>(response)),
        catchError(error => of(this.utilsTransaction.handleErrorTransaction<IACHTransactionResponse>(error))),
      );
  }

  buildBodyRequestToExecuteTransfer() {
    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');
    const { formValues } = this.parameterManagement.getParameter<IS365HomeState>(PROTECTED_PARAMETER_STATE);
    const clientType = this.parameterManagement.getParameter('clientType');

    return new S365TransferRequestBuilder()
      .sourceProduct(this.sourceAccountSelected.product.toString())
      .sourceSubProduct(this.sourceAccountSelected.subproduct.toString())
      .sourceCurrency(this.sourceAccountSelected.currency)
      .sourceAmount(formValues.amount)
      .sourceAccountNumber(this.sourceAccountSelected.account)
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
      .targetAccountType('N')
      .targetAccountIdentificationType('')
      .targetAccountName(this.targetAccountSelected.name)
      .targetAccountStatus('A')
      .targetBankName(this.targetAccountSelected.bankName)
      .targetAccountEmail('')
      .targetAccountCreationDate('')
      .targetAccountModificationDate('')
      .targetAccountCreationUser('')
      .targetAccountModificationUser('')
      .serviceType(ETMACHTypeTransaction.TRANSFER_SIPA)
      .achTransferenceType(ETMACHTypeTransaction.TRANSFER_SIPA)
      .clientId(userInfo.customerCode)
      .transferReason(this.reasonSelected.code)
      .scheduleDateTime('')
      .country(this.targetAccountSelected.country)
      .build();
  }

  handleResponseTransaction(response: any) {
    if (+response?.status !== HttpStatusCode.SUCCESS_TRANSACTION && +response?.status !== +HttpStatusCode.SIGNATURE_TRACKING) {
      this.utils.hideLoader();
      this.isShowNextButton = false;
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

    const isSignatureTrackingTransaction = status === Number(HttpStatusCode.SIGNATURE_TRACKING);
    const state = this.parameterManagement.getParameter<IS365HomeState>(PROTECTED_PARAMETER_STATE);

    const responseService = {
      reference: response?.data?.referenceNumber ?? '',
      dateTime: response?.data?.dateTime ?? '',
    }

    const parameters: any = {
      ...state,
      transactionResponse: isSignatureTrackingTransaction ? null : responseService,
      message: isSignatureTrackingTransaction ? message : undefined,
      typeTransaction: isSignatureTrackingTransaction ? EACHTypeTransaction.SIGNATURE_TRACKING : EACHTypeTransaction.DEFAULT,
    };

    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: parameters,
      [PROTECTED_PARAMETER_ROUTE]: S365TransferRouteProtected.VOUCHER,
    });

    this.router.navigate([ES365UrlCollection.VOUCHER]).finally(() => {});
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

}
