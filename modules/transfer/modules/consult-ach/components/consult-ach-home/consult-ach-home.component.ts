import {
  AdfFormBuilderService,
  IDataSelect,
  ILayout,
  ILoadItem,
  IManageAlertMessage, IPossibleValue,
  ITableStructure
} from '@adf/components';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { delay, finalize } from 'rxjs/operators';
import operationType from '../../../../../../../assets/data/operation-type-consult-ach.json';
import { IFlowError } from '../../../../../../models/error.interface';
import {
  ICACHDebitRegisters,
  ICACHTableType,
  ICOResponseAccount,
  ICOResponseCredits, ICOResponseDebits,
  ICOTransactionCredit,
  ICOTransactionDebits
} from '../../interfaces/consult-ach-definition.interface';
import {
  IACHCForm,
  ICACHFilterOperation,
  ICACHFilterValue,
  AttributeFormConsultAch,
  EConsultACHTableActions
} from '../../interfaces/consult-ach-form.interface';
import { IConsultingACHState } from '../../interfaces/navigate-parameters.interface';
import { IConsultingACHDetail } from '../../interfaces/transaction.interface';
import { CadManagerService } from '../../services/definition/cad-manager.service';
import { ConsultAchService } from '../../services/transaction/consult-ach.service';
import { ConsultAchPrintService } from '../../services/print/consult-ach-print.service';
import { ConsultAchExcelServiceService } from '../../services/print/consult-ach-excel-service.service';
import {CONSULT_ACH_PROTECTED_PARAMETER} from "../../const/consult-ach-protected-parameter";
import { CACH_TYPE_MOVEMENTS, CACH_TYPE_OPERATION, TCACH_MOVEMENTS } from '../../const/cach-common.enum';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { UtilService } from '../../../../../../service/common/util.service';
import { MIN_MAX_RANGE } from '../../../../../../enums/common-value.enum';
import typeFiltersByDebitRegisters from '../../data/debit-filter-type-operations.json';
import { of } from 'rxjs';

@Component({
  selector: 'byte-consult-ach-home',
  templateUrl: './consult-ach-home.component.html',
  styleUrls: ['./consult-ach-home.component.scss'],
})
export class ConsultAchHomeComponent implements OnInit {
  formLayout!: ILayout;
  form!: FormGroup;
  options: IDataSelect[] = [];
  defaultOptions: IDataSelect[] = [];

  typeAlert: string | null = null;
  messageAlert: string | null = null;
  catchErrors: IFlowError[] = [];
  tableLayout: ITableStructure<IConsultingACHDetail> | null = null;
  isShowTable: boolean = false;
  isShowExport: boolean = false;
  isLoadingTable: boolean = true;
  isShowNextButton: boolean = true;
  isShowPrevButton = true;
  operationType: ICACHFilterOperation[] = operationType;
  typeOperation!: string;
  filterValue!: string;
  filterValueOptions: ICACHFilterValue[] = [];
  filterValueSelect: string = '';
  showFilterValue: boolean = false;
  tableInfo: ICACHTableType = [];
  typeOfOperations: TCACH_MOVEMENTS = '';

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get typeToReturn(): string {
    return !this.isShowNextButton ? 'primary' : 'secondary';
  }

  constructor(
    private consultAchDefinitionManager: CadManagerService,
    private adfFormBuilder: AdfFormBuilderService,
    private translateService: TranslateService,
    private consultAchTransaction: ConsultAchService,
    private router: Router,
    private parameterManagement: ParameterManagementService,
    private pdfGeneralService: ConsultAchPrintService,
    private xlsService: ConsultAchExcelServiceService,
    private util: UtilService,
  ) {}

  ngOnInit(): void {
    this.getSelectOptions();
    this.buildAlertResolver();
    this.initDefinition();
    this.handlePersistData();
    this.setDefaultDate();
  }

  getSelectOptions() {
    this.getListTypeOfMovements();
    this.getListTypeOfOperation();
    this.defaultOptions = [...this.options];
  }

  handlePersistData() {
    const state = this.parameterManagement.getParameter('consultingACHState');
    const currentState = state?.navigateStateParameters as IACHCForm;
    if (currentState) {

      this.form.patchValue({
        typeOfMovement: currentState?.typeOfMovement,
        initDate: currentState?.initDate,
        finalDate: currentState?.finalDate,
        minRange: currentState?.minRange,
        maxRange: currentState?.maxRange,
      });

      of(true)
        .pipe(delay(100))
        .subscribe({
          next: () => {
            this.form.get(AttributeFormConsultAch.TypeOfOperation)?.setValue(currentState?.typeOfOperation);
          },
        });

      of(true)
        .pipe(delay(200))
        .subscribe({
          next: () => {
            this.form.get(AttributeFormConsultAch.FILTER_VALUE)?.setValue(currentState?.filterValue);
            this.send();
          },
        });
    }
  }

  get filterValueControl() {
    return this.form.get('filterValue') as FormControl;
  }

  initDefinition() {
    this.formLayout = this.consultAchDefinitionManager.buildFormLayout();
    this.form = this.adfFormBuilder.formDefinition(this.formLayout.attributes);
    this.changeForm();
  }

  setDefaultDate() {
    const startOfMonth = moment().startOf('month').format('DD-MM-YYYY').split('-');
    const endOfMonth = moment().endOf('month').format('DD-MM-YYYY').split('-');

    const initialDateValue =  this.form.getRawValue()?.initDate === '' ? this.convertDateToObject(startOfMonth) : this.form.getRawValue()?.initDate;
    const finalDateValue = this.form.getRawValue().finalDate === '' ? this.convertDateToObject(endOfMonth) : this.form.getRawValue()?.finalDate;

    this.form.patchValue({
      initDate: initialDateValue,
      finalDate: finalDateValue,
    });
  }

  /* ======================================= FORM VALIDATIONS ============================ */
  changeForm() {
    this.form.get(AttributeFormConsultAch.InitDate)?.valueChanges.subscribe((initDate) => {
      this.validationInitDate(initDate);
    });

    this.form.get(AttributeFormConsultAch.FinalDate)?.valueChanges.subscribe((finalDate) => {
      this.validationFinalDate(finalDate);
    });

    this.form.get(AttributeFormConsultAch.MinRange)?.valueChanges.subscribe((minAmount) => {
      this.validationMinRange(+minAmount);
    });

    this.form.get(AttributeFormConsultAch.MaxRange)?.valueChanges.subscribe((maxAmount) => {
      this.validationMaxRange(+maxAmount);
    });

    this.form.get(AttributeFormConsultAch.TypeOfOperation)?.valueChanges.subscribe((typeOperation) => {
      if (this.typeOperation !== typeOperation) {
        this.typeOperation = typeOperation;
        this.validationTypeOperation(this.typeOfOperations === CACH_TYPE_MOVEMENTS.DEBIT ? typeFiltersByDebitRegisters : this.operationType);
      }

      if (typeOperation === '') {
        this.showFilterValue = false;
      }
    });

    this.form.get(AttributeFormConsultAch.TypeOfMovement)?.valueChanges.subscribe(value => {
      this.handleChangeOptionsByTyOfMovement(value);
    });
  }

  resetFilterState() {
    this.form.get(AttributeFormConsultAch.TypeOfOperation)?.setValue('');
    this.showFilterValue = false;
    this.filterValueSelect = '';
    this.filterValueOptions = [];
  }

  handleChangeOptionsByTyOfMovement(value: string) {
    this.resetFilterState();
    if (value === CACH_TYPE_MOVEMENTS.CREDIT) {
      const state = this.parameterManagement.getParameter('consultingACHState');
      const parameters = state?.navigateStateParameters;
      this.typeOfOperations = CACH_TYPE_MOVEMENTS.CREDIT;

      if (parameters?.isSend && parameters) {
        this.options = this.defaultOptions;
      } else {
        const emptyOption = typeFiltersByDebitRegisters[0];

        this.options = this.defaultOptions.map(option => {
          if (option.controlName === AttributeFormConsultAch.TypeOfOperation) {
            return {
              ...option,
              data: [{
                name: emptyOption.name,
                value: emptyOption.value,
              }, ...option.data],
            };
          }

          return option;
        });
      }

    }

    if (value === CACH_TYPE_MOVEMENTS.DEBIT) {
      this.typeOfOperations = CACH_TYPE_MOVEMENTS.DEBIT;
      const optionsMap: IPossibleValue[] = typeFiltersByDebitRegisters.map(option => ({
        name: option.name,
        value: option.value,
      }));

      this.options = this.options.map(option => {
        if (option.controlName === AttributeFormConsultAch.TypeOfOperation) {
          return {
            ...option,
            data: optionsMap,
          };
        }
        return option;
      });
    }
  }

  validationTypeOperation(typeFilterByOperation: ICACHFilterOperation[]) {
    const typeOperationFiltered = typeFilterByOperation.find((operation) => operation.value === this.typeOperation);

    if (!typeOperationFiltered || !typeOperationFiltered.isSelected) {
      this.showFilterValue = false;
      this.filterValue = this.typeOperation;
      return;
    }

    this.filterValueOptions = typeOperationFiltered.filterValues;
    this.filterValueSelect = typeOperationFiltered.filterValues[0].value;
    this.showFilterValue = true;
  }

  validationMinRange(minRange: number) {
    const maxRange: number = +this.form.get(AttributeFormConsultAch.MaxRange)?.value;

    if (maxRange && maxRange < minRange) {
      this.form.controls[AttributeFormConsultAch.MinRange].setErrors({ 'non.existent_range': true });
    }
  }

  validationMaxRange(maxRange: number) {
    const minRange: number = +this.form.get(AttributeFormConsultAch.MinRange)?.value;

    if (minRange && minRange > maxRange) {
      this.form.controls[AttributeFormConsultAch.MaxRange].setErrors({ 'non.existent_range': true });
    }
  }

  validationInitDate(initDate: NgbDate) {
    const finalDate: NgbDate = this.form.get(AttributeFormConsultAch.FinalDate)?.value;
    const initMoment = moment({ year: initDate.year, month: initDate.month - 1, day: initDate.day });
    const finalMoment = moment({ year: finalDate.year, month: finalDate.month - 1, day: finalDate.day });

    if (finalMoment && finalMoment < initMoment) {
      this.form.controls[AttributeFormConsultAch.InitDate].setErrors({ 'non.existent_date_range': true });
    }
  }

  validationFinalDate(finalDate: NgbDate) {
    const initDate: NgbDate = this.form.get(AttributeFormConsultAch.InitDate)?.value;
    const initMoment = moment({ year: initDate.year, month: initDate.month - 1, day: initDate.day });
    const finalMoment = moment({ year: finalDate.year, month: finalDate.month - 1, day: finalDate.day });

    if (initMoment && initMoment > finalMoment) {
      this.form.controls[AttributeFormConsultAch.FinalDate].setErrors({ 'non.existent_date_range': true });
    }
  }

  /* ======================================= FORM VALIDATIONS ============================ */


  backStep() {
    if (!this.isShowNextButton) {
      this.handleResetState();
    } else {
      this.router.navigate(['/home']).then(() => {});
    }
  }

  getListTypeOfMovements() {
    const dataSelect: IDataSelect = {
      controlName: AttributeFormConsultAch.TypeOfMovement,
      data: [
        {
          name: 'type_debited_movement',
          value: 'debit',
        },
      ],
    };

    this.options = [{...dataSelect}, ...this.options];
  }

  getListTypeOfOperation() {
    const optionList = this.operationType.map(option => ({
      name: option.name,
      value: option.value,
    }))


    const dataSelect: IDataSelect = {
      controlName: AttributeFormConsultAch.TypeOfOperation,
      data: optionList,
    };

    this.options = [...this.options, {...dataSelect}]
  }

  buildAlertResolver() {
    const error = this.catchErrors.reduce((txt: string, errorResponse: IFlowError) => {
      const translatedError = this.translateService.instant(errorResponse?.message);
      return `${txt + ' ' + translatedError}`;
    }, '');

    if (!error) return;

    const customError = `${this.translateService.instant('error:base_message')} ${error}`;
    this.showAlert('error', customError);
  }

  send() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.util.showPulseLoader();
    this.isShowTable = true;

    const initDate = this.form.get(AttributeFormConsultAch.InitDate)?.value;
    const finalDate = this.form.get(AttributeFormConsultAch.FinalDate)?.value;

    const initDateMilliseconds = new Date(initDate.year, initDate.month - 1, initDate.day).getTime();
    const finalDateMilliseconds = new Date(finalDate.year, finalDate.month - 1, finalDate.day).getTime();

    if (this.form.get(AttributeFormConsultAch.TypeOfMovement)?.value === 'debit') {
      this.sendTransactionDebit(initDateMilliseconds, finalDateMilliseconds);
    } else {
      this.sendTransactionCredit(initDateMilliseconds, finalDateMilliseconds);
    }
  }

  convertDateToObject(date: string[]) {
    return {
      year: Number(date[2]),
      month: Number(date[1]),
      day: Number(date[0])
    } as NgbDate;
  }

  getTypeOperation() {
    const typeOperationFormValue = this.form.get(AttributeFormConsultAch.TypeOfOperation)?.value;

    return !typeOperationFormValue ? CACH_TYPE_OPERATION.EMPTY_VALUE : typeOperationFormValue;
  }

  getFilterValue(typeOperation: string) {
    if (typeOperation === CACH_TYPE_OPERATION.EMPTY_VALUE) { return typeOperation; }

    return this.showFilterValue ? this.filterValueSelect : this.typeOperation;
  }

  sendTransactionCredit(initDate: number, finalDate: number) {
    this.hiddenAlert();
    this.isShowExport = false;
    this.isShowTable = true;
    this.isLoadingTable = true;
    const typeOperation = this.getTypeOperation();
    const filterValue = this.getFilterValue(typeOperation);


    const request: ICOTransactionCredit = {
      initDate,
      finalDate,
      typeOperation,
      filterValue,
    };

    this.consultAchTransaction.getTransactionCredit(request)
      .pipe(finalize(() => this.hideLoadingTable()))
      .subscribe({
        next: (response) => {
          this.handleACHCreditsResponse(response);
        },
        error: (error) => {
          this.util.scrollToTop();
          this.isShowTable = false;
          this.resetOperationState();
          this.showAlert('error', error?.error?.message);
          if (this.tableLayout?.items) this.tableLayout.items = [];
        },
      });
  }

  hideLoadingTable() {
    this.isLoadingTable = false;
    this.util.hidePulseLoader();
  }

  handleACHCreditsResponse(response: ICOResponseCredits) {
    if (!response || !response.hasOwnProperty('credits') || response?.credits.length <= 0) {
      this.tableLayout = this.consultAchDefinitionManager.buildTableLayout({
        operations: [],
        typeOperation: CACH_TYPE_MOVEMENTS.CREDIT,
      });

      (this.tableLayout.manageAlertMessage as IManageAlertMessage).message = 'no_matches_found_operations';
      this.isShowExport = false;
      this.resetOperationState();
      return;
    }

    const listAccount = this.filterAmount(response.credits);
    this.isShowExport = listAccount.length !== 0;
    this.tableInfo = listAccount;
    this.tableLayout = this.consultAchDefinitionManager.buildTableLayout({
      operations: listAccount,
      typeOperation: CACH_TYPE_MOVEMENTS.CREDIT,
    });

    this.isShowNextButton = false;
  }

  sendTransactionDebit(initDate: number, finalDate: number) {
    this.hiddenAlert();
    this.isShowExport = false;
    this.isLoadingTable = true;
    this.isShowTable = true;
    const request: ICOTransactionDebits = {
      initDate,
      finalDate,
    };

    this.consultAchTransaction.getTransactionDebits(request)
      .pipe(finalize(() => this.hideLoadingTable()))
      .subscribe({
        next: (response) => {
          this.handleDebitsResponse(response);
        },
        error: (error) => {
          this.isLoadingTable = false;
          this.isShowTable = false;
          this.util.scrollToTop();
          this.resetOperationState();
          this.showAlert('error', error?.error?.message);
        },
      });
  }

  resetOperationState() {
    this.parameterManagement.sendParameters({
      consultingACHState: null,
    });
  }

  handleDebitsResponse(response: ICOResponseDebits) {
    if (!response || !response.hasOwnProperty('debits') || response?.debits.length <= 0) {
      this.tableLayout = this.consultAchDefinitionManager.buildTableLayout({
        operations: [],
        typeOperation: CACH_TYPE_MOVEMENTS.DEBIT,
      });

      (this.tableLayout.manageAlertMessage as IManageAlertMessage).message = 'no_matches_found_operations';
      this.isShowExport = false;
      this.resetOperationState();
      return;
    }

    const listAccount = this.filterAmount(response.debits);
    const filteredRegisters = this.getDebitRegisterFilter(listAccount);
    this.isShowExport = filteredRegisters.length !== 0;
    this.tableInfo = filteredRegisters;
    this.tableLayout = this.consultAchDefinitionManager.buildTableLayout({
      operations: filteredRegisters ?? [],
      typeOperation: CACH_TYPE_MOVEMENTS.DEBIT,
    });

    this.isShowNextButton = false;
  }

  getDebitRegisterFilter(registers: ICACHDebitRegisters[]) {
    const compareProperties: Record<string, (register: ICACHDebitRegisters) => any> = {
      ['']: register => register,
      ['R']: register => register.operationType === this.filterValue,
      ['E']: register => register.operationType === this.filterValue,
      ['MONEDA']: register => this.util.getCurrencySymbolToIso(register.currency) === this.filterValueSelect,
    };

    return registers.filter(compareProperties[this.typeOperation]);
  }

  filterAmount<T = any>(listAccount: T[]) {
    const minValue = String(this.form.get(AttributeFormConsultAch.MinRange)?.value || MIN_MAX_RANGE.MIN);
    const maxValue = String(this.form.get(AttributeFormConsultAch.MaxRange)?.value || MIN_MAX_RANGE.MAX);

    return listAccount.filter(account => {
      const currentAmount = this.util.parseCustomNumber(account['amount']);
      return currentAmount >= this.util.parseCustomNumber(minValue) && currentAmount <= this.util.parseCustomNumber(maxValue);
    });
  }

  getActionTable(item: any) {
    const actionType: ILoadItem<ICOResponseAccount> = item;

    if (actionType.action === EConsultACHTableActions.VIEW_DETAIL) {
      return this.goToDetail(actionType.item);
    }
  }

  goToDetail(transactionSelected: ICOResponseAccount) {
    const typeMovementValue = this.form.get(AttributeFormConsultAch.TypeOfMovement)?.value;
    if (typeMovementValue === CACH_TYPE_MOVEMENTS.DEBIT) return;

    this.getCreditDetail(transactionSelected);
  }

  getCreditDetail(transactionSelected: ICOResponseAccount) {
    this.util.showLoader();
    this.consultAchTransaction
      .getTransactionCreditDetail(`${transactionSelected.id}`)
      .subscribe({
        next: (response) => {
          const params = {
            consultingACHState: {
              transactionItem: transactionSelected,
              parameterDetail: response,
              navigateStateParameters: {
                initDate: this.form.getRawValue()?.initDate,
                finalDate: this.form.getRawValue()?.finalDate,
                typeOfMovement: this.form.getRawValue()?.typeOfMovement,
                typeOfOperation: this.form.getRawValue()?.typeOfOperation,
                minRange: this.form.getRawValue()?.minRange,
                maxRange: this.form.getRawValue()?.maxRange,
                filterValue: this.form.getRawValue()?.filterValue,
                isSend: true,
              }
            },
            navigationProtectedParameter: CONSULT_ACH_PROTECTED_PARAMETER.DETAIL,
          } as IConsultingACHState;

          this.parameterManagement.sendParameters(params);
          this.router.navigate(['/transfer/consult-ach/detail']).finally(() => this.util.hideLoader());
        },
        error: (error) => {
          this.showAlert('error', error?.error?.message);
          this.util.hideLoader();
          this.util.scrollToTop();
        },
      });
  }

  generateCsvFile(){
    this.xlsService.generate(this.tableInfo, {
      movement: this.typeOfOperations,
    }, 'Consulta de operaciones', 'csv');
  }

  generateXlsFile(){
    this.xlsService.generate(this.tableInfo, {
      movement: this.typeOfOperations,
    }, 'Consulta de operaciones' );
  }

  exportGeneralFile() {
    const initDate = this.form.get(AttributeFormConsultAch.InitDate)?.value;
    const finalDate = this.form.get(AttributeFormConsultAch.FinalDate)?.value;
    const initDateMilliseconds = `${(('0' + initDate?.day).slice(-2)) }/${(('0' + initDate?.month).slice(-2))  }/${initDate.year}`
    const finalDateMilliseconds =`${(('0' + finalDate?.day).slice(-2)) }/${(('0' + finalDate?.month).slice(-2))  }/${finalDate.year}`

    const data = {
      data: this.tableInfo,
      initialDate: initDateMilliseconds,
      finalDate: finalDateMilliseconds,
      movement: this.typeOfOperations
    }

    this.pdfGeneralService.pdfGenerate(data, '', 'Consulta de operaciones', 248, '');
  }


  showAlert(typeAlert: string, message: string) {
    this.typeAlert = typeAlert;
    this.messageAlert = message;
  }

  hiddenAlert() {
    this.messageAlert = null;
    this.typeAlert = null;
  }

  handleResetState() {
    this.isShowNextButton = true;
    this.isShowTable = false;
    this.isLoadingTable = true;
    this.showFilterValue = false;
    this.filterValueSelect = '';
    this.typeOperation = '';
    this.resetOperationState();
    this.initDefinition();
    this.setDefaultDate();
    this.util.scrollToTop();
    this.tableInfo = [];
    this.tableLayout = null;
  }

}
