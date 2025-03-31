import { Component, OnInit } from '@angular/core';
import { AdfFormBuilderService, IDataSelect, ILayout } from '@adf/components';
import { FormGroup } from '@angular/forms';
import {
  BisvGeneralParameters,
  IACHBiesGeneralParameterBank,
  IACHBiesGeneralParameters
} from '../../../../../../../models/ach-general-parameters.interface';
import { UtilService } from '../../../../../../../service/common/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../../service/navegation-parameters/parameter-management.service';
import { IFlowError } from '../../../../../../../models/error.interface';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../../enums/common-value.enum';
import { AM365FormControlName } from '../../../enum/form-control-name.enum';
import { AM365UrlCollection } from '../../../enum/url-collection.enum';
import { AmdM365CreateFormService } from '../../../services/definition/amd-m365-create-form.service';
import { AM365CreateHomeState, IAM365HomeUpdateState } from '../../../interfaces/state.interface';
import { M365RouteProtectedParameters } from '../../../enum/route-protected.enum';

@Component({
  selector: 'byte-am-m365-create',
  templateUrl: './am-m365-create.component.html',
  styleUrls: ['./am-m365-create.component.scss']
})
export class AmM365CreateComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  formLayout!: ILayout;
  form!: FormGroup;
  selectOptions: IDataSelect[] = [];

  settings: IACHBiesGeneralParameters = new BisvGeneralParameters().build();

  bankSelected: IACHBiesGeneralParameterBank | undefined = undefined;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private utils: UtilService,
    private router: Router,
    private parameterManagement: ParameterManagementService,
    private adfFormBuilderService: AdfFormBuilderService,
    private activatedRouter: ActivatedRoute,
    private formDefinition: AmdM365CreateFormService,
  ) { }



  ngOnInit(): void {
    this.initState();
    this.initDefinition();
    this.utils.hideLoader();
  }

  initState() {
    this.getGeneralParameters();
  }

  getGeneralParameters() {
    const generalParametersResponse = this.activatedRouter.snapshot.data['generalParameters'];

    if (generalParametersResponse.hasOwnProperty('error')) {
      this.showAlert('error', (generalParametersResponse as IFlowError).message);
      return;
    }

    this.settings = generalParametersResponse;
  }

  initDefinition() {
    this.initFormDefinition();
  }

  initFormDefinition() {
    this.formLayout = this.formDefinition.buildFormLayout();
    this.form = this.adfFormBuilderService.formDefinition(this.formLayout.attributes);

    this.buildFormOptions();
    this.changeForm();
    this.manageSetPersistenceFormValues();
  }

  manageSetPersistenceFormValues() {
    const state = this.parameterManagement.getParameter<IAM365HomeUpdateState>(PROTECTED_PARAMETER_STATE);

    if (!state?.formValues) return;

    this.form.patchValue(state.formValues);
  }

  buildFormOptions() {
    const bankOption = this.buildBankOptions();

    this.selectOptions = [bankOption];
  }

  buildBankOptions() {
    const bankAvailable = this.settings.banks.filter(bank => bank.participant[2] === 'S');

    const bankOptions = bankAvailable.map(bank => {
      return {
        name: bank.description,
        value: bank.code + '',
      }
    });

    return {
      controlName: AM365FormControlName.BANK,
      data: bankOptions,
    } as IDataSelect;
  }

  changeForm() {
    this.form.get(AM365FormControlName.BANK)?.valueChanges.subscribe({
      next: (value: string) => {
        this.bankSelected = this.settings.banks.find(bank => bank.code === value);
      }
    });
  }

  previous() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: null,
      [PROTECTED_PARAMETER_ROUTE]: null,
    });

    this.router.navigate([AM365UrlCollection.HOME]).finally(() => {});
  }

  nextStep() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        formValues: this.form.value,
        bankSelected: this.bankSelected,
      } as AM365CreateHomeState,
      [PROTECTED_PARAMETER_ROUTE]: M365RouteProtectedParameters.CREATE_CONFIRM,
    });

    this.router.navigate([AM365UrlCollection.CREATE_CONFIRMATION]).finally(() => {});
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }
}
