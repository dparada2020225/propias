import {
  AdfFormBuilderService,
  AdfFormatService,
  IDataReading,
  IDataSelect,
  ILayout,
  MaskOptionsBuilder
} from '@adf/components';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, of } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { ETPLTypePayment } from '../../../../../../../enums/payment-type.enum';
import { IAccount } from '../../../../../../../models/account.inteface';
import { IFlowError } from '../../../../../../../models/error.interface';
import {
  ENavigateProtectionParameter,
  EPaymentLoansFlowView,
  ETPLPaymentUrlNavigationCollection
} from '../../../enum/navigate-protection-parameter.enum';
import {
  EThirdPartyLoanTypeMethod, ETypePaymenteSelected
} from '../../../enum/payment-form.enum';
import { TPLPTypeView } from '../../../enum/payment.interface';
import { AttributeFormThirdPartyLoansCrud } from '../../../enum/third-party-loans-control-name.enum';
import {
  DataPayment,
  IConsultDetailTPL,
  IConsultNumberLoan,
  IDataPayment,
  IThirdPartyLoanAssociate
} from '../../../interfaces/crud/crud-third-party-loans-interface';
import {
  IAccountSelected,
  IConsultQuotasAmount,
  IPartialPayment,
  IQuotasAmountResponse
} from '../../../interfaces/payment-third-party-loans-interface';
import { TpldPaymentManagerService } from '../../../services/definition/payment/tpld-payment-manager.service';
import { ThirdPartyLoansService } from '../../../services/transaction/third-party-loans.service';
import {
  TpplePaymentFormService
} from '../../../services/execution/third-party-loan-payment/tpple-payment-form.service';
import {
  ITPLPEFormModifyPaymentStateFromST,
  ITPLPEModifyPaymentState
} from '../../../interfaces/tplpe-modify-payment.interface';
import {
  ESignatureTrackingUrlFlow
} from '../../../../../../transaction-manager/modules/signature-tracking/enum/st-navigate-enum';

@Component({
  selector: 'byte-tpl-payment-form',
  templateUrl: './tpl-payment-form.component.html',
  styleUrls: ['./tpl-payment-form.component.scss'],
})
export class TplPaymentFormComponent implements OnInit, OnDestroy {

  @ViewChild('partialAmountInput') partialAmountInput!: FormControl;

  loanTransaction: IThirdPartyLoanAssociate | null = null;
  detailLoanPayment: IConsultDetailTPL | null = null;
  paymentDetailLayout: IDataReading | null = null;
  accountDebitList: IAccount[] = [];
  formLayout!: ILayout;
  form!: FormGroup;
  options: IDataSelect[] = [];
  timeout: any;

  typeAlert: string | null = null;
  messageAlert: string | null = null;

  currentMethodSelected: string | null = null;
  quotaPaymentMethod = EThirdPartyLoanTypeMethod.QUOTA;
  partialPaymentMethod = EThirdPartyLoanTypeMethod.PARTIAL;
  debitedAccountSelected: any | null = null;
  currentCounterValue: number | null = 1;
  maxQuota: number = 20;
  minQuota: number = 1;
  quotaToPay: string | null = null;
  dataToPayment!: DataPayment;
  amountToPay: Array<any> = [];
  total: Array<any> = [];
  isLoading: boolean = false;
  partialAmountForm!: FormGroup;
  isQuotasCounterSelect: boolean = false;
  isPartialAmountSelect: boolean = false;
  typePaymentSelected: string = '0';
  installmentNumber: string = '0';
  amountMask: any;
  initialValue: number = 1;
  errorQuotaValueMax: boolean = false;
  errorQuotaValueMin: boolean = false;
  errorEmptyValueCounter: boolean = false;
  messageError: boolean = false;
  errorPaymentPartial: boolean = false;
  inputAmount!: FormControl;
  view: TPLPTypeView | null = null;
  selectedSourceAccount: IAccount | null = null;
  routerSubscription: Subscription;
  currentView!: EPaymentLoansFlowView;

  get DefaultView() {
    return TPLPTypeView.DEFAULT;
  }

  get signatureTrackingView() {
    return TPLPTypeView.ST_MODIFY_TRANSACTIONS;
  }

  get getCurrentLabelForPartialPaymentInput() {
    this.debitedAccountSelected = this.loanTransaction?.currencyCode;
    return this.debitedAccountSelected ? `${this.debitedAccountSelected} 0.00` : 'L 0.00';
  }

  get controlForInputAmount(): FormControl {
    return this.partialAmountForm.get('inputAmount') as FormControl;
  }

  get isActiveClass(): boolean {
    return this.errorQuotaValueMax || this.errorQuotaValueMin || this.errorEmptyValueCounter;
  }

  get isErrorInInputAmountField(): boolean {
    const isRequired: boolean = this.controlForInputAmount.errors?.['required'];
    const x: boolean = this.controlForInputAmount.errors?.['incorrect'] && !this.errorPaymentPartial;
    return isRequired || x;
  }

  constructor(
    private adfFormBuilder: AdfFormBuilderService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private parameterManagement: ParameterManagementService,
    private router: Router,
    private paymentDefinitionManager: TpldPaymentManagerService,
    private util: UtilService,
    private thirdPartyLoansTransactionService: ThirdPartyLoansService,
    private formatService: AdfFormatService,
    private translate: TranslateService,
    private thirdPartyExecutionForm: TpplePaymentFormService,
  ) {
    this.routerSubscription = this.router.events.subscribe((event: any) => {
      if (event.navigationTrigger === 'popstate') {
        this.back();
      }
    });
  }

  ngOnInit(): void {
    const currentState = this.parameterManagement.getParameter('navigateStateParameters');
    this.currentView = currentState?.view;
    this.loanTransaction = currentState?.loanToPayment;
    this.maxQuota = currentState?.maxQuotas;
    this.view = this.route.snapshot.data?.['view'];

    this.initDefinition();
    this.getLoanDetail();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  initDefinition() {
    const sourceAccountResponse: IAccount[] | IFlowError = this.route.snapshot.data?.['debitLoansNumbers'];

    const { selectForm, partialAmountForm, options, selectFormLayout } = this.thirdPartyExecutionForm.formScreenBuilder({
      sourceAccounts: sourceAccountResponse,
      currentLoanToPayment: this.loanTransaction as IThirdPartyLoanAssociate,
    });

    this.formLayout = selectFormLayout;
    this.form = selectForm;
    this.partialAmountForm = partialAmountForm;
    this.options = options;
    this.accountDebitList = sourceAccountResponse as IAccount[];

    this.changeFormSimple();
  }

  changeFormSimple(): void {
    this.form?.get(AttributeFormThirdPartyLoansCrud.NUMBER_ACCOUNT)?.valueChanges
      .subscribe((account) => {
        this.changeAccountDebited(account);
      });

    this.form?.get(AttributeFormThirdPartyLoansCrud.PAYMENT_OPTION)?.valueChanges
      .subscribe((optionValue) => {
        this.currentMethodSelected = optionValue;
        if (this.currentMethodSelected === EThirdPartyLoanTypeMethod.QUOTA) {
          this.handleChangeByCounterValue();
        }
        if (this.currentMethodSelected === EThirdPartyLoanTypeMethod.PARTIAL) {
          this.handleChangeByPartialAmount();
        }
      });
  }

  handleChangeByCounterValue() {
    this.getCounterValue(this.currentCounterValue!);
    this.isQuotasCounterSelect = true;
    this.isPartialAmountSelect = false;
    this.typePaymentSelected = ETypePaymenteSelected.QUOTA;
    this.clearErrorPartialPayment();
  }

  handleChangeByPartialAmount() {
    this.installmentNumber = '0';
    this.isQuotasCounterSelect = false;
    this.isPartialAmountSelect = true;
    this.messageError = false;
    this.typePaymentSelected = ETypePaymenteSelected.PARTIAL;
  }

  changeAccountDebited(accountNumber: string) {
    const {  sourceAccount } = this.thirdPartyExecutionForm.changeAccountDebited(accountNumber) ?? {};

    this.selectedSourceAccount = sourceAccount as IAccount;
    this.goToPaymentVoucher(sourceAccount as IAccount);
  }

  handleSetStateFromStorage() {
    const paymentState = this.parameterManagement.getParameter('navigateStateParameters');

    const typePayment = (paymentState?.typePayment ?? 'UNDEFINED').trim();
    const typePaymentSelected = typePayment === ETPLTypePayment.QUOTAS ? EThirdPartyLoanTypeMethod.QUOTA : EThirdPartyLoanTypeMethod.PARTIAL;

    if (this.view === this.DefaultView && paymentState?.amount) {
      this.setStateFromDefaultFlow(paymentState, typePaymentSelected);
      return;
    }

    if (this.view === this.signatureTrackingView) {
      this.setStateFromSignatureTracking(paymentState, typePaymentSelected);
    }
  }

  setStateFromDefaultFlow(paymentState: IDataPayment, typePaymentSelected: string) {
    const typePaymentState = paymentState?.typePayment;
    const paymentType = typePaymentState === ETPLTypePayment.QUOTAS ? EThirdPartyLoanTypeMethod.QUOTA : EThirdPartyLoanTypeMethod.PARTIAL;

    if (paymentType === EThirdPartyLoanTypeMethod.QUOTA) {
      this.initialValue = this.util.parseCustomNumber(paymentState?.quotas as string);
      this.currentCounterValue = this.util.parseCustomNumber(paymentState?.quotas as string);
      of(true)
        .pipe(delay(300))
        .subscribe(() => {
          this.form?.get(AttributeFormThirdPartyLoansCrud.PAYMENT_OPTION)?.setValue(paymentType);
        });
    }

    if (paymentType === EThirdPartyLoanTypeMethod.PARTIAL) {
      this.form?.get(AttributeFormThirdPartyLoansCrud.PAYMENT_OPTION)?.setValue(typePaymentSelected);
      this.partialAmountForm?.get('inputAmount')?.setValue(paymentState?.amount);
    }

    const accountNumber = paymentState?.loanDetailToPayment?.accountDebited?.account;
    const sourceAccount = this.util.findSourceAccount(accountNumber, this.accountDebitList)

    if (sourceAccount) {
      this.form?.get(AttributeFormThirdPartyLoansCrud.NUMBER_ACCOUNT)?.setValue(accountNumber);
    }
  }

  setStateFromSignatureTracking(paymentState: any, typePaymentSelected: string) {
    const sourceAccountNumber = paymentState?.detailTransaction?.sourceAccount;
    const sourceAccount = this.accountDebitList.find((account) => account?.account === sourceAccountNumber);

    if (sourceAccount) {
      this.selectedSourceAccount = sourceAccount;
      this.form?.get(AttributeFormThirdPartyLoansCrud.NUMBER_ACCOUNT)?.setValue(paymentState?.detailTransaction?.sourceAccount);
    }

    if (typePaymentSelected === EThirdPartyLoanTypeMethod.QUOTA) {
      const currentQuotas = (paymentState?.detailTransaction?.quotas).trim();
      this.setQuotaAmountForm(currentQuotas, currentQuotas, typePaymentSelected);
    }

    if (typePaymentSelected === EThirdPartyLoanTypeMethod.PARTIAL) {
      this.setPartialAmountForm(typePaymentSelected, paymentState?.detailTransaction?.sourceAmount);
    }
  }

  setPartialAmountForm(typePaymentSelected: string, amountValue: string) {
    this.form?.get(AttributeFormThirdPartyLoansCrud.PAYMENT_OPTION)?.setValue(typePaymentSelected);
    this.partialAmountForm?.get('inputAmount')?.setValue(amountValue);
  }

  setQuotaAmountForm(initialValue: number, currentValue: number, typePaymentSelected: string) {
    this.initialValue = initialValue;
    this.currentCounterValue = currentValue;
    of(true)
      .pipe(delay(300))
      .subscribe(() => {
        this.form?.get(AttributeFormThirdPartyLoansCrud.PAYMENT_OPTION)?.setValue(typePaymentSelected);
      });
  }


  /*
   * CONSULT DETAIL LOAN FROM SERVICE AND CREATE SCREEN
   * SET CURRENCY CODE ON PROPERTY DEBITED ACCOUNT SELECTED
   */
  getLoanDetail(): void {
    this.util.showLoader();

    const identifier: IConsultNumberLoan = {
      identifier: this.loanTransaction?.identifier!,
    };

    this.thirdPartyLoansTransactionService
      .consultDetail(identifier)
      .pipe(finalize(() => this.util.hideLoader()))
      .subscribe({
        next: (dataResponse: IConsultDetailTPL) => {
          this.setMask(dataResponse);
          this.detailLoanPayment = dataResponse;
          this.debitedAccountSelected = dataResponse.currencyCode;
          this.paymentDetailLayout = this.paymentDefinitionManager.buildPaymentDetailLayout(this.detailLoanPayment, identifier.identifier);
          this.handleSetStateFromStorage();
        },
        error: (error: HttpErrorResponse) => {
          this.showAlert('error', error?.error?.message ?? 'error:getting_detail_loan');
        },
      });
  }

  /*
   * SET TYPE CURRENCY ON INPUT PARTIAL AMOUNT
   */
  setMask(account: any): void {
    const currencyFormat = this.util.getCurrencySymbolToIso(account?.currencyCode ?? 'UNDEFINED');
    this.amountMask = new MaskOptionsBuilder().mask(this.util.getAmountMask(currencyFormat)).build();
  }

  /*
   * METHOD TO PREPARE DATA TO PAY AND MAKE OBJECT
   */
  goToPaymentVoucher(dataSelected: IAccountSelected) {
    this.dataToPayment = {
      accountDebited: dataSelected,
      detailLoan: this.detailLoanPayment!,
      identifierLoan: this.loanTransaction?.identifier!,
      currencyLoan: this.detailLoanPayment?.currencyCode,
    };
  }

  /*
   *METHOD TO GET COUNTER COMPONENT VALUE
   */
  getCounterValue(value?: number): void {
    if (value! > this.maxQuota) {
      this.errorQuotaValueMax = true;
      this.isLoading = false;
      this.quotaToPay = this.translate.instant('error_maxQuota');
      return;
    }

    if (value! < this.minQuota) {
      this.errorQuotaValueMin = true;
      this.isLoading = false;
      this.quotaToPay = this.translate.instant('error_minQuota');
      return;
    }

    if (this.isQuotasCounterSelect) {
      this.errorQuotaValueMax = false;
      this.errorQuotaValueMin = false;
      this.errorEmptyValueCounter = false;
      this.getQuotasToPay(value);
    }
  }

  /*
   * METHOD OF INQUIRY OF AMOUNT TO PAY IN INSTALLMENTS
   */
  getQuotasToPay(value?: number): void {
    this.isLoading = true;
    let quotaToPay: string = '';

    if (value) {
      quotaToPay = value.toString();
    }
    const request: IConsultQuotasAmount = {
      identifier: this.loanTransaction?.identifier!,
      amountInstallmentsPay: quotaToPay,
    };

    const formatCurrency = this.util.getCurrencySymbolToIso(this.detailLoanPayment?.currencyCode ?? 'UNDEFINED');

    this.thirdPartyLoansTransactionService
      .consultQuotasPayment(request)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (dataResponse: IQuotasAmountResponse) => {
          this.hiddenAlert();
          this.maxQuota = parseInt(dataResponse.maxNumInstallments);
          this.quotaToPay = `${formatCurrency} ${this.formatService.formatAmount(dataResponse?.valueInstallments ?? '')}`;
          this.amountToPay.push(dataResponse?.valueInstallments);
          this.installmentNumber = dataResponse.amountInstallments;
        },
        error: (error: HttpErrorResponse) => {
          this.showAlert('error', error?.error?.message ?? 'error:getting_detail_loan');
          this.util.scrollToTop();
          this.messageError = true;
        },
      });
  }

  /*
   * METHOD TO RETURN TO DASHBOARD AND CLEAN DATA ON
   * LOAN TRANSACTION PAYMENT
   */
  back(): void {
    if (this.view === this.signatureTrackingView) {
      this.util.showLoader();

      this.parameterManagement.sendParameters({
        loanTransactionToPayment: null,
        navigateStateParameters: null,
      });

      this.router.navigate([ESignatureTrackingUrlFlow.HOME]).then(() => {});
      return;
    }

    this.parameterManagement.sendParameters({
      loanTransactionToPayment: null,
      navigationProtectedParameter: null,
      navigateStateParameters: null,
    });


    if(this.currentView === EPaymentLoansFlowView.ALL_LOANS){
      this.router.navigate([ETPLPaymentUrlNavigationCollection.HOME2]).then(() => {});
    } else {
      this.router.navigate([ETPLPaymentUrlNavigationCollection.HOME]).then(() => {});
    }
  }

  /*
   * METHOD TO VALIDATE FORM AND SEND DATA TO PAYMENT VOUCHER
   * NAVIGATE TO PAYMENT VOUCHER COMPONENT
   */
  next(): void {
    const validateQuotasCounter = this.validateQuotasCounter();

    if (validateQuotasCounter) {
      this.util.scrollToTop();
      return;
    }

    const validatePartialInput = this.validatePartialInput();
    if (validatePartialInput) {
      return;
    }

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.view === this.signatureTrackingView) {
      this.handleNavigationForSignatureTrackingFlow();
      return;
    }

    this.handleNavigationForDefaultFlow();
  }

  handleNavigationForSignatureTrackingFlow() {
    this.util.showLoader();
    const paymentState: ITPLPEFormModifyPaymentStateFromST = this.parameterManagement.getParameter('navigateStateParameters');

    const stateToUpdateFlow: ITPLPEModifyPaymentState = {
      ...paymentState,
      data: this.detailLoanPayment as IConsultDetailTPL,
      amount: this.getAmountByTypePayment(),
      quotasSelected: this.getQuotaToPay(),
      typePayment: this.typePaymentSelected,
      selectedSourceAccount: this.selectedSourceAccount as IAccount,
    }

    this.parameterManagement.sendParameters({
      navigateStateParameters: stateToUpdateFlow,
      navigationProtectedParameter: ENavigateProtectionParameter.CONFIRMATION_ST_MODIFY_TRANSACTION,
    });

    this.router.navigate([ETPLPaymentUrlNavigationCollection.SIGNATURE_TRACKING_CONFIRMATION]).finally(() => this.util.hideLoader());
  }

  handleNavigationForDefaultFlow() {
    const dataToPayment: IDataPayment = {
      loanDetailToPayment: this.dataToPayment,
      amount: this.getAmountByTypePayment(),
      typePayment: this.typePaymentSelected,
      quotas: this.getQuotaToPay(),
      loanToPayment: this.loanTransaction as IThirdPartyLoanAssociate,
      view: this.currentView,
      maxQuotas: this.maxQuota,
    };

    this.parameterManagement.sendParameters({
      navigateStateParameters: dataToPayment,
      navigationProtectedParameter: ENavigateProtectionParameter.PAYMENT_VOUCHER,
    });

    this.amountToPay = [];

    this.util.showLoader();
    if (this.typePaymentSelected === ETypePaymenteSelected.PARTIAL) {
      this.partialPaymentValidationTrigger();
      return;
    }

    this.router.navigate([ETPLPaymentUrlNavigationCollection.DEFAULT_PAYMENT_VOUCHER]).then(() => this.util.hideLoader());

  }

  getQuotaToPay(): string {
    if (this.typePaymentSelected === ETPLTypePayment.QUOTAS) {
      return this.installmentNumber;
    }

    return '0';
  }

  getAmountByTypePayment() {
    switch (this.typePaymentSelected) {
      case ETPLTypePayment.QUOTAS:
        return this.amountToPay[this.amountToPay.length - 1];
      case ETPLTypePayment.PARTIAL:
        return this.partialAmountForm?.get('inputAmount')?.value;
      default:
        return 0
    }
  }

  showAlert(type: string, message: string): void {
    this.typeAlert = type;
    this.messageAlert = message;
  }


  hiddenAlert(): void {
    this.typeAlert = null;
    this.messageAlert = null;
  }


  /**
   * CLEAR VALIDATORS TO
   * PARTIAL PAYMENT INPUT
   */
  clearErrorPartialPayment() {
    this.partialAmountForm?.get('inputAmount')?.reset();
  }

  /**
   * VALIDATE IF THE COUNTER VALUE
   * HAS AN ERROR
   */
  validateQuotasCounter() {
    const isValueCounterValid = this.isLoading || this.errorQuotaValueMax || this.errorQuotaValueMin || this.errorEmptyValueCounter || !this.quotaToPay || this.amountToPay.length <= 0;
    return this.isQuotasCounterSelect && isValueCounterValid;
  }

  /**
   * VALIDATE IF THE COUNTER COMPONENT
   * IT´S EMPTY
   */
  handleLoaderBYInputCounterChange() {
    this.isLoading = true;
  }

  /**
   * VALIDATE IF THE PARTIAL INPUT
   * HAS AN ERROR
   */
  validatePartialInput() {
    let hasError: boolean = false;
    const valuePartialAmount: string = this.partialAmountForm?.get('inputAmount')?.value;
    if (this.isPartialAmountSelect) {
      if (!this.partialAmountForm.valid) {
        this.partialAmountForm.markAllAsTouched();
        hasError = true;
        return hasError;
      }
      if (valuePartialAmount === '0') {
        this.errorPaymentPartial = false;
        this.partialAmountForm?.get('inputAmount')?.setErrors({ incorrect: true });
        hasError = true;
        return hasError;
      }
    }
    return hasError;
  }


  /**
   * CALL PARTIAL PAYMENT VALIDATION ENDPOINT
   * AND VALIDATE IF THE AMOUNT IT´S MOST GREATER
   * THAN MAXIMUM TO PAY
   */

  partialPaymentValidationTrigger() {
    const valueToPay = this.getAmountByTypePayment() as string;
    const parseValueToPay = this.util.deleteDecimalDots(valueToPay);

    this.thirdPartyLoansTransactionService.partialPaymentValidation(this.loanTransaction?.identifier ??  '', parseValueToPay)
    .subscribe({
      next: (res: IPartialPayment) => {
          this.router.navigate(['/loan/third-party-loans/payment-voucher']).then(() => this.util.hideLoader());
      },
      error: (error: HttpErrorResponse) => {
        this.showAlert('error', `${error?.error?.code ?? 500}: ${error?.error?.message ?? 'Internal_server_error'}` );
        this.util.scrollToTop();
        this.util.hideLoader()
      }
    })
}

}
