import {Component, OnInit} from '@angular/core';
import {PmpldFormService} from '../../../services/definition/load/upload-file/pmpld-form.service';
import { AdfFormBuilderService, ILayout, ITableStructure } from '@adf/components';
import {FormControl, FormGroup} from '@angular/forms';
import {PmpldTableService} from '../../../services/definition/load/upload-file/pmpld-table.service';
import {SimplePaymentPayrollLoadFormAttributes} from '../../../enums/form-attributes.enum';
import {Router} from '@angular/router';
import {UtilService} from '../../../../../../service/common/util.service';
import {ParameterManagementService} from '../../../../../../service/navegation-parameters/parameter-management.service';
import {SPPMRoutes} from '../../../enums/pmp-routes.enum';
import {PaymentOfPayrollRouteProtectedParameter} from '../../../enums/pmp-protected-parameter.enum';
import {PMP_TYPE_FILE, PMP_TYPE_UPLOAD} from '../../../enums/pmp-file-structure.enum';
import {PmpLoadHomeState} from '../../../interfaces/pmp-state.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'byte-pmp-home',
  templateUrl: './pmp-load-home.component.html',
  styleUrls: ['./pmp-load-home.component.scss']
})
export class PmpLoadHomeComponent implements OnInit {
  formLayout!: ILayout;
  form!: FormGroup;
  tableLayout!: ITableStructure;
  typeUploadSelected: string = '';
  typeFileSelected: string = '';

  constructor(
    private formDefinition: PmpldFormService,
    private adfFormBuilderService: AdfFormBuilderService,
    private tableDefinitionService: PmpldTableService,
    private router: Router,
    private utils: UtilService,
    private parameterManagerService: ParameterManagementService,
    private translate: TranslateService,
  ) {
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
    this.formLayout = this.formDefinition.buildFormLayout({
      title: 'payroll:title',
      subtitle: 'payroll:load_subtitle',
    });

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
      this.saveStorage(PaymentOfPayrollRouteProtectedParameter.HOME_LOAD_FILE);
      this.router.navigate([SPPMRoutes.HOME_LOAD_FILE]).finally(() => this.utils.hideLoader());
      return;
    }

    this.saveStorage(PaymentOfPayrollRouteProtectedParameter.HOME_LOAD_MANUAL);
    this.router.navigate([SPPMRoutes.HOME_LOAD_MANUAL]).finally(() => this.utils.hideLoader());
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
    this.router.navigate([SPPMRoutes.HOME]).finally(() => this.utils.hideLoader());
  }

}
