import { Component, OnInit } from '@angular/core';
import { IAccount } from '../../../../../../models/account.inteface';
import { IDataReading } from '@adf/components';
import { UtilService } from '../../../../../../service/common/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { HandleTokenRequestService } from '../../../../../../service/common/handle-token-request.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { T365TransactionService } from '../../../transfer-365/services/transaction/t365-transaction.service';
import { UtilTransactionService } from '../../../../../../service/common/util-transaction.service';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { ModalTokenComponent } from '../../../../../../view/private/token/modal-token/modal-token.component';
import { ERequestTypeTransaction } from '../../../../../../enums/transaction-header.enum';
import {
  IACHTransactionResponse,
  TAchTransactionResponse
} from '../../../transfer-ach/interfaces/ach-transfer.interface';
import { IUserInfo } from '../../../../../../models/user-info.interface';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpStatusCode } from '../../../../../../enums/http-status-code.enum';
import { EACHTypeTransaction } from '../../../transfer-ach/enum/transfer-ach.enum';
import { M3635StateConfirmation, M365StateHome } from '../../interfaces/state.interface';
import { IFormValuesForEnteredOption, IM365FormValues } from '../../interfaces/form.interface';
import { M365VoucherService } from '../../services/definition/m365-voucher.service';
import { EM365UrlCollection } from '../../enum/url-collection.enum';
import { IACHBiesGeneralParameterBank } from '../../../../../../models/ach-general-parameters.interface';
import {
  AM365Account
} from '../../../../../accounts-management/modules/t365-movil/interfaces/associated-account.interface';
import { S365RouteProtected } from '../../enum/route-protected.enum';
import { S365TransferRequestBuilder } from '../../../../interface/365-transfer.interface';
import { ETMACHTypeTransaction } from '../../../../../transaction-manager/modules/ach/enum/form-control-name.enum';
import { MT365View } from '../../enum/view.enum';
import { HttpErrorResponse } from '@angular/common/http';
import {
  SignatureTrackingService
} from '../../../../../transaction-manager/modules/signature-tracking/services/transaction/signature-tracking.service';
import {
  StBuildUpdateBodyRequestService
} from '../../../../../transaction-manager/modules/signature-tracking/services/definition/st-build-update-body-request.service';

@Component({
  selector: 'byte-m365-confirmation',
  templateUrl: './m365-confirmation.component.html',
  styleUrls: ['./m365-confirmation.component.scss']
})
export class M365ConfirmationComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  sourceAccountSelected!: IAccount;
  beneficiarySelected: AM365Account | undefined;
  bankSettingSelected!: IACHBiesGeneralParameterBank;
  formValues!: IM365FormValues;

  voucherLayout!: IDataReading;
  isShowNextButton = true;
  view: MT365View = MT365View.DEFAULT;

  title = 'ach:bisv:label_home';
  subtitle = 'ach:bisv:label_confirm_subtitle';


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
    private confirmationVoucherDefinitionService: M365VoucherService,
    private handleTokenRequest: HandleTokenRequestService,
    private modalService: NgbModal,
    private transfer365Service: T365TransactionService,
    private utilsTransaction: UtilTransactionService,
    private activatedRoute: ActivatedRoute,
    private stTransactionService: SignatureTrackingService,
    private stBuildUpdateBodyRequest: StBuildUpdateBodyRequestService,
  ) { }

  ngOnInit(): void {
    this.view = this.activatedRoute.snapshot.data['view'];

    if (this.view === MT365View.ST_MODIFY) {
      this.title = 'signature_tracking_label';
      this.subtitle = 'signature_tackingModifyConfirmationTransaction';
    }

    this.initState();
    this.initDefinition();
    this.utils.hideLoader();
  }

  initState() {
    const state = this.parameterManagement.getParameter<M365StateHome>(PROTECTED_PARAMETER_STATE);

    this.bankSettingSelected = state.bankSettingSelected;
    this.sourceAccountSelected = state.sourceAccountSelected;
    this.beneficiarySelected = state.beneficiarySelected;
    this.formValues = state.formValues;
  }

  initDefinition() {
    this.voucherLayout = this.confirmationVoucherDefinitionService.buildVoucherConfirmationLayout({
      formValues: this.formValues,
      bankSettingSelected: this.bankSettingSelected,
      beneficiarySelected: this.beneficiarySelected,
    });
  }

  previous() {
    this.utils.showLoader();

    if (this.view === MT365View.DEFAULT) {
      const state = this.parameterManagement.getParameter<M365StateHome>(PROTECTED_PARAMETER_STATE);
      this.parameterManagement.sendParameters({
        [PROTECTED_PARAMETER_STATE]: {
          ...state,
        },
        [PROTECTED_PARAMETER_ROUTE]: S365RouteProtected.HOME,
      });

      this.router.navigate([EM365UrlCollection.HOME]).finally(() => {});
      return;
    }

    const state = this.parameterManagement.getParameter<M365StateHome>(PROTECTED_PARAMETER_STATE);
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        ...state,
      },
      [PROTECTED_PARAMETER_ROUTE]: S365RouteProtected.ST_MODIFY,
    });
    this.router.navigate([EM365UrlCollection.ST_MODIFY]).finally(() => {});
  }

  nextStep() {
    if (this.view === MT365View.DEFAULT) {
      this.handleExecuteTransaction();
      return;
    }

    this.handleExecuteModifyTransaction();
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

    const bodyRequest = this.buildBodyRequest();
    return this.transfer365Service.transaction365(this.isTokenRequired, bodyRequest, token as string)
      .pipe(
        map(response => this.utilsTransaction.handleResponseTransaction<IACHTransactionResponse>(response)),
        catchError(error => of(this.utilsTransaction.handleErrorTransaction<IACHTransactionResponse>(error))),
      );
  }

  private buildBodyRequest() {
    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');
    const clientType = this.parameterManagement.getParameter('clientType');
    const {
      sourceAccountSelected,
      formValues,
      bankSettingSelected } = this.parameterManagement.getParameter<M365StateHome>(PROTECTED_PARAMETER_STATE);

    const enteredForm = formValues as IFormValuesForEnteredOption;

    return new S365TransferRequestBuilder()
      .sourceProduct(this.sourceAccountSelected.product.toString())
      .sourceSubProduct(this.sourceAccountSelected.subproduct.toString())
      .sourceCurrency(this.sourceAccountSelected.currency)
      .sourceAmount(formValues.amount)
      .sourceAccountNumber(this.sourceAccountSelected.account)
      .targetBank(bankSettingSelected.code.toString())
      .targetProduct('01')
      .targetAccountNumber(this.beneficiarySelected?.account ?? enteredForm?.numberPhone ?? '')
      .targetCurrency(this.beneficiarySelected?.currency ?? sourceAccountSelected.currency)
      .targetAmount(formValues.amount)
      .commentary(formValues.comment)
      .targetAccountIdentificationNumber('')
      .clientType(clientType)
      .clientNumber(userInfo.customerCode)
      .sourceAccountName(this.sourceAccountSelected.name)
      .targetAccountType('N')
      .targetAccountIdentificationType('')
      .targetAccountName(this.beneficiarySelected?.name ?? enteredForm?.nameBeneficiary ?? '')
      .targetAccountStatus('A')
      .targetBankName(bankSettingSelected.description ?? '')
      .targetAccountEmail('')
      .targetAccountCreationDate('')
      .targetAccountModificationDate('')
      .targetAccountCreationUser('')
      .targetAccountModificationUser('')
      .serviceType(ETMACHTypeTransaction.MOVIL_365)
      .achTransferenceType(ETMACHTypeTransaction.MOVIL_365)
      .clientId(userInfo.customerCode)
      .build();
  }

  handleResponseTransaction(response: any) {
    if (+response?.status !== HttpStatusCode.SUCCESS_TRANSACTION && +response?.status !== +HttpStatusCode.SIGNATURE_TRACKING) {
      this.utils.hideLoader();
      this.showAlert('error', response?.message ?? '');
      this.utils.scrollToTop();
      this.isShowNextButton = false;
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
    const state = this.parameterManagement.getParameter<M365StateHome>(PROTECTED_PARAMETER_STATE);


    const responseService = {
      reference: response?.data?.referenceNumber ?? '',
      dateTime: response?.data?.dateTime ?? '',
    }

    const parameters: M3635StateConfirmation = {
      ...state,
      transactionResponse: isSignatureTrackingTransaction ? null : responseService,
      message: isSignatureTrackingTransaction ? message : undefined,
      typeTransaction: isSignatureTrackingTransaction ? EACHTypeTransaction.SIGNATURE_TRACKING : EACHTypeTransaction.DEFAULT,
    };

    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: parameters,
      [PROTECTED_PARAMETER_ROUTE]: S365RouteProtected.VOUCHER,
    });

    this.router.navigate([EM365UrlCollection.VOUCHER]).finally(() => {});
  }

  handleExecuteModifyTransaction() {
    const state = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);

    const updateParams = {
      transactionCode: state?.transactionSelected?.reference,
      serviceModify: state.transactionSelected?.serviceCode,
      data: this.getBodyToUpdateTransaction(),
    };

    this.utils.showLoader();
    this.stTransactionService.update(updateParams).subscribe({
      next: (response) => {
        this.goToSignatureTrackingVoucher(response?.reference, response?.dateTime);
      },
      error: (error: HttpErrorResponse) => {
        if (error?.error?.code === HttpStatusCode.SIGNATURE_TRACKING_MODIFY_SUCCESS) {
          this.goToSignatureTrackingVoucher(error?.error?.reference ?? undefined, error?.error?.dateTime ?? undefined);
          return;
        }

        this.showAlert('error', error?.error?.message ?? 'signature_tracking:error:modify_transaction');
      },
    });
  }

  getBodyToUpdateTransaction() {
    const state = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);
    return this.stBuildUpdateBodyRequest.buildBodyToUpdateAchUniTxn(state);
  }

  goToSignatureTrackingVoucher(reference: string, date: string) {
    const state = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);

    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        ...state,
        transactionResponse: {
          reference,
          dateTime: date,
        },
      },
      [PROTECTED_PARAMETER_ROUTE]: S365RouteProtected.ST_MODIFY_VOUCHER,
    });

    this.router.navigate([EM365UrlCollection.ST_MODIFY_VOUCHER]).finally(() => {});
  }

  showAlert(typeAlert: string, message: string) {
    this.typeAlert = typeAlert;
    this.messageAlert = message;
  }
}
