import { Component, OnInit } from '@angular/core';
import { AdfFormBuilderService, IDataSelect, ILayout, IPossibleValue } from '@adf/components';
import { FormControl, FormGroup } from '@angular/forms';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { UtilService } from '../../../../../../service/common/util.service';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { TmdAchFormService } from '../../services/definition/tmd-ach-form.service';
import { ETMACHFormControl, ETMACHService } from '../../enum/form-control-name.enum';
import serviceListJson from '../../data/service.json';
import typeServiceListJson from '../../data/type-service.json';
import typeTransactionListJson from '../../data/type-transaction.json';
import { ITMConsultACHHomeState } from '../../interfaces/state.interface';
import { ETMConsultACHUrlCollection } from '../../enum/url-collection.enum';
import moment from 'moment/moment';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { AdminPanelProvidersProtectedParameters } from '../../enum/route-protected.enum';

@Component({
  selector: 'byte-tm-ach-home',
  templateUrl: './tm-ach-home.component.html',
  styleUrls: ['./tm-ach-home.component.scss']
})
export class TmAchHomeComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  formLayout!: ILayout;
  form!: FormGroup;
  selectOptions: IDataSelect[] = [];

  serviceFormOptions: Array<IPossibleValue> = [];
  serviceValueSelected: string = '';

  typeServiceFormOptions: Array<IPossibleValue> = [];
  typeServiceValueSelected: string = '';

  typeTransactionFormOptions: Array<IPossibleValue> = [];
  typeTransactionValueSelected: string = '';

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get serviceControl() {
    return this.form.get(ETMACHFormControl.SERVICE) as FormControl;
  }

  get typeServiceControl() {
    return this.form.get(ETMACHFormControl.TYPE_SERVICE) as FormControl;
  }

  get transactionTypeControl() {
    return this.form.get(ETMACHFormControl.TYPE_TRANSACTION) as FormControl;
  }

  get isShowExtendedSelectForm() {
    return this.serviceValueSelected && this.serviceValueSelected === ETMACHService.ATOMIC;
  }


  constructor(
    private utils: UtilService,
    private router: Router,
    private parameterManagement: ParameterManagementService,
    private adfFormBuilderService: AdfFormBuilderService,
    private formDefinitionService: TmdAchFormService,
  ) { }

  ngOnInit(): void {
    this.initDefinition();
    this.utils.hideLoader();
  }

  initDefinition() {
    this.formLayout = this.formDefinitionService.buildFormLayout();
    this.form = this.adfFormBuilderService.formDefinition(this.formLayout.attributes);

    this.buildFormOptions();
    this.setDefaultCurrentDate()
    this.changeForm();
  }

  setDefaultCurrentDate() {
    const startOfMonth = moment().startOf('month').format('DD-MM-YYYY').split('-');
    const endOfMonth = moment().endOf('month').format('DD-MM-YYYY').split('-');

    const initialDateValue =  this.convertDateToObject(startOfMonth);
    const finalDateValue =  this.convertDateToObject(endOfMonth);

    this.form.patchValue({
      [ETMACHFormControl.INITIAL_DATE]: initialDateValue,
      [ETMACHFormControl.FINAL_DATE]: finalDateValue,
    });
  }

  buildFormOptions() {
    this.buildServiceFormOptions();
    this.buildTypeServiceFormOptions();
    this.buildTypeTransactionFormOptions()
  }

  buildServiceFormOptions() {
    const formOptions = {
      controlName: ETMACHFormControl.SERVICE,
      data: serviceListJson,
    }

    this.serviceFormOptions = [...formOptions.data];
  }

  buildTypeServiceFormOptions() {
    const formOptions = {
      controlName: ETMACHFormControl.TYPE_SERVICE,
      data: typeServiceListJson,
    }
    this.typeServiceFormOptions = [...formOptions.data];
  }

  buildTypeTransactionFormOptions() {
    const formOptions = {
      controlName: ETMACHFormControl.TYPE_TRANSACTION,
      data: typeTransactionListJson,
    }


    this.typeTransactionFormOptions = [...formOptions.data];
  }

  changeForm() {
    this.serviceControl.valueChanges.subscribe({
      next: () => {
        this.typeServiceControl.reset('');
        this.transactionTypeControl.reset('');
      }
    });

    this.form.get(ETMACHFormControl.INITIAL_DATE)?.valueChanges
      .subscribe(initDate => {
        this.validationInitDate(initDate);
      });

    this.form.get(ETMACHFormControl.FINAL_DATE)?.valueChanges
      .subscribe(finalDate => {
        this.validationFinalDate(finalDate);
      });
  }

  validationInitDate(initDate: NgbDate) {
    if (!initDate) return;

    const finalDate: NgbDate = this.form.get(ETMACHFormControl.FINAL_DATE)?.value;
    const initMoment = moment({ year: initDate.year, month: initDate.month - 1, day: initDate.day });
    const finalMoment = moment({ year: finalDate.year, month: finalDate.month - 1, day: finalDate.day });

    if (finalMoment && finalMoment < initMoment) {
      this.form.controls[ETMACHFormControl.INITIAL_DATE].setErrors({ 'non.existent_date_range': true });
    }  else {
      this.form.controls[ETMACHFormControl.FINAL_DATE].setErrors(null);
    }


    const monthDiff = finalMoment.diff(initMoment, 'months', true);

    if (monthDiff > 1) {
      this.form.controls[ETMACHFormControl.INITIAL_DATE].setErrors({ 'non.existent_date_range': true });
    }

    if (!initMoment.isValid()) {
      this.form.controls[ETMACHFormControl.INITIAL_DATE].setErrors({ 'non.existent_date_range': true });
    }

    if (!finalMoment.isValid()) {
      this.form.controls[ETMACHFormControl.FINAL_DATE].setErrors({ 'non.existent_date_range': true });
    }
  }

  validationFinalDate(finalDate: NgbDate) {
    if (!finalDate) return;

    const initDate: NgbDate = this.form.get(ETMACHFormControl.INITIAL_DATE)?.value;
    const initMoment = moment({ year: initDate.year, month: initDate.month - 1, day: initDate.day });
    const finalMoment = moment({ year: finalDate.year, month: finalDate.month - 1, day: finalDate.day });

    if (initMoment && initMoment > finalMoment) {
      this.form.controls[ETMACHFormControl.FINAL_DATE].setErrors({ 'non.existent_date_range': true });
    } else {
      this.form.controls[ETMACHFormControl.INITIAL_DATE].setErrors(null);
    }

    const monthDiff = finalMoment.diff(initMoment, 'months', true);

    if (monthDiff > 1) {
      this.form.controls[ETMACHFormControl.FINAL_DATE].setErrors({ 'non.existent_date_range': true });
    }

    if (!initMoment.isValid()) {
      this.form.controls[ETMACHFormControl.INITIAL_DATE].setErrors({ 'non.existent_date_range': true });
    }

    if (!finalMoment.isValid()) {
      this.form.controls[ETMACHFormControl.FINAL_DATE].setErrors({ 'non.existent_date_range': true });
    }
  }

  previous() {
    this.utils.showLoader();
    this.router.navigate(['home']).finally(() => {});
  }

  nextStep() {
    if (this.serviceValueSelected === '') {
      this.form.markAllAsTouched();
      return;
    }


    this.manageNavigateForAtomicTransference();
    this.manageNavigateForMultipleTransference();
  }

  manageNavigateForAtomicTransference() {
    if (this.serviceValueSelected !== ETMACHService.ATOMIC) return;

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }


    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        formValues: this.form.value,
      } as ITMConsultACHHomeState,
      [PROTECTED_PARAMETER_ROUTE]: AdminPanelProvidersProtectedParameters.LOOK_UP_ATOMIC
    });

    this.router.navigate([ETMConsultACHUrlCollection.CONSULT_ATOMIC]).finally(() => {});
  }

  manageNavigateForMultipleTransference() {
    if (this.serviceValueSelected === ETMACHService.ATOMIC) return;

    const initialDateControl = this.form.get(ETMACHFormControl.INITIAL_DATE) as FormControl;
    const finalDateControl = this.form.get(ETMACHFormControl.FINAL_DATE) as FormControl;

    if (!initialDateControl.valid || !finalDateControl.valid) {
      initialDateControl.markAllAsTouched();
      finalDateControl.markAllAsTouched();
      return;
    }

    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        formValues: this.form.value,
      } as ITMConsultACHHomeState,
      [PROTECTED_PARAMETER_ROUTE]: AdminPanelProvidersProtectedParameters.LOOK_UP_MULTIPLE,
    });

    this.router.navigate([ETMConsultACHUrlCollection.CONSULT_MULTIPLE]).finally(() => {});
  }

  convertDateToObject(date: string[]) {
    return {
      year: Number(date[2]),
      month: Number(date[1]),
      day: Number(date[0])
    } as NgbDate;
  }

}
