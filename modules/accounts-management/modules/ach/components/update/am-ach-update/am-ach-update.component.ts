import { Component, OnInit } from '@angular/core';
import { AdfFormBuilderService, DataLayoutSelectBuilder, FormValidationsBuilder, IDataLayoutSelect, IDataSelect, ILayout, MaxLengthMessageHandlerBuilder, MinLengthMessageHandlerBuilder, RegexMessageHandlerBuilder, RequiredMessageHandlerBuilder } from '@adf/components';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IACHBiesGeneralParameterBank, IACHBiesGeneralParameterListDocument, IACHBiesGeneralParameters } from '../../../../../../../models/ach-general-parameters.interface';
import { UtilService } from '../../../../../../../service/common/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../../service/navegation-parameters/parameter-management.service';
import { TranslateService } from '@ngx-translate/core';
import { IFlowError } from '../../../../../../../models/error.interface';
import { AMAchUrlCollection } from '../../../enum/url-collection.enum';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../../enums/common-value.enum';
import { IAMACHHomeUpdateState } from '../../../interfaces/state.interface';
import reasonListJson from '../../../../../data/reason-list.json';
import { ACAchCreateFromControl } from '../../../enum/form-control.enum';
import { AmdAchUpdateFormService } from '../../../services/definition/amd-ach-update-form.service';
import { IAACHUpdateFormParameters } from '../../../interfaces/form.interface';
import { AmACHRouteProtected } from '../../../enum/route-protected.enum';


@Component({
  selector: 'byte-am-ach-update',
  templateUrl: './am-ach-update.component.html',
  styleUrls: ['./am-ach-update.component.scss']
})
export class AmAchUpdateComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  formLayout!: ILayout;
  form!: FormGroup;
  selectOptions: IDataSelect[] = [];

  settings!: IACHBiesGeneralParameters;

  reasonSelected: any = undefined;


  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get statusControl() {
    return this.form.get(ACAchCreateFromControl.STATUS) as FormControl;
  }

  get radioMode() {
    return 'switch' as any;
  }

  constructor(
    private utils: UtilService,
    private router: Router,
    private parameterManagement: ParameterManagementService,
    private adfFormBuilderService: AdfFormBuilderService,
    private activatedRouter: ActivatedRoute,
    private formDefinition: AmdAchUpdateFormService,
    private translate: TranslateService,
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
    const { account } = this.parameterManagement.getParameter<IAACHUpdateFormParameters>(PROTECTED_PARAMETER_STATE);
    const bank: IACHBiesGeneralParameterBank | undefined= this.settings?.banks?.find((b: IACHBiesGeneralParameterBank) => b.code === String(account.bank));
    const documentType: IACHBiesGeneralParameterListDocument | undefined= this.settings?.general?.listDocuments.find((doc: IACHBiesGeneralParameterListDocument) => doc.identificationId === account.documentType);

    this.formLayout = this.formDefinition.buildFormLayout({
      account,
      bank,
      documentType
    });

    this.form = this.adfFormBuilderService.formDefinition(this.formLayout.attributes);

    this.buildFormOptions();
    this.manageSetDefaultValues();
    this.manageDataPersists();
    this.setValidatorMaskNoIdentify(documentType);
    this.changeForm();
  }

  setValidatorMaskNoIdentify(documentIdentificationSelected: IACHBiesGeneralParameterListDocument | undefined){

    if (!documentIdentificationSelected) {
      return;
    }

    const mask = documentIdentificationSelected.mask;
    const regexMap: { [key: string]: string } = {
      'L': '[A-Z]',          // Letra mayúscula
      'A': '[A-Za-z]',       // Cualquier letra
      'N': '[0-9]',          // Número
      '@': '[A-Za-z0-9]',    // Cualquier letra o número
      'F': 'F',              // Carácter fijo 'F'
      '#': '[0-9]',          // Número
      '-': '-',              // Literal para el guion
    };
    const regexPattern = mask.split('').map(char => regexMap[char] || char).join('');
    const minLength: number = mask.length ?? 0;
    const maxLength: number = mask.length ?? 0;
    const requiredMessage = new RequiredMessageHandlerBuilder()
    .label('admin-ach:field_required')
    .build();

    const documentIdValidator = new RegexMessageHandlerBuilder()
      .label('admin-ach:error_input_mask')
      .build();

      const messageMinLengthBuilder = new MinLengthMessageHandlerBuilder()
      .label(this.translate.instant('admin-ach-id_length_min', {
        min: minLength,
      }))
      .build();

      const maxMinLengthBuilder = new MaxLengthMessageHandlerBuilder()
        .label(this.translate.instant('admin-ach-id_length_max', {
          max: maxLength,
        }))
        .build();

      const validationNoId = new FormValidationsBuilder()
      .required(true)
      .minLength(minLength)
      .maxLength(maxLength)
      .regex(regexPattern)
      .validationMessageHandlerList([requiredMessage, documentIdValidator, messageMinLengthBuilder, maxMinLengthBuilder])
      .build();

      this.formLayout.attributes.forEach((item) => {
        if (item.controlName === ACAchCreateFromControl.NO_IDENTIFY) {
          item.formValidations = validationNoId;
        }
        });

        const noIdentifyControl = this.form.get(ACAchCreateFromControl.NO_IDENTIFY);
        noIdentifyControl?.setValidators([Validators.minLength(minLength), Validators.maxLength(maxLength), Validators.required, Validators.pattern(regexPattern)]);
        noIdentifyControl?.updateValueAndValidity();
        this.shosMaskTypeIdentifier(mask)

  }

  shosMaskTypeIdentifier(mask?: string){
    this.formLayout.attributes.forEach((item) => {
      if (item.controlName === ACAchCreateFromControl.TYPE_IDENTIFIER) {
        if (mask) {
          const selectedOptions: IDataLayoutSelect[] = [
            new DataLayoutSelectBuilder()
              // .label(mask)
              .value(mask)
              .build()
          ];
          item.layoutSelect = selectedOptions;
        } else {
          item.layoutSelect = [];
        }
      }
    });
  }

  manageSetDefaultValues() {
    const state = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);
    if (state?.formValues) return;

    const { account } = this.parameterManagement.getParameter<IAACHUpdateFormParameters>(PROTECTED_PARAMETER_STATE);
    const status = state.account.status !== undefined ? state.account.status : 'ACTIVA';
    const statusValue = status.slice(0,1).toLowerCase();

    this.form.patchValue({
      email: account.email,
      name: account.name,
      typeIdentifier: account.documentType,
      reason: 'PP03',
      status: statusValue,
      noIdentifier: account.clientId,
    });

    this.form.get(ACAchCreateFromControl.TYPE_IDENTIFIER)?.disable();
  }

  manageDataPersists() {
    const state = this.parameterManagement.getParameter<IAMACHHomeUpdateState>(PROTECTED_PARAMETER_STATE);
    if (!state?.formValues) return;

    this.form.patchValue(state.formValues);
    this.form.get(ACAchCreateFromControl.TYPE_IDENTIFIER)?.disable();
  }

  buildFormOptions() {
    const typeIdentificationOption = this.buildTypeIdentificationOptions();
    const reasonOption = this.buildReasonListOptions();

    this.selectOptions = [typeIdentificationOption, reasonOption];
  }

  buildReasonListOptions() {
    const reasonList = reasonListJson.map(reason => {
      const name = this.translate.instant(reason.name);

      return {
        name: `${reason.value} - ${name}`,
        value: reason.value + '',
      }
    });

    return {
      controlName: ACAchCreateFromControl.REASON,
      data: reasonList,
    } as IDataSelect;
  }

  buildTypeIdentificationOptions() {
    const identificationList = this.settings.general.listDocuments.map(document => {
      return {
        name: document.description,
        value: document.identificationId + '',
      }
    });

    return {
      controlName: ACAchCreateFromControl.TYPE_IDENTIFIER,
      data: identificationList,
    } as IDataSelect;
  }

  changeForm() {
    this.form.get(ACAchCreateFromControl.REASON)?.valueChanges.subscribe({
      next: (value) => {
        this.reasonSelected = reasonListJson.find(reason => reason.value === value);
      }
    });
  }

  previous() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: null,
      [PROTECTED_PARAMETER_ROUTE]: null,
    });


    this.router.navigate([AMAchUrlCollection.HOME]).finally(() => {});
  }

  nextStep() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.utils.showLoader();
    const { account } = this.parameterManagement.getParameter<IAACHUpdateFormParameters>(PROTECTED_PARAMETER_STATE);
    const documentTypeLabel = this.settings.general.listDocuments.find(doc => doc.identificationId === account.documentType);

    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        formValues: {
          ...this.form.value,
          typeIdentifier: account.documentType,
        },
        account,
        reasonSelected: this.reasonSelected,
        documentTypeLabel: documentTypeLabel?.description ?? '',
      } as IAMACHHomeUpdateState,
      [PROTECTED_PARAMETER_ROUTE]: AmACHRouteProtected.UPDATE_CONFIRM,
    });

    this.router.navigate([AMAchUrlCollection.UPDATE_CONFIRMATION]).finally(() => {});
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }


}
