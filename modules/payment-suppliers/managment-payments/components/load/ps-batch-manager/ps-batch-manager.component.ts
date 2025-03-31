import { AdfFormBuilderService, ILayout, ITableStructure } from '@adf/components';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SimplePaymentPayrollLoadFormAttributes } from 'src/app/modules/payroll/manager-payroll/enums/form-attributes.enum';
import { PMP_TYPE_FILE, PMP_TYPE_UPLOAD } from 'src/app/modules/payroll/manager-payroll/enums/pmp-file-structure.enum';
import { PmpLoadHomeState } from 'src/app/modules/payroll/manager-payroll/interfaces/pmp-state.interface';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { PsManagerFormService } from '../../../definitions/ps-manager-form.service';
import { PsManagerTableService } from '../../../definitions/ps-manager-table.service';
import { SPRoutes } from '../../../enums/ps-routes.enum';
import { PaymentOfSupplierRouteProtectedParameter } from '../../../enums/ps-protected-parameter.enum';
import { OnResize } from 'src/app/modules/shared/classes/on-risize';

@Component({
  selector: 'byte-ps-batch-manager',
  templateUrl: './ps-batch-manager.component.html',
  styleUrls: ['./ps-batch-manager.component.scss']
})

export class PsBatchManagerComponent extends OnResize {
  formLayout!: ILayout;
  form!: FormGroup;
  tableLayout!: ITableStructure;
  typeUploadSelected: string = '';
  typeFileSelected: string = '';

  get isMobileExtraSmall(): boolean {
    return window.innerWidth < 361;
  }
  constructor(
    private formDefinition: PsManagerFormService,
    private adfFormBuilderService: AdfFormBuilderService,
    private tableDefinitionService: PsManagerTableService,
    private router: Router,
    private utils: UtilService,
    private parameterManagerService: ParameterManagementService,
    private translate: TranslateService,
  ) {
    super();
    this.translate.onLangChange.subscribe(() => {
      this.tableDefinition();
    });
  }

  ngOnInit(): void {
    this.init();
    this.tableDefinition();
  }

  tableDefinition() {
    if (this.typeFileSelected === PMP_TYPE_FILE.EXCEL) {
      this.tableLayout = this.tableDefinitionService.buildExcelFieldTable();
      return
    }

    this.tableLayout = this.tableDefinitionService.buildCsvFieldTable();
  }

  get typeUploadControl() {
    return this.form.get(SimplePaymentPayrollLoadFormAttributes.TYPE_LOAD) as FormControl;
  }

  get typeFileControl() {
    return this.form.get(SimplePaymentPayrollLoadFormAttributes.TYPE_FILE) as FormControl;
  }

  get isFileSelected() {
    return this.typeUploadSelected === PMP_TYPE_UPLOAD.FILE;
  }

  init() {
    this.formLayout = this.formDefinition.buildFormLayout('ps:title');

    this.form = this.adfFormBuilderService.formDefinition(this.formLayout.attributes);
    this.changeForm();
    this.handlePersistes();
  }

  handlePersistes() {
    const state = this.parameterManagerService.getParameter<PmpLoadHomeState | undefined>('navigateStateParameters');
    const formState = state?.formState;

    if (!formState) {
      this.form.get(SimplePaymentPayrollLoadFormAttributes.TYPE_LOAD)?.setValue(PMP_TYPE_UPLOAD.FILE)
      this.form.get(SimplePaymentPayrollLoadFormAttributes.TYPE_FILE)?.setValue(PMP_TYPE_FILE.EXCEL)
      return;
    }

    this.form.patchValue(formState)
  }

  changeForm() {
    this.form.get(SimplePaymentPayrollLoadFormAttributes.AMOUNT)?.valueChanges.subscribe({
      next: (value) => {
        console.log('VALOR', value)
      }
    })
    this.typeUploadControl.valueChanges.subscribe({
      next: (value) => {
        this.typeUploadSelected = value;
      }
    })

    this.typeFileControl.valueChanges.subscribe({
      next: (value) => {
        this.typeFileSelected = value;
        this.tableDefinition();
      }
    })
  }

  next() {
    if (!this.form.valid) {
      this.utils.scrollToTop();
      this.form.markAllAsTouched();
      return;
    }

    const creditsControl = this.form.get(SimplePaymentPayrollLoadFormAttributes.CREDITS);
    if (creditsControl?.value && Number(creditsControl.value) <= 0) {
      creditsControl.setErrors({ customErrorCredits: true });
      return;
    }

    this.utils.showLoader();

    if (this.typeUploadSelected === PMP_TYPE_UPLOAD.FILE) {
      this.saveStorage(PaymentOfSupplierRouteProtectedParameter.HOME_LOAD_FILE);
      this.router.navigate([SPRoutes.FILE_MANAGMENT]).finally(() => this.utils.hideLoader());
      return;
    }

    this.saveStorage(PaymentOfSupplierRouteProtectedParameter.HOME_LOAD_MANUAL);
    this.router.navigate([SPRoutes.MANUAL_MANAGER]).finally(() => this.utils.hideLoader());
  }

  saveStorage(protectedParameter: string) {
    const stateParameters: PmpLoadHomeState = {
      formState: this.form.value,
    }

    this.parameterManagerService.sendParameters({
      navigateStateParameters: stateParameters,
      navigationProtectedParameter: protectedParameter,
    })
  }

  resetStorage() {
    this.parameterManagerService.sendParameters({
      navigateStateParameters: null
    })
  }

  previous() {
    this.resetStorage();
    this.utils.showLoader();
    this.router.navigate([SPRoutes.HOME]).finally(() => this.utils.hideLoader());
  }

}
