import { AdfFormBuilderService, IDataReading, ILayout } from '@adf/components';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, Subscription } from 'rxjs';
import {
  IExecuteTransactionWithToken,
  IExecuteTransactionWithTokenFailedResponse
} from 'src/app/models/token-service-response.interface';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { ModalTokenComponent } from 'src/app/view/private/token/modal-token/modal-token.component';
import { environment } from 'src/environments/environment';
import { IDataPayment } from '../../../interfaces/crud/crud-third-party-loans-interface';
import {
  ENavigateProtectionParameter,
  EPaymentLoansFlowView,
  ETPLPaymentUrlNavigationCollection
} from '../../../enum/navigate-protection-parameter.enum';
import { IPaymentExecute } from '../../../interfaces/payment-third-party-loans-interface';
import { TpldPaymentManagerService } from '../../../services/definition/payment/tpld-payment-manager.service';
import { ThirdPartyLoansService } from '../../../services/transaction/third-party-loans.service';
import { ERequestTypeTransaction } from '../../../../../../../enums/transaction-header.enum';
import { HttpStatusCode } from '../../../../../../../enums/http-status-code.enum';
import { AttributeFormThirdPartyLoansCrud } from '../../../enum/third-party-loans-control-name.enum';
import { ITPLVoucherParameterState, ITPLVoucherState } from '../../../interfaces/third-party-loans.interface';
import { EConfirmationAction } from '../../../enum/payment-form.enum';

@Component({
  selector: 'byte-confirmation-payment-tpl',
  templateUrl: './confirmation-payment-tpl.component.html',
  styleUrls: ['./confirmation-payment-tpl.component.scss'],
})
export class ConfirmationPaymentTPLComponent implements OnInit, OnDestroy {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  errorExist: boolean = false;

  confirmationPaymentLayout!: ILayout;
  confirmationPaymentForm!: FormGroup;
  layoutJsonConfirmation!: IDataReading;

  reference: string | null = null;
  date: string | null = null;

  dataToPay!: IDataPayment;
  dataToExecutePayment: IPaymentExecute | null = null;
  routerSubscription: Subscription;
  view!: EPaymentLoansFlowView;

  constructor(
    private tplFormBuilder: AdfFormBuilderService,
    private modalService: NgbModal,
    private util: UtilService,
    private spinner: NgxSpinnerService,
    private thirdPartyLoansTransactionService: ThirdPartyLoansService,
    private router: Router,
    private parameterManagement: ParameterManagementService,
    private paymentManagerService: TpldPaymentManagerService
  ) {
    this.routerSubscription = this.router.events.subscribe((event: any) => {
      if (event.navigationTrigger === 'popstate') {
        this.back();
      }
    });
  }

  ngOnInit(): void {
    this.dataToPay = this.parameterManagement.getParameter('navigateStateParameters');
    this.view = this.parameterManagement.getParameter('navigateStateParameters')?.view;
    this.initDefinition();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  initDefinition() {
    this.confirmationLayoutDefinition(this.dataToPay, this.dataToPay.amount);
  }

  confirmationLayoutDefinition(dataToPaymentVoucher: any, amountToPay: string) {
    this.layoutJsonConfirmation = this.paymentManagerService.buildPaymentConfirmScreenReading(dataToPaymentVoucher, amountToPay);
    this.confirmationPaymentLayout = this.paymentManagerService.buildPaymentConfirmScreenForm();
    this.confirmationPaymentForm = this.tplFormBuilder.formDefinition(this.confirmationPaymentLayout.attributes);
    this.confirmationPaymentForm?.get('email')?.setValue(this.dataToPay.loanDetailToPayment?.detailLoan?.email);
  }

  handlerTokenValidate() {
    if (!this.confirmationPaymentForm.valid) {
      this.confirmationPaymentForm.markAllAsTouched();
      return;
    }

    const isTokenRequired = this.parameterManagement.getParameter('isTokenRequired');

    if (isTokenRequired) {
      this.openTokenModal();
      return;
    }

    this.handlerExecuteTransfer().subscribe((dataResponse) => {
      this.handleExecuteTransactionResponse(dataResponse);
    });
  }

  openTokenModal() {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} sm-600`,
      size: 'lg',
    });

    modal.componentInstance.tokenType = this.util.getTokenType();
    modal.componentInstance.typeTransaction = ERequestTypeTransaction.THIRD_LOAN_PAYMENT;
    modal.componentInstance.executeService = this.handlerExecuteTransfer.bind(this);

    modal.dismissed.subscribe((a) => {
      return;
    });

    modal.result
      .then((result) => {
        if (!result) {
          return;
        }

        this.handleExecuteTransactionResponse(result);
      })
      .catch((error) => {});
  }

  handlerExecuteTransfer(tokenValue?: string) {
    this.spinner.show('main-spinner');
    const isTokenRequired = this.parameterManagement.getParameter('isTokenRequired');
    const serviceResponse: Subject<any> = new Subject();
    const obs = serviceResponse.asObservable();

    const notifyEmail: string = this.confirmationPaymentForm?.get('email')?.value;
    const description: string = this.confirmationPaymentForm?.get('comment')?.value;

    this.dataToExecutePayment = {
      loanIdentifier: `${this.dataToPay.loanDetailToPayment.identifierLoan}`,
      currency: `${this.dataToPay.loanDetailToPayment.currencyLoan}`,
      amount: `${this.dataToPay.amount}`,
      loanProduct: `${this.dataToPay.loanDetailToPayment.detailLoan.loanProduct}`,
      loanSubProduct: `${this.dataToPay.loanDetailToPayment.detailLoan.loanSubProduct}`,
      accountProduct: this.dataToPay.loanDetailToPayment.accountDebited.product,
      accountSubProduct: this.dataToPay.loanDetailToPayment.accountDebited.subproduct,
      accountDebited: this.dataToPay.loanDetailToPayment.accountDebited.account,
      aliasAccountDebit : `${this.dataToPay.loanDetailToPayment.accountDebited.alias}`,
      totalPayment: this.dataToPay.loanDetailToPayment.detailLoan.totalPayment,
      extraName: this.dataToPay.loanDetailToPayment.detailLoan?.loanName,
      extraAlias: `${this.dataToPay.loanDetailToPayment.detailLoan.alias}`,
      email: `${notifyEmail.toLowerCase()}`,
      description,
      extraPaymentType: this.dataToPay.typePayment,
      extraInstallmentNumber: `${this.dataToPay.quotas}`,
    };


    this.thirdPartyLoansTransactionService.paymentExecute(this.dataToExecutePayment, isTokenRequired, tokenValue!).subscribe({
      next: (response) => {
        serviceResponse.next({
          status: 200,
          data: response,
        } as IExecuteTransactionWithToken);
      },
      error: (error: HttpErrorResponse) => {
        if (((error?.error && error?.error?.status) || (error && error?.status)) === HttpStatusCode.INVALID_TOKEN) {
          serviceResponse.next({
            status: HttpStatusCode.INVALID_TOKEN,
            message: error?.error?.message,
            error: error?.error,
          } as IExecuteTransactionWithTokenFailedResponse);
          this.spinner.hide('main-spinner');
          return;
        }

        if (error?.error?.code === HttpStatusCode.SIGNATURE_TRACKING) {
          serviceResponse.next({
            status: HttpStatusCode.SIGNATURE_TRACKING,
            data: null,
            message: error?.error?.message,
          } as IExecuteTransactionWithToken);
          return;
        }

        serviceResponse.next({
          status: error?.status,
          message: error?.error?.message ?? 'error:payment_execute_transaction',
          error: error?.error,
        } as IExecuteTransactionWithTokenFailedResponse);
      },
    });

    return obs;
  }

  handleExecuteTransactionResponse(transactionResponse: any) {
    const getDataForm: ITPLVoucherState = {
      notifyTo: this.confirmationPaymentForm?.get(AttributeFormThirdPartyLoansCrud.EMAIL)?.value,
      comment: this.confirmationPaymentForm?.get(AttributeFormThirdPartyLoansCrud.COMMENT)?.value,
      aliasAccountDebited: `${this.dataToPay.loanDetailToPayment.accountDebited.alias}`,
      nameAccountDebited: this.dataToPay.loanDetailToPayment.accountDebited.name,
      aliasLoan: `${this.dataToPay.loanDetailToPayment.detailLoan.alias}`,
      nameLoan: this.dataToPay.loanDetailToPayment.detailLoan.loanName,
    };

    const dataToExecutePayment: IPaymentExecute = this.dataToExecutePayment as IPaymentExecute;

    const getDataExecutePayment: ITPLVoucherParameterState = {  ...dataToExecutePayment, ...getDataForm };

    if (transactionResponse?.status !== 200 && transactionResponse?.status !== HttpStatusCode.SIGNATURE_TRACKING) {
      this.handleResponseForErrorPayment(getDataExecutePayment, transactionResponse);
      return;
    }

    this.util.showLoader();

    if (transactionResponse?.status === HttpStatusCode.SIGNATURE_TRACKING) {
      this.handleResponseForSignatureTrackingFlow(getDataExecutePayment, transactionResponse);
      return;
    }

    this.handleResponseSuccessDefaultFlow(getDataExecutePayment, transactionResponse);
  }

  handleResponseForErrorPayment(stateParameters: ITPLVoucherParameterState, transactionResponse: any) {
    const dataExecutePaymentResponse = {
      message: transactionResponse?.message ?? 'error:payment_execute_transaction',
      action: EConfirmationAction.ERROR_PAYMENT,
      data: stateParameters,
      isError: true,
      view: this.view,
    };

    this.parameterManagement.sendParameters({
      navigateStateParameters: dataExecutePaymentResponse,
      navigationProtectedParameter: ENavigateProtectionParameter.CONFIRMATION,
    });
    this.router.navigate([ETPLPaymentUrlNavigationCollection.DEFAULT_CONFIRMATION]).then(() => {});
  }

  handleResponseForSignatureTrackingFlow(stateParameters: ITPLVoucherParameterState, transactionResponse: any) {
    const dataToBuildSignatureTrackingVoucher = {
      data: stateParameters,
      message: transactionResponse?.message,
      currentView: this.view,
    };

    this.parameterManagement.sendParameters({
      navigateStateParameters: dataToBuildSignatureTrackingVoucher,
      navigationProtectedParameter: ENavigateProtectionParameter.VOUCHER_ST_TRANSACTION,
    });

    this.router.navigate([ETPLPaymentUrlNavigationCollection.DEFAULT_VOUCHER]).finally(() => this.hiddenDefaultSpinner());
  }

  handleResponseSuccessDefaultFlow(stateParameters: ITPLVoucherParameterState, transactionResponse: any) {
    const dataExecutePaymentResponse = {
      reference: transactionResponse.data.reference,
      dateTime: transactionResponse.data.dateTime,
      message: 'payment_successful_tpl',
      action: EConfirmationAction.PAYMENT,
      data: stateParameters,
      isError: false,
      view: this.view,
    };

    this.parameterManagement.sendParameters({
      navigateStateParameters: dataExecutePaymentResponse,
      navigationProtectedParameter: ENavigateProtectionParameter.CONFIRMATION,
    });
    this.router.navigate([ETPLPaymentUrlNavigationCollection.DEFAULT_CONFIRMATION]).then(() => {});
  }

  back() {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: ENavigateProtectionParameter.PAYMENT,
      navigateStateParameters: {
        ...this.dataToPay,
      } as IDataPayment,

    });

    this.router.navigate([ETPLPaymentUrlNavigationCollection.HOME_TRANSACTION]).then(() => {});
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  hiddenDefaultSpinner() {
    this.spinner.hide('main-spinner');
  }

  hiddenAlert() {
    this.typeAlert = null;
    this.messageAlert = null;
  }
}
