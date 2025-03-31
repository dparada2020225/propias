import { AdfFormatService, AdfFormBuilderService, IDataSelect, ILayout, IPossibleValue } from '@adf/components';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from '../../../../../../../environments/environment';
import { IAccount } from '../../../../../../models/account.inteface';
import { IB2bRequestConfig, IB2bRequestResponse } from '../../interfaces/b2b-request.interface';
import { IFlowError } from '../../../../../../models/error.interface';
import { IFixedDeadlines } from '../../interfaces/fixed-deadlines.interface';
import paymentMethod from 'src/app/modules/loan/modules/b2b-request/data/methodPayment.json';
import { B2bdManagerService } from '../../service/definition/b2bd-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AttributeB2BRequest } from '../../enum/b2b-request-control-name.enum';
import { TranslateService } from '@ngx-translate/core';
import { EB2bRequestView } from '../../enum/b2b-request-view.enum';
import { ValidationTriggerTimeService } from '../../../../../../service/common/validation-trigger-time.service';
import { IIsSchedule } from '../../../../../../models/isSchedule.interface';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { B2bRequestNavigateProtectedParameter } from '../../enum/b2b-request-navigate-protected-parameter.enum';
import { IB2bRequestStateDefault } from '../../interfaces/b2b-request-state.interface';
import { Subject } from 'rxjs';
import { B2bRequestService } from '../../service/transaction/b2b-request.service';
import { distinctUntilChanged, finalize, throttleTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpStatusCode } from 'src/app/enums/http-status-code.enum';
import {
  IThirdTransactionFailedResponse, IThirdTransactionSuccessResponse
} from '../../../../../transfer/modules/transfer-third/interfaces/third-transfer-definition.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalTokenComponent } from '../../../../../../view/private/token/modal-token/modal-token.component';
import { UtilService } from '../../../../../../service/common/util.service';
import { ERequestTypeTransaction } from '../../../../../../enums/transaction-header.enum';

@Component({
  selector: 'byte-b2b-request-home',
  templateUrl: './b2b-request-home.component.html',
  styleUrls: ['./b2b-request-home.component.scss']
})
export class B2bRequestHomeComponent implements OnInit {
  optionsList: IDataSelect[] = [];
  wayPayList: IPossibleValue[] = paymentMethod;
  form!: FormGroup;
  formLayout!: ILayout;
  typeAlert: string | null = null;
  messageAlert: string | null = null;
  sourceAccountSelected: IAccount | null = null;
  currency = environment.currency;
  targetAccountList: IAccount[] = [];
  sourceAccountList: IAccount[] = [];
  frequencyList: IB2bRequestConfig | null = null;
  fixDeadLines: IFixedDeadlines[] = [];
  catchErrors: IFlowError[] = []
  fixTermSelected: IFixedDeadlines | null = null;
  view: EB2bRequestView = EB2bRequestView.DEFAULT;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get alertFrequencies(){
    const requestData = this.b2bManagerDefinition.buildExecuteRequest(this.form?.value);

    const interest = requestData.interestPaymentFrequency
    const capital = requestData.capitalPaymentFrequency

    return interest === '01' && capital === '01'
  }

  constructor(
    private b2bManagerDefinition: B2bdManagerService,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private router: Router,
    private formBuilder: AdfFormBuilderService,
    private adfFormat: AdfFormatService,
    private validationTriggerTime: ValidationTriggerTimeService,
    private parameterManagement: ParameterManagementService,
    private b2bRequestService: B2bRequestService,
    private modalService: NgbModal,
    private utils: UtilService,
  ) { }

  ngOnInit(): void {
    this.view = this.activatedRoute.snapshot.data['view'] || EB2bRequestView.DEFAULT;

    this.validationRangeTriggerTime();
    this.formDefinition();
    this.buildAlertForErrorResolver();
    this.utils.hideLoader();
  }

  validationRangeTriggerTime() {
    const schedule: IIsSchedule | IFlowError = this.activatedRoute.snapshot.data['scheduleService'];

    this.validationTriggerTime.validate(environment.profile, schedule);
  }

  formDefinition() {
    this.formLayout = this.b2bManagerDefinition.buildFormLayout(this.currency);
    this.form = this.formBuilder.formDefinition(this.formLayout.attributes);
    this.handleDataSelectOptions();
    this.changeFormSimple();
    this.handleSelectDefaultPaymentForm();
  }

  handleSelectDefaultPaymentForm() {
    const defaultOption = this.wayPayList[0];
    this.form.get(AttributeB2BRequest.WAY_PAY)?.setValue(defaultOption.value);
  }

  changeFormSimple() {
    this.form.get(AttributeB2BRequest.ACCOUNT_NUMBER)?.valueChanges
      .pipe(distinctUntilChanged(), throttleTime(500))
      .subscribe((account) => {
      this.changeDataAccountDebited(account);
    });

    this.form.get(AttributeB2BRequest.FIXED_TERM)?.valueChanges
      .pipe(distinctUntilChanged(), throttleTime(500))
      .subscribe((value) => {
        this.changeFixedTermSelected(value);
    })

  }

  changeDataAccountDebited(account: string) {
    const selectedAccount = this.sourceAccountList.find((accountTemp) => accountTemp.account === account);

    if (!selectedAccount) return

    this.sourceAccountSelected = selectedAccount;
  }

  changeFixedTermSelected(value: string) {
    const termFix = this.fixDeadLines.find((fixTerm) => fixTerm.account === value);
    if (!termFix) { return; }

    this.fixTermSelected = termFix;
  }


  handleDataSelectOptions() {
    this.accountsCreditListUpload();
    this.accountsDebitListUpload();
    this.frequencyListBuilder();
    this.fixTermDataListBuilder();
    this.wayPayDataListBuilder();
  }

  buildAlertForErrorResolver() {
    const error = this.catchErrors.reduce((txt: string, error: IFlowError) => {
      const translatedError = this.translateService.instant(error.message)
      return `${txt + ' ' + translatedError}, `
    }, '');

    if (!error) { return; }


    const customError = `${this.translateService.instant('errorB2b:resolveError')} ${error}`
    this.showAlert('error', customError)
  }

  frequencyListBuilder() {
    const configResponse = this.activatedRoute.snapshot.data['configuration'];

    const dataSelectCapital: IDataSelect = {
      controlName: AttributeB2BRequest.CAPITAL_FREQUENCY,
      data: []
    }

    const dataSelectInterest: IDataSelect = {
      controlName: AttributeB2BRequest.INTEREST_FREQUENCY,
      data: []
    }

    if (configResponse.hasOwnProperty('error')) {
      this.catchErrors = [...this.catchErrors, configResponse];
      this.optionsList = [...this.optionsList, dataSelectCapital, dataSelectInterest];
      return;
    }

    this.frequencyList = configResponse;
    this.interestPaymentFrequencyBuilder(dataSelectInterest);
    this.capitalPaymentFrequencyBuilder(dataSelectCapital);
  }

  interestPaymentFrequencyBuilder(dataSelect: IDataSelect) {
    if (!this.frequencyList) { return; }

    const list = this.frequencyList.interestList.map((config) => ({
      name: (config?.description ?? '').toUpperCase(),
      value: config?.code,
    }));

    this.optionsList = [...this.optionsList, { ...dataSelect, data: list }];
  }

  capitalPaymentFrequencyBuilder(dataSelect: IDataSelect) {
    if (!this.frequencyList) { return; }

    const list = this.frequencyList.capitalList.map((config) => ({
      name: (config?.description ?? '').toUpperCase(),
      value: config?.code,
    }));

    this.optionsList = [...this.optionsList, { ...dataSelect, data: list }];
  }

  fixTermDataListBuilder(): void {
    const fixTermsResponse = this.activatedRoute.snapshot.data['fixedDeadlines'];

    const dataSelect: IDataSelect = {
      controlName: AttributeB2BRequest.FIXED_TERM,
      data: []
    };

    if (fixTermsResponse?.hasOwnProperty('error')) {
      this.catchErrors = [...this.catchErrors, fixTermsResponse]
      this.optionsList = [...this.optionsList, dataSelect]
      return;
    }

    this.fixDeadLines = fixTermsResponse;

    const list = this.fixDeadLines.map((fixTerm) => ({
      name: fixTerm.name.toUpperCase(),
      value: fixTerm.account
    }));

    this.optionsList = [...this.optionsList, { ...dataSelect, data: list }];
  }

  wayPayDataListBuilder(): void {
    if (this.wayPayList.hasOwnProperty('error')) {
      return
    }

    const list = this.wayPayList.map((wayPay) => ({
      name: wayPay.name,
      value: wayPay.value
    }))

    const dataSelect: IDataSelect = {
      controlName: AttributeB2BRequest.WAY_PAY,
      data: [...list]
    }

    this.optionsList = [...this.optionsList, dataSelect];
  }

  accountsDebitListUpload(): void {
    const accountResponse = this.activatedRoute.snapshot.data['sourceAccounts'];


    const accountDebitOptions: IDataSelect = {
      controlName: AttributeB2BRequest.ACCOUNT_NUMBER,
      data: [],
    };

    if (accountResponse.hasOwnProperty('error')) {
      this.catchErrors = [...this.catchErrors, accountResponse];
      this.optionsList = [...this.optionsList, { ...accountDebitOptions }];
      this.optionsList.push(accountDebitOptions);
      return;
    }

    this.sourceAccountList = accountResponse;
    const possibleValuesAccountsDebit: IPossibleValue[] = this.sourceAccountList.map((accountDebit) => {
      const accountDebitTemp: IPossibleValue = {
        value: accountDebit.account,
        name: `${accountDebit.account} - ${accountDebit.name}`,
      };
      return accountDebitTemp;
    });

    this.optionsList = [...this.optionsList, { ...accountDebitOptions, data: possibleValuesAccountsDebit }];
  }

  accountsCreditListUpload(): void {
    const accountsResponse = this.activatedRoute.snapshot.data['targetAccounts'];

    const accountCreditOptions: IDataSelect = {
      controlName: AttributeB2BRequest.ACCOUNT_CREDIT,
      data: [],
    };

    if (accountsResponse.hasOwnProperty('error')) {
      this.catchErrors = [...this.catchErrors, accountsResponse];
      this.optionsList = [...this.optionsList, { ...accountCreditOptions }];
      return
    }

    this.targetAccountList = accountsResponse;
    const possibleValuesAccountsCredit: IPossibleValue[] = this.targetAccountList.map((accountCredit) => {
      const accountCreditTemp: IPossibleValue = {
        value: accountCredit.account,
        name: `${accountCredit.account} - ${accountCredit.name}`,
      };
      return accountCreditTemp;
    });

    this.optionsList = [...this.optionsList, { ...accountCreditOptions, data: possibleValuesAccountsCredit }];
  }

  nextStep() {
    if (!this.validationTriggerTime.isAvailableSchedule) {
      this.validationTriggerTime.openModal();
      return;
    }

    if (!this.form?.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.validateIsOpenTokenModal();
  }

  goToVoucher(transactionResponse: IB2bRequestResponse) {
    this.utils.showLoader();

    this.parameterManagement.sendParameters({
      navigationProtectedParameter: B2bRequestNavigateProtectedParameter.VOUCHER,
      navigateStateParameters: {
        formValues: this.form?.value,
        sourceAccountSelected: this.sourceAccountSelected,
        transactionResponse,
      } as IB2bRequestStateDefault,
    });

    this.router.navigate(['/loan/request/voucher']).finally(() => this.utils.hideLoader());
  }

  lastStep() {
    this.router.navigate(['home']).then(() => {});
  }

  handleExecuteTransaction(tokenValue?: string) {
    const isTokenRequired = this.parameterManagement.getParameter('isTokenRequired');
    const serviceResponse = new Subject<IThirdTransactionSuccessResponse<IB2bRequestResponse> | IThirdTransactionFailedResponse>();
    const obs = serviceResponse.asObservable();

    this.utils.showPulseLoader();
    this.showAlert('', '');

    const requestBodyToExecuteTransaction = this.b2bManagerDefinition.buildExecuteRequest(this.form.value);
    this.b2bRequestService
      .requestExecute(isTokenRequired, requestBodyToExecuteTransaction, tokenValue ?? '')
      .pipe(finalize(() => this.utils.hidePulseLoader()))
      .subscribe({
        next: (response) => {
          serviceResponse.next({
            status: 200,
            data: response,
          } as IThirdTransactionSuccessResponse);
        },
        error: (error: HttpErrorResponse) => {
          if ((error?.error && error?.error?.status || error && error?.status) === HttpStatusCode.INVALID_TOKEN) {
            serviceResponse.next({
              status: HttpStatusCode.INVALID_TOKEN,
              message: error?.error?.message,
              error: error?.error,
            } as IThirdTransactionFailedResponse);

            return;
          }

          serviceResponse.next({
            status: error?.status,
            message: error?.error?.message,
            error: error?.error,
          } as IThirdTransactionFailedResponse);
        }
      })
    return obs;
  }

  validateIsOpenTokenModal() {
    const isTokenRequired = this.parameterManagement.getParameter('isTokenRequired');

    if (isTokenRequired) {
      this.openTokenModal();
      return;
    }

    this.handleExecuteTransaction()
      .subscribe({
        next: (response) => {
          this.handleTransactionResponse(response);
        },
      })
  }

  openTokenModal() {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} sm-600`,
      size: 'lg',
    });

    modal.componentInstance.tokenType = this.utils.getTokenType();
    modal.componentInstance.typeTransaction = ERequestTypeTransaction.REQUEST_BACK_TO_BACK;
    modal.componentInstance.executeService = this.handleExecuteTransaction.bind(this);

    modal.result.then(transactionResponse => {
      this.handleTransactionResponse(transactionResponse);
    }).catch(error => error);
  }

  handleTransactionResponse(transactionResponse: IThirdTransactionSuccessResponse<IB2bRequestResponse> | IThirdTransactionFailedResponse) {
    if (transactionResponse?.status !== HttpStatusCode.SUCCESS_TRANSACTION && Number(transactionResponse?.status) !== Number(HttpStatusCode.SIGNATURE_TRACKING)) {
      this.scrollToTop();
      this.showAlert('error', `${transactionResponse?.message ?? 'errorB2b:cannot_execute_request'}`);
      return;
    }

    this.goToVoucher(transactionResponse?.data);
  }

  scrollToTop() {
    this.utils.scrollToTop();
  }


  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  hiddenAlert() {
    this.typeAlert = null;
    this.messageAlert = null;
  }
}
