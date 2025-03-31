import { Component, OnInit } from '@angular/core';
import {
  AdfAlertModalComponent,
  AdfFormBuilderService,
  DataLayoutSelectBuilder,
  IDataLayoutSelect,
  IDataSelect,
  ILayout
} from '@adf/components';
import { FormGroup } from '@angular/forms';
import { IAccount } from '../../../../../../models/account.inteface';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { UtilService } from '../../../../../../service/common/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  OtdTransferBaseHomeService
} from '../../../transfer-own/services/definition/base/otd-transfer-base-home.service';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { S368dFormService } from '../../services/definition/s368d-form.service';
import { IFlowError } from '../../../../../../models/error.interface';
import { ET365FormControlName } from '../../../transfer-365/enum/form-control.enum';
import { ES365FromControlName } from '../../enum/form-control.enum';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment/moment';
import { ES365UrlCollection } from '../../enum/url-collection.enum';
import { IS365HomeState } from '../../interfaces/state.interface';
import { environment } from '../../../../../../../environments/environment';
import {
  TAMS365AccountList
} from '../../../../../accounts-management/modules/am-365-sipa/interfaces/s365-account.interface';
import { IAMS365Account } from '../../../../../accounts-management/interfaces/am-account-list.interface';
import {
  IS365TermsConditionInfoResponse,
  IS365TransferReason,
  TS365TransferReasonList
} from '../../interfaces/transfer.interface';
import { S365TransactionService } from '../../services/transaction/s365-transaction.service';
import {
  BisvGeneralParameters,
} from '../../../../../../models/ach-general-parameters.interface';
import { Ttr365UtilsService } from '../../../../services/utils/ttr-365-utils.service';
import { S365TransferRouteProtected } from '../../enum/route-protected.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { ETMACHTypeTransaction } from '../../../../../transaction-manager/modules/ach/enum/form-control-name.enum';

@Component({
  selector: 'byte-s365-home',
  templateUrl: './s365-home.component.html',
  styleUrls: ['./s365-home.component.scss']
})
export class S365HomeComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  formLayout!: ILayout;
  form!: FormGroup;
  selectOptions: IDataSelect[] = [];

  scheduleFormLayout!: ILayout;
  scheduleForm!: FormGroup;

  sourceAccountList: Array<IAccount> = [];
  targetAccountList: TAMS365AccountList = [];
  reasonList: TS365TransferReasonList = [];
  settings = new BisvGeneralParameters().build();
  termsConditionInfo: IS365TermsConditionInfoResponse | undefined = undefined;


  sourceAccountSelected: IAccount | undefined = undefined;
  targetAccountSelected: IAMS365Account | undefined = undefined;
  reasonSelected: IS365TransferReason | undefined = undefined;

  COMMISSION_VALUE = 0;
  TRANSFER_LIMIT_BY_USER = 0;


  get commissionValue() {
    return `${this.sourceAccountSelected?.currency} ${this.COMMISSION_VALUE}`;
  }

  get totalToDebit() {
    const total = this.utils.parseNumberAsFloat(this.form.get(ES365FromControlName.AMOUNT)?.value) + this.COMMISSION_VALUE;
    return `${this.sourceAccountSelected?.currency} ${total.toFixed(2)}`;
  }

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get isShowNextButton() {
    return this.form.valid;
  }

  get isShowScheduleForm() {
    return !!this.form.get(ES365FromControlName.IS_SCHEDULE)?.value;
  }

  constructor(
    private utils: UtilService,
    private router: Router,
    private adfFormBuilderService: AdfFormBuilderService,
    private activatedRouter: ActivatedRoute,
    private ownTransferBaseUtil: OtdTransferBaseHomeService,
    private parameterManagement: ParameterManagementService,
    private s365FormDefinitionService: S368dFormService,
    private modalService: NgbModal,
    private transferService: S365TransactionService,
    private ttr365Utils: Ttr365UtilsService,
  ) { }

  ngOnInit(): void {
    this.initState();
    this.initDefinition();
  }

  initState() {
    this.getSourceAccountList();
    this.getTargetAccountList();
    this.getTransferReasonList();
    this.getLimitByUser();
    this.getGeneralParameters();
    this.getTermsAndConditionsInfo();
    this.setCommissionValue();
    this.utils.hideLoader();
  }

  setCommissionValue() {
    const valueCommission = Number(this.termsConditionInfo?.refusalFee ?? 0);
    const tax = Number(this.termsConditionInfo?.taxes ?? 0);
    const calcTax = tax / 100;
    const taxes = isNaN(calcTax) ? 0 : calcTax;
    this.COMMISSION_VALUE = (valueCommission + taxes);
  }

  getGeneralParameters() {
    const settingResponse = this.activatedRouter.snapshot.data['settings'];

    if (settingResponse.hasOwnProperty('error')) {
      this.showAlert('error', (settingResponse as IFlowError).message);
      return;
    }

    this.settings = settingResponse;
  }

  getSourceAccountList() {
    const sourceAccountListResponse = this.activatedRouter.snapshot.data['sourceAccountList'];

    if (sourceAccountListResponse.hasOwnProperty('error')) {
      this.showAlert('error', (sourceAccountListResponse as IFlowError).message);
      return;
    }

    this.sourceAccountList = sourceAccountListResponse;
  }

  getLimitByUser() {
    const limitByUserResponse = this.activatedRouter.snapshot.data['getLimitUser'];

    if (limitByUserResponse.hasOwnProperty('error')) {
      this.showAlert('error', (limitByUserResponse as IFlowError).message);
      return;
    }

    this.TRANSFER_LIMIT_BY_USER = limitByUserResponse?.amount ?? 0;
  }

  getTargetAccountList() {
    const targetAccountListResponse = this.activatedRouter.snapshot.data['targetAccountList'];

    if (targetAccountListResponse.hasOwnProperty('error')) {
      this.showAlert('error', (targetAccountListResponse as IFlowError).message);
      return;
    }

    this.targetAccountList = targetAccountListResponse;
  }

  getTransferReasonList() {
    const reasonResponse = this.activatedRouter.snapshot.data['reason'];

    if (reasonResponse.hasOwnProperty('error')) {
      this.showAlert('error', (reasonResponse as IFlowError).message);
      return;
    }

    this.reasonList = reasonResponse;
  }

  getTermsAndConditionsInfo() {
    const response = this.activatedRouter.snapshot.data['termsConditionInfo'];

    if (response.hasOwnProperty('error')) {
      this.showAlert('error', (response as IFlowError).message);
      return;
    }

    this.termsConditionInfo = response;
  }


  initDefinition() {
    this.formLayout = this.s365FormDefinitionService.buildFormLayout();
    this.form = this.adfFormBuilderService.formDefinition(this.formLayout.attributes);

    this.scheduleFormLayout = this.s365FormDefinitionService.buildScheduleFormLayout();
    this.scheduleForm = this.adfFormBuilderService.formDefinition(this.scheduleFormLayout.attributes);

    this.buildFormOptions();
    this.changeForm();
  }

  buildFormOptions() {
    const sourceAccountOptions = this.buildOptionsForSourceAccount();
    const targetAccountOptions = this.buildOptionsForTargetAccount();
    const reasonListOptions = this.buildOptionsListOfReason();

    this.selectOptions = [sourceAccountOptions, reasonListOptions, targetAccountOptions];
  }

  buildOptionsForTargetAccount() {
    const options = this.targetAccountList.map(account => {
      return {
        name: `${account.account} - ${account.name}`,
        value: account.account,
      }
    });

    return {
      controlName: ES365FromControlName.TARGET_ACCOUNT,
      data: options,
    }
  }

  buildOptionsForSourceAccount() {
    const options = this.sourceAccountList.map(account => {
      const acronym = this.utils.getProductAcronym(account.product);

      return {
        name: `${acronym} - ${account.account}`,
        value: account.account,
      }
    });

    return {
      controlName: ES365FromControlName.SOURCE_ACCOUNT,
      data: options,
    }
  }

  buildOptionsListOfReason() {
    const options = this.reasonList.map(account => {
      return {
        name: account.description,
        value: account.code,
      }
    });

    return {
      controlName: ES365FromControlName.REASON,
      data: options,
    }
  }

  changeForm() {
    this.form.get(ES365FromControlName.SOURCE_ACCOUNT)?.valueChanges.subscribe({
      next: (value) => this.handleChangeSourceAccount(value),
    });

    this.form.get(ES365FromControlName.AMOUNT)?.valueChanges.subscribe({
      next: () => {
        this.hideAlert();
      }
    });

    this.form.get(ES365FromControlName.TARGET_ACCOUNT)?.valueChanges.subscribe({
      next: (value) => this.handleChangeTargetAccount(value),
    });

    this.form.get(ES365FromControlName.REASON)?.valueChanges.subscribe({
      next: (value) => this.handleChangeReasonField(value),
    });

    this.form.get(ES365FromControlName.DATE)?.valueChanges
      .subscribe((date) => {
        this.validateDate(date);
      });
  }

  handleChangeSourceAccount(value: string) {
    const selectedAccount = this.sourceAccountList.find((accountTemp) => accountTemp.account === value);

    if (!selectedAccount) {
      this.sourceAccountSelected = undefined;
      this.formLayout.attributes.forEach((attribute) => {
        if (attribute.controlName === ES365FromControlName.SOURCE_ACCOUNT) {
          attribute.layoutSelect = [];
        }
      });
      return;
    }

    this.sourceAccountSelected = selectedAccount;
    this.formLayout.attributes.forEach((attribute) => {
      if (attribute.controlName === ES365FromControlName.SOURCE_ACCOUNT) {
        attribute.layoutSelect = this.ownTransferBaseUtil.buildDebitedAccountSelectAttributes(selectedAccount);
      }
    });
  }

  handleChangeTargetAccount(value: string) {
    const selectedAccount = this.targetAccountList.find((accountTemp) => accountTemp.account === value);

    if (!selectedAccount) {
      this.targetAccountSelected = undefined;
      this.formLayout.attributes.forEach((attribute) => {
        if (attribute.controlName === ET365FormControlName.TARGET_ACCOUNT) {
          attribute.layoutSelect = []
        }
      });
      return;
    }

    this.targetAccountSelected = selectedAccount;
    this.formLayout.attributes.forEach((attribute) => {
      if (attribute.controlName === ET365FormControlName.TARGET_ACCOUNT) {
        attribute.layoutSelect = this.buildTargetAccountSelectAttributes(selectedAccount);
      }
    });
  }

  handleChangeReasonField(value: string) {
    this.reasonSelected = this.reasonList.find(reason => reason.code === value);
  }

  buildTargetAccountSelectAttributes(account: IAMS365Account): IDataLayoutSelect[] {
    const attributeList: IDataLayoutSelect[] = [];

    const attributeProductName = new DataLayoutSelectBuilder()
      .label('account_credit_bank')
      .value(account.bankName)
      .build();

    attributeList.push(attributeProductName);

    return attributeList;
  }

  validateDate(date: NgbDate) {
    const currentDate = this.getCurrentDate(date);
    const inputDate = moment(currentDate, 'DD/MM/YYYY', true);

    if (!inputDate.isValid()) {
      this.form.get(ES365FromControlName.DATE)?.setErrors({ date_not_allowed: true });
      return;
    }


    if (date && this.utils.validateCurrentDate(date) && inputDate.isValid()) {
      this.form.get(ES365FromControlName.DATE)?.setErrors({ date_not_allowed: true });
    }
  }

  getCurrentDate(date: NgbDate) {
    const day = date?.day ? String('0' + date?.day).slice(-2) : '';
    const month = date?.month ? String('0' + date?.month).slice(-2) : '';
    const year = date?.year || '';

    return `${day}/${month}/${year}`;
  }

  openScheduleTransactionModal(message: string) {
    const modal = this.modalService.open(AdfAlertModalComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} alert-modal`,
      size: `lg`,
    });

    modal.componentInstance.data = this.s365FormDefinitionService.buildModalScheduleDefinition(message);

    modal.result
      .then((isConfirm) => {
        if (!isConfirm) return;

        this.manageNavigateToConfirmationScreen();
      }).catch((error) => error);
  }

  previous() {
    this.utils.showLoader();
    this.router.navigate(['home']).finally(() => {});
  }

  nextStep() {
    if (!this.form.valid || (this.isShowScheduleForm && !this.scheduleForm.valid)) {
      this.form.markAllAsTouched();
      this.scheduleForm.markAllAsTouched();
      return;
    }

    const amount = this.form.get(ES365FromControlName.AMOUNT)?.value;
    const { isValid, message } = this.ttr365Utils.getIsAmountValidByLimits({
      amount,
      currencies: this.settings.currencies,
      limitByUser: this.TRANSFER_LIMIT_BY_USER,
      currency: this.sourceAccountSelected!.currency,
      availableAmountInSourceAccount: this.sourceAccountSelected?.availableAmount ?? 0,
    });

    if (!isValid) {
      this.utils.scrollToTop();
      this.showAlert('warning', message ?? '');
      return;
    }

    // this.transferService.reateToApplyTransaction({
    //   transferenceType: 'ACH',
    //   sourceAccount: this.sourceAccountSelected!.account,
    //   targetBank: this.targetAccountSelected!.bank,
    //   targetAccount: this.targetAccountSelected!.account,
    //   targetType: this.targetAccountSelected!.type,
    //   targetCurrency: this.sourceAccountSelected!.currency,
    //   amount: this.form.get(ES365FromControlName.AMOUNT)?.value,
    //   achTransferenceType: ETMACHTypeTransaction.TRANSFER_SIPA,
    //   manual: false,
    //   scheduleDateTime: '05092024000000',
    // }).subscribe({
    //   next: (response) => {
    //     console.log(response);
    //   },
    //   error: (error: HttpErrorResponse) => {
    //     console.log(error);
    //   }
    // })

    if (this.isShowScheduleForm) {
      const message = 'La fecha seleccionada no es hábil en el país destino. La transacción quedará registrada y se aplicará en fecha: 13/05/2024';
      this.openScheduleTransactionModal(message);
      return;
    }

    this.manageNavigateToConfirmationScreen();
  }

  manageNavigateToConfirmationScreen() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        formValues: this.form.value,
        scheduleFormValues: this.scheduleForm.value,
        sourceAccountSelected: this.sourceAccountSelected,
        targetAccountSelected: this.targetAccountSelected,
        reasonSelected: this.reasonSelected,
        commission: this.COMMISSION_VALUE,
        totalValue: this.totalToDebit,
      } as IS365HomeState,
      [PROTECTED_PARAMETER_ROUTE]: S365TransferRouteProtected.CONFIRMATION,
    });

    this.router.navigate([ES365UrlCollection.CONFIRMATION]).finally(() => {});
  }



  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  hideAlert() {
    this.typeAlert = '';
    this.messageAlert = '';
  }

}
