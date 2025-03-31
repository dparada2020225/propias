import { Component, OnInit } from '@angular/core';
import { ETMServiceCode, ETMServicesCode } from 'src/app/modules/transaction-manager/enums/service-code.enum';
import {
  EHistoryTransactionTypeAction,
  ETHNavigationParameters,
  ETransactionHistoryViews
} from '../../enums/transaction-history.enum';
import { ITHBodyRequest, ITransactionHistory } from '../../interfaces/transaction-history.interface';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { AttributeFormTransactionHistory } from '../../enums/transaction-history-control-name.enum';
import {
  AdfFormBuilderService,
  IDataSelect,
  ILayout,
  ILoadItem,
  IManageAlertMessage,
  IPossibleValue,
  ITableStructure
} from '@adf/components';
import moment from 'moment';
import { distinctUntilChanged, finalize, throttleTime } from 'rxjs/operators';
import { ETransactionHistoryTableActions, ETransactionHistoryTableKeys } from '../../enums/th-table-keys.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../../../environments/environment';
import { IFlowError } from '../../../../../../models/error.interface';
import { IIsSchedule } from '../../../../../../models/isSchedule.interface';
import { ValidationTriggerTimeService } from '../../../../../../service/common/validation-trigger-time.service';
import { TmCommonService } from '../../../../services/tm-common.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../../../../../service/common/util.service';
import { StorageService } from '@adf/security';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { TransactionHistoryService } from '../../services/transaction/transaction-history.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ThdManagerService } from '../../services/definition/thd-manager.service';
import { ISettingData } from '../../../../../../models/setting-interface';
import { ITransactionHistoryFormValues } from '../../interfaces/th-form.interface';
import { FormGroup } from '@angular/forms';
import { ThExcelService } from '../../print/th-excel.service';
import { ThPrintService } from '../../print/th-print.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { IUserInfo } from '../../../../../../models/user-info.interface';
import { ETransactionHistoryUrlNavigationCollection } from '../../enums/th-navigate.enum';
import { TmDetailService } from '../../../../services/handlers/tm-detail.service';


@Component({
  selector: 'byte-th-home',
  templateUrl: './th-home.component.html',
  styleUrls: ['./th-home.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('0.3s ease-in-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        style(
          {
            transform: 'translateX(0%)',
            opacity: '0',
            transition: 'opacity 1s ease-in-out'
          }
        ),
        animate('0.3s ease-in-out', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]

})
export class ThHomeComponent implements OnInit {
  nextButtonMessage: string = 'send';

  formLayout!: ILayout;
  form!: FormGroup;
  options: IDataSelect[] = [];
  tableLayout: ITableStructure<ITransactionHistory> | null = null;

  typeAlert: string | null = null;
  messageAlert: string | null = null;
  isShowFullScreen: boolean = false;
  isLoadingTable: boolean = true;
  currentDateFormValues: ITransactionHistoryFormValues | null = null;

  homeView = ETransactionHistoryViews.HOME;
  consultView = ETransactionHistoryViews.CONSULT;
  settings: ISettingData | null = null;

  currentView: ETransactionHistoryViews | null = this.homeView;
  serviceToSearch: string = '';
  queryToSearch: string = '';

  transactionList: ITransactionHistory[] = [];
  userInfo: IUserInfo | null = null;
  propertiesToSearch: string[] = [
    ETransactionHistoryTableKeys.AMOUNT,
    ETransactionHistoryTableKeys.DATE_CREATED,
    ETransactionHistoryTableKeys.USER,
    ETransactionHistoryTableKeys.REFERENCE,
    ETransactionHistoryTableKeys.TRANSACTION,
    ETransactionHistoryTableKeys.CURRENCY,
  ];


  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get isShowPrintWidgets() {
    return this.transactionList.length > 0;
  }

  get buttonsContainerClassName() {
    return this.currentView === this.consultView ? 'buttons-content' : 'byte-container-ci__button history-home__buttons';
  }

  get consultViewClassName() {
    return this.currentView === this.consultView ? 'consult-view' : 'home-view';
  }

  constructor(
    private transactionHistoryDefinitionManager: ThdManagerService,
    private adfFormDefinition: AdfFormBuilderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private transactionHistory: TransactionHistoryService,
    private parameterManager: ParameterManagementService,
    private storage: StorageService,
    private util: UtilService,
    private pdf: ThPrintService,
    private reporter: ThExcelService,
    private translate: TranslateService,
    private transactionManagerCommon: TmCommonService,
    private detailHandlerManager: TmDetailService,
    private validationTriggerTime: ValidationTriggerTimeService,
  ) { }

  ngOnInit(): void {
    this.currentView = this.activatedRoute.snapshot.data['view'];
    this.settings = JSON.parse(this.storage.getItem('securityParameters'));
    this.userInfo = this.parameterManager.getParameter('userInfo');

    this.validationRangeTriggerTime();
    this.initDefinition();
    this.util.scrollToTop();
  }

  validationRangeTriggerTime() {
    if (this.currentView !== this.homeView) { return; }

    const schedule: IIsSchedule | IFlowError = this.activatedRoute.snapshot.data['scheduleService'];

    this.validationTriggerTime.validate(environment.profile, schedule);
    this.util.hideLoader();
  }

  initDefinition() {
    switch (this.currentView) {
      case ETransactionHistoryViews.CONSULT:
        this.initConsultFormDefinition();
        this.getHistoryTransactions();
        break;
      case ETransactionHistoryViews.HOME:
        this.initDefaultForm();
        break;
      default:
        this.initDefaultForm();
        break;
    }
  }

  goBack() {
    this.isShowFullScreen = false;
    this.currentDateFormValues = null;
    this.isLoadingTable = true;

    this.util.showLoader();
    this.resetStorage();
    this.router.navigate([ETransactionHistoryUrlNavigationCollection.HOME]).finally(() => this.util.hideLoader());
  }

  goToConsultHistoryTransactions() {
    if (!this.validationTriggerTime.isAvailableSchedule && this.currentView !== this.consultView) {
      this.validationTriggerTime.openModal();
      return;
    }


    if (!this.form.valid) {
      this.form.markAsTouched();
      return;
    }


    this.util.showLoader();
    this.saveValuesToConsultScreen();

    if (this.currentView === this.consultView) {
      this.getHistoryTransactions();
      return;
    }

    this.util.showLoader();
    this.router.navigate([ETransactionHistoryUrlNavigationCollection.CONSULT]).finally(() => this.util.hideLoader());
  }

  /* =================================== INIT DEFINITION  =====================================*/

  initDefaultForm() {
    this.formInitDefinition();
    this.setDefaultCurrentDate();
    this.handleDatePickerValidations();
  }

  formInitDefinition(isShowFullForm: boolean = false) {
    this.formLayout = this.transactionHistoryDefinitionManager.buildConsultFormLayout(isShowFullForm);
    this.form = this.adfFormDefinition.formDefinition(this.formLayout.attributes);
  }

  setDefaultCurrentDate(isShowFullForm: boolean = false) {
    const startOfMonth = moment().startOf('month').format('DD-MM-YYYY').split('-');
    const endOfMonth = moment().endOf('month').format('DD-MM-YYYY').split('-');

    const initialDateValue = isShowFullForm ? this.currentDateFormValues?.initialDate : this.convertDateToObject(startOfMonth);
    const finalDateValue = isShowFullForm ? this.currentDateFormValues?.finalDate : this.convertDateToObject(endOfMonth);

    this.form.patchValue({
      [AttributeFormTransactionHistory.INITIAL_DATE]: initialDateValue,
      [AttributeFormTransactionHistory.FINAL_DATE]: finalDateValue,
    });
  }

  /* =================================== INIT DEFINITION  =====================================*/


  /* =================================== CONSULT VIEW DEFINITION  =====================================*/

  initConsultFormDefinition() {
    const transactionHistoryState = this.parameterManager.getParameter('transactionHistory');

    this.formInitDefinition(true);
    this.changeForm();
    this.handleDatePickerValidations();

    if (transactionHistoryState?.formValues) {
      const formValues = transactionHistoryState?.formValues;

      this.form.patchValue({
        [AttributeFormTransactionHistory.INITIAL_DATE]: formValues?.initialDate,
        [AttributeFormTransactionHistory.FINAL_DATE]: formValues?.finalDate,
      });
    }
  }

  getHistoryTransactions() {
    this.util.showLoader();

    const initialDate = this.formatDateToTransaction(this.form.getRawValue().initialDate);
    const finalDate = this.formatDateToTransaction(this.form.getRawValue().finalDate);

    const requestData: ITHBodyRequest = {
      signatureType: this.userInfo?.signatureType ?? '',
      service: this.form.getRawValue()?.service ?? '',
      initialDate,
      finalDate,
    };

    this.transactionHistory.getTransactions(requestData)
      .pipe(finalize(() => this.util.hideLoader()))
      .subscribe({
        next: (transactions) => {
          this.transactionList = this.parsedTransactions(transactions ?? []);
          this.tableLayout = this.transactionHistoryDefinitionManager.buildTableLayout(this.transactionList);
          this.isLoadingTable = false;
          this.getServiceFilter();
          this.hiddenAlert();
        },
        error: (error: HttpErrorResponse) => {
          this.util.hideLoader();
          this.showAlert('error', error?.error?.message ?? 'error:get_transaction_history');
          this.isLoadingTable = false;
          this.transactionList = [];
          this.options = [];
          this.tableLayout = this.transactionHistoryDefinitionManager.buildTableLayout([]);
        }
      })
  }

  getActionsTable(transactionSelectedTmp: any) {
    const transactionSelected: ILoadItem<ITransactionHistory> = transactionSelectedTmp;

    if (transactionSelected.action === ETransactionHistoryTableActions.VIEW_DETAIL) {
      this.gotTransactionVoucherDetail(transactionSelected.item);
    }
  }

  gotTransactionVoucherDetail(transactionSelected: ITransactionHistory) {

    const isSupportedTransaction = this.transactionManagerCommon.isSupportedTransaction(this.settings?.onlineBankingCoreServices ?? [], transactionSelected);

    if (!isSupportedTransaction) {
      this.transactionManagerCommon.handleNavigateToEmbbededBanking({
        tabPosition: EHistoryTransactionTypeAction.HISTORY_DETAIL,
        action: '',
        reference: transactionSelected?.reference,
        service: transactionSelected?.serviceCode
      });
      return;
    }

    this.detailHandlerManager.manageDetailTransferNavigation({
      transactionSelected,
      isTransactionHistoryMode: true,
      position: null,
    });
  }

  /* =================================== CONSULT VIEW DEFINITION  =====================================*/


  /* =================================== DATE PICKER VALIDATIONS  =====================================*/

  handleDatePickerValidations() {
    this.form.get(AttributeFormTransactionHistory.INITIAL_DATE)?.valueChanges
      .subscribe(initDate => {
      this.validationInitDate(initDate);
    });

    this.form.get(AttributeFormTransactionHistory.FINAL_DATE)?.valueChanges
      .subscribe(finalDate => {
      this.validationFinalDate(finalDate);
    });
  }

  validationInitDate(initDate: NgbDate) {
    const finalDate: NgbDate = this.form.get(AttributeFormTransactionHistory.FINAL_DATE)?.value;
    const initMoment = moment({ year: initDate.year, month: initDate.month - 1, day: initDate.day });
    const finalMoment = moment({ year: finalDate.year, month: finalDate.month - 1, day: finalDate.day });

    if (finalMoment && finalMoment < initMoment) {
      this.form.controls[AttributeFormTransactionHistory.INITIAL_DATE].setErrors({ 'non.existent_date_range': true });
    }
  }

  validationFinalDate(finalDate: NgbDate) {
    const initDate: NgbDate = this.form.get(AttributeFormTransactionHistory.INITIAL_DATE)?.value;
    const initMoment = moment({ year: initDate.year, month: initDate.month - 1, day: initDate.day });
    const finalMoment = moment({ year: finalDate.year, month: finalDate.month - 1, day: finalDate.day });

    if (initMoment && initMoment > finalMoment) {
      this.form.controls[AttributeFormTransactionHistory.FINAL_DATE].setErrors({ 'non.existent_date_range': true });
    }
  }

  /* =================================== DATE PICKER VALIDATIONS  =====================================*/


  /* =================================== SEARCH HANDLER =====================================*/

  changeForm() {
    this.form.get(AttributeFormTransactionHistory.SEARCH)?.valueChanges
      .pipe(distinctUntilChanged(), throttleTime(500))
      .subscribe({
        next: (query) => {
          this.handleFilterRegister(query);
        }
      })

    this.form.get(AttributeFormTransactionHistory.SERVICE)?.valueChanges
      .pipe(distinctUntilChanged(), throttleTime(500))
      .subscribe({
        next: (service) => {
          this.filterByService(service);
        }
      })
  }

  filterByService(service: string) {
    this.serviceToSearch = service;
    this.handlerSearch();
  }

  handlerSearch() {
    const rawList = this.parsedTransactions(this.transactionList ?? []);
    const list = this.transactionHistoryDefinitionManager.parseTransactions(rawList);

    const listFilterByQuery = this.util.searchByMultipleAttributes(list, this.queryToSearch , this.propertiesToSearch);
    (this.tableLayout as ITableStructure<ITransactionHistory>).items =
      listFilterByQuery.filter((transaction) => (transaction?.serviceCodeToSearch ?? '').includes(this.serviceToSearch));
  }

  handleFilterRegister(query: string) {
    this.queryToSearch = query;

    this.handlerSearch();

    if ((this.tableLayout as ITableStructure<ITransactionHistory>).items.length <= 0) {
      ((this.tableLayout as ITableStructure).manageAlertMessage as IManageAlertMessage).message = 'no_matches_found';
    }

  }

  getServiceFilter() {
    this.options = [];

    const services = this.transactionList.map(transaction => ({
      name: transaction?.serviceDescription ?? 'UNDEFINED',
      value: `${transaction?.serviceCodeToSearch ?? 'UNDEFINED'}`
    }));


    const filtered: IPossibleValue[] = services.filter((bank, idx) => idx === services.findIndex(attr => bank.name === attr.name));

    this.options.push({
      controlName: AttributeFormTransactionHistory.SERVICE,
      data: [{
        name: 'label:selected',
        value: '',
      },
        ...filtered],
    });
  }

  /* =================================== SEARCH HANDLER =====================================*/


  /* =================================== UTILITIES =====================================*/

  convertDateToObject(date: string[]) {
    return {
      year: Number(date[2]),
      month: Number(date[1]),
      day: Number(date[0])
    } as NgbDate;
  }

  formatDateToTransaction(date: NgbDate) {
    const month = ('0' + date?.month).slice(-2);
    const day = ('0' + date?.day).slice(-2);

    return `${date?.year}${month}${day}`;
  }

  formatDateToStandard(date: NgbDate) {
    const month = ('0' + date?.month).slice(-2);
    const day = ('0' + date?.day).slice(-2);

    return `${day}/${month}/${date?.year}`;
  }

  saveValuesToConsultScreen() {
    this.parameterManager.sendParameters({
      navigationProtectedParameter: ETHNavigationParameters.CONSULT,
      transactionHistory: {
        formValues: this.form?.value,
      }
    });
  }

  parsedTransactions(transactions: ITransactionHistory[]) {
    return transactions.map(transaction => ({
      ...transaction,
      serviceCodeToSearch: ETMServicesCode[transaction?.serviceCode] ?? transaction?.serviceCode
    }))
      .filter(transaction => transaction?.serviceCode !== ETMServiceCode.LOAN_PAYMENT_PROFFER)
  }

  showAlert(typeAlert: string, message: string) {
    this.typeAlert = typeAlert;
    this.messageAlert = message;
  }

  hiddenAlert() {
    this.messageAlert = null;
    this.typeAlert = null;
  }

  exportPdf() {
    const data = {
      transactions: this.transactionHistoryDefinitionManager.parseTransactions(this.transactionList),
      date: {
        initial: this.formatDateToStandard(this.form.getRawValue()?.initialDate),
        final: this.formatDateToStandard(this.form.getRawValue()?.finalDate),
      }
    };

    const label = this.translate.instant('pdf:transaction_history');

    this.pdf.pdfGenerate(data, 'authorization', label, 248);
  }

  exportExcel() {
    const label = this.translate.instant('pdf:transaction_history');
    const transactions = this.transactionHistoryDefinitionManager.parseTransactions(this.transactionList);
    this.reporter.generate(transactions, {}, label);
  }

  exportCsv() {
    const label = this.translate.instant('pdf:transaction_history');
    const transactions = this.transactionHistoryDefinitionManager.parseTransactions(this.transactionList);
    this.reporter.generate(transactions, {}, label, 'csv');
  }

  resetStorage() {
    this.parameterManager.sendParameters({
      navigationProtectedParameter: null,
      transactionHistory: null
    });
  }

  /* =================================== UTILITIES =====================================*/

}
