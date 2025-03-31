import { Component, OnInit } from '@angular/core';
import { AdfFormBuilderService, DataLayoutSelectBuilder, FormValidationsBuilder, IDataLayoutSelect, IDataSelect, ILayout, IPossibleValue, MaxLengthMessageHandlerBuilder, MinLengthMessageHandlerBuilder, RegexMessageHandlerBuilder, RequiredMessageHandlerBuilder } from '@adf/components';
import { FormGroup, Validators } from '@angular/forms';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../../enums/common-value.enum';
import { UtilService } from '../../../../../../../service/common/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../../service/navegation-parameters/parameter-management.service';
import { AMAchUrlCollection } from '../../../enum/url-collection.enum';
import { AmdAchCreateFormService } from '../../../services/definition/amd-ach-create-form.service';
import { IFlowError } from '../../../../../../../models/error.interface';
import {
  BisvGeneralParameters,
  IACHBiesGeneralParameterBank,
  IACHBiesGeneralParameterCurrency, IACHBiesGeneralParameterListDocument, IACHBiesGeneralParameterProduct,
  IACHBiesGeneralParameterRoute,
  IACHBiesGeneralParameters
} from '../../../../../../../models/ach-general-parameters.interface';
import { ACAchCreateFromControl } from '../../../enum/form-control.enum';
import typeClientJson from '../../../../../data/type-client.json';
import reasonListJson from '../../../../../data/reason-list.json';
import { TranslateService } from '@ngx-translate/core';
import { IAMACHHomeSTate } from '../../../interfaces/state.interface';
import { AmACHRouteProtected } from '../../../enum/route-protected.enum';

@Component({
  selector: 'byte-am-ach-create',
  templateUrl: './am-ach-create.component.html',
  styleUrls: ['./am-ach-create.component.scss']
})
export class AmAchCreateComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  formLayout!: ILayout;
  form!: FormGroup;
  selectOptions: IDataSelect[] = [];

  settings!: IACHBiesGeneralParameters;

  currencySelected: IACHBiesGeneralParameterRoute | undefined = undefined;
  productSelected: IACHBiesGeneralParameterProduct | undefined = undefined;
  bankSelected: IACHBiesGeneralParameterBank | undefined = undefined;
  typeClientSelected: any = undefined;
  documentIdentificationSelected: IACHBiesGeneralParameterListDocument | undefined = undefined;
  reasonSelected: any = undefined;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private utils: UtilService,
    private router: Router,
    private parameterManagement: ParameterManagementService,
    private adfFormBuilderService: AdfFormBuilderService,
    private activatedRouter: ActivatedRoute,
    private formDefinition: AmdAchCreateFormService,
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
    console.log('generalParametersResponse: ', generalParametersResponse);
    if (generalParametersResponse.hasOwnProperty('error')) {
      this.settings = new BisvGeneralParameters().build();
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
  }

  buildFormOptions() {
    const bankOption = this.buildBankOptions();
    const productOption = this.buildTypeAccountOptions();
    const currencyOption = this.buildCurrencyOptions();
    const typeIdentificationOption = this.buildTypeIdentificationOptions();
    const typeClientOption = this.buildTypeClientOptions();
    const reasonOption = this.buildReasonListOptions();

    this.selectOptions = [bankOption, productOption, currencyOption, typeIdentificationOption, typeClientOption, reasonOption];
  }

  buildBankOptions() {
    const bankOptions = this.settings.banks.map(bank => {
      return {
        name: bank.description,
        value: bank.code + '',
      }
    });

    return {
      controlName: ACAchCreateFromControl.BANK,
      data: bankOptions,
    } as IDataSelect;
  }

  buildTypeAccountOptions() {
    const productList = this.settings.products.map(product => {
      return {
        name: product.description,
        value: product.code + '',
      }
    });

    return {
      controlName: ACAchCreateFromControl.TYPE_ACCOUNT,
      data: productList,
    } as IDataSelect;
  }

  buildCurrencyOptions() {
    const currencyList = this.settings.currencies.map(currency => {
      return {
        name: currency.name,
        value: currency.code + '',
      }
    });

    return {
      controlName: ACAchCreateFromControl.CURRENCY,
      data: currencyList,
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
      data: [],
    } as IDataSelect;
  }

  buildTypeClientOptions() {
    const typeClientList = typeClientJson.map(client => {
      return {
        name: client.name,
        value: client.value + '',
      }
    });

    return {
      controlName: ACAchCreateFromControl.TYPE_CUSTOMER,
      data: typeClientList,
    } as IDataSelect;
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

  changeForm() {
    this.form.get(ACAchCreateFromControl.TYPE_CUSTOMER)?.valueChanges.subscribe({
      next: (value: string) => {
        this.typeClientSelected = typeClientJson.find(client => client.value === value);
        this.setDocumentsIdForClientType(this.typeClientSelected);
      }
    });

    this.form.get(ACAchCreateFromControl.BANK)?.valueChanges.subscribe({
      next: (value) => {
        this.bankSelected = this.settings.banks.find(bank => bank.code === value);
        this.setProductsForBank(this.bankSelected);
        this.setCurrencyForBank(this.bankSelected);

        this.form.get(ACAchCreateFromControl.ACCOUNT)?.reset();
      }
    });

    this.form.get(ACAchCreateFromControl.TYPE_ACCOUNT)?.valueChanges.subscribe({
      next: (value: string) => {
        this.productSelected = this.settings.products.find(product => product.code === +value);
        this.form.get(ACAchCreateFromControl.ACCOUNT)?.reset();
        this.setValidatorAccount(this.productSelected, this.bankSelected);
      }
    });

    this.form.get(ACAchCreateFromControl.CURRENCY)?.valueChanges.subscribe({
      next: (value: string) => {
        if(!this.bankSelected){ return; }
        this.currencySelected = this.bankSelected?.routes.find(currency => currency.code === value);
      }
    });

    this.form.get(ACAchCreateFromControl.TYPE_IDENTIFIER)?.valueChanges.subscribe({
      next: (value: string) => {

        this.documentIdentificationSelected = this.settings.general.listDocuments.find(document => document.identificationId === value);
        const mask = this.documentIdentificationSelected?.mask;

        this.setValidatorMaskNoIdentify(this.documentIdentificationSelected);
        this.shosMaskTypeIdentifier(mask);
      }
    });

    this.form.get(ACAchCreateFromControl.REASON)?.valueChanges.subscribe({
      next: (value) => {
        this.reasonSelected = reasonListJson.find(reason => reason.value === value);
      }
    });
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

  }

  setDocumentsIdForClientType(clientType: { name: string; value: string }){

    if (!clientType) return;
    const documentsIdGeneral = this.settings.general.listDocuments ?? [];

    const filteredDocuments = clientType.value === 'J'
    ? documentsIdGeneral.filter(document => document.identificationId === 'N')
    : documentsIdGeneral.filter(document => document.identificationId !== 'N');

    const possibleValues: IPossibleValue[] = filteredDocuments.map(documentId => ({
      name: documentId.description || '',
      value: documentId.identificationId.toString()
    }));

    if (possibleValues.length === 0) {
      possibleValues.unshift({ name: 'label_select_and_option', value: '' });
      possibleValues.push({ name: 'no_options_available', value: '' });
    } else {
      possibleValues.unshift({ name: 'label_select_and_option', value: '' });
    }

    this.setCustomOptionList(ACAchCreateFromControl.TYPE_IDENTIFIER, possibleValues);

  }

  setCurrencyForBank(bank: IACHBiesGeneralParameterBank | undefined){
    if(!bank){ return; }
    const currenciesGeneral = this.settings.currencies ?? [];
    const currenciesForBank = bank.routes ?? [];
    const possibleValues: IPossibleValue[] = currenciesForBank.map(currencyForBank => {
      return {
        name: currencyForBank.currency || '',
        value: currencyForBank.code.toString()
      };
    });

    if (possibleValues.length === 0) {
      possibleValues.unshift({ name: 'label_select_and_option', value: '' });
      possibleValues.push({ name: 'no_options_available', value: '' });
    } else {
      possibleValues.unshift({ name: 'label_select_and_option', value: '' });
    }
    this.setCustomOptionList(ACAchCreateFromControl.CURRENCY, possibleValues);
  }


  setProductsForBank(bank: IACHBiesGeneralParameterBank | undefined){
    if(!bank){ return; }
    const productsGeneral = this.settings.products ?? [];
    const productsForBank = bank.products ?? [];

    const possibleValues: IPossibleValue[] = productsForBank.map(productForBank => {
      const matchingProduct = productsGeneral.find(product => product.code === productForBank.code);
      return {
        name: matchingProduct?.description || '',
        value: productForBank.code.toString()
      };
    });

    if (possibleValues.length === 0) {
      possibleValues.unshift({ name: 'label_select_and_option', value: '' });
      possibleValues.push({ name: 'no_options_available', value: '' });
    } else {
      possibleValues.unshift({ name: 'label_select_and_option', value: '' });
    }


    this.setCustomOptionList(ACAchCreateFromControl.TYPE_ACCOUNT, possibleValues);
  }

  setValidatorAccount(product: IACHBiesGeneralParameterProduct | undefined, bank: IACHBiesGeneralParameterBank | undefined){
    console.log('bank: ', bank);
    const productsForBank = bank?.products;
    const productSelect = productsForBank?.find((productBank) => productBank.code === product?.code);
    const minLength: number = productSelect?.lowerAccountLimit ?? 0;
    const maxLength: number = productSelect?.maxAccountLimit ?? 0;

    const requiredMessage = new RequiredMessageHandlerBuilder()
    .label('admin-ach:field_required')
    .build();

    const messageMinLengthBuilder = new MinLengthMessageHandlerBuilder()
    .label(this.translate.instant('admin-ach:error_min_length', {
      min: minLength,
    }))
    .build();

    const maxMinLengthBuilder = new MaxLengthMessageHandlerBuilder()
      .label(this.translate.instant('admin-ach:error_max_length', {
        max: maxLength,
      }))
      .build();

    const regex: string = (bank?.isAccountUseAccountAlphanumeric === 'S') ? "^[a-zA-Z0-9]*$" : "^[0-9]*$"

    const validationNumberAccount = new FormValidationsBuilder()
      .required(true)
      .maxLength(maxLength)
      .minLength(minLength)
      .validationMessageHandlerList([messageMinLengthBuilder, maxMinLengthBuilder, requiredMessage])
      .build();

      this.formLayout.attributes.forEach((item) => {
        if (item.controlName === ACAchCreateFromControl.ACCOUNT) {
          if(bank?.isAccountUseAccountAlphanumeric === 'S'){
            item.imaskOptions = { mask: /^[a-zA-Z0-9]*$/ }
          }else{
            item.imaskOptions = { mask: '00000000000000000' }

          }


          item.formValidations = validationNumberAccount;
        }
        });

        const numberAccountControl = this.form.get(ACAchCreateFromControl.ACCOUNT);
        numberAccountControl?.setValidators([Validators.minLength(minLength), Validators.maxLength(maxLength), Validators.required]);
        numberAccountControl?.updateValueAndValidity();

  }

  setCustomOptionList(controlName: string, options: IPossibleValue[]) {
    this.selectOptions.forEach((option) => {
      if (option.controlName === controlName) {
         option.data = options;
      }
    });
  }

  previous() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: undefined,
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
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        formValues: this.form.value,
        currencySelected: this.currencySelected,
        productSelected: this.productSelected,
        bankSelected: this.bankSelected,
        typeClientSelected: this.typeClientSelected,
        documentIdentificationSelected: this.documentIdentificationSelected,
        reasonSelected: this.reasonSelected,
      } as IAMACHHomeSTate,
      [PROTECTED_PARAMETER_ROUTE]: AmACHRouteProtected.CREATE_CONFIRM,
    });

    this.router.navigate([AMAchUrlCollection.CREATE_CONFIRMATION]).finally(() => {});
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

}
