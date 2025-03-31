import { Component, OnInit } from '@angular/core';
import {
  AdfFormBuilderService,
  FormValidationsBuilder,
  IDataSelect,
  ILayout,
  IPossibleValue, MaxLengthMessageHandlerBuilder,
  MinLengthMessageHandlerBuilder
} from '@adf/components';
import { FormGroup, Validators } from '@angular/forms';
import { AtdCrudManagerService } from '../../../../services/definition/crud/atd-crud-manager.service';
import { AttributeFormCrudAch, ECrudAchTypeClient } from '../../../../enum/ach-crud-control-name.enum';
import { Location } from '@angular/common';
import typeClientOptionsJson from '../../../../data/type-client-options.json';
import { ActivatedRoute, Router } from '@angular/router';
import { EACHCrudUrlNavigationCollection, EACHNavigationParameters } from '../../../../enum/navigation-parameter.enum';
import { IFlowError } from '../../../../../../../../models/error.interface';
import { IACHCurrencies, IACHSettings } from '../../../../interfaces/settings.interface';
import { Product } from '../../../../../../../../enums/product.enum';
import { TranslateService } from '@ngx-translate/core';
import { IACHBank } from '../../../../interfaces/crud/crud-create.interface';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { UtilService } from 'src/app/service/common/util.service';
import { ICrudACHStorageState } from '../../../../interfaces/crud/ICrudACHStorageState';

@Component({
  selector: 'byte-ach-create-form',
  templateUrl: './ach-create-form.component.html',
  styleUrls: ['./ach-create-form.component.scss'],
})

export class AchCreateFormComponent implements OnInit {
  formLayout!: ILayout;
  form!: FormGroup;
  optionsList: IDataSelect[] = [];
  settings: IACHSettings[] = [];
  bankSelected: IACHBank | null = null;

  typeAlert: string | null = null;
  messageAlert: string | null = null;

  currentTypeClient: ECrudAchTypeClient = ECrudAchTypeClient.NATURAL;
  typeAccount: IACHCurrencies[] = [];

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private crudManagerDefinition: AtdCrudManagerService,
    private adfFormDefinition: AdfFormBuilderService,
    private location: Location,
    private persistStepStateService: ParameterManagementService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private util: UtilService,
    private translate: TranslateService
  ) {
    const crudState: ICrudACHStorageState = this.persistStepStateService.getParameter('achCrudState');

    if (crudState && crudState?.typeClient) {
      this.currentTypeClient = crudState?.typeClient;
    }
  }
  ngOnInit(): void {
    this.initFormDefinition();
    this.savedCurrentState();
    this.getSelectOptions();
    this.util.hideLoader();
  }

  savedCurrentState() {
    const crudState: ICrudACHStorageState = this.persistStepStateService.getParameter('achCrudState');

    if (crudState && crudState?.formValues) {
      const { formValues } = crudState;

      this.form.patchValue({
        typeClient: formValues?.typeClient,
        alias: formValues?.alias,
        bankName: formValues?.bankName,
        numberAccount: formValues?.numberAccount,
        email: formValues?.email,
        name: formValues?.name,
      });

      of(true)
        .pipe(delay(400))
        .subscribe(() => {
          this.form.get(AttributeFormCrudAch.TYPE_ACCOUNT)?.setValue(formValues?.typeAccount);
        });

      of(true)
        .pipe(delay(500))
        .subscribe(() => {
          this.form.get(AttributeFormCrudAch.CURRENCY)?.setValue(formValues?.currency);
        });

      if (crudState?.typeClient === ECrudAchTypeClient.NATURAL) {
        this.form.get(AttributeFormCrudAch.IDENTIFY_BENEFICIARY)?.setValue(formValues?.identifyBeneficiary);
      } else if (crudState?.typeClient === ECrudAchTypeClient.LEGAL) {
        this.form.get(AttributeFormCrudAch.COMPANY_IDENTIFIER)?.setValue(formValues?.companyIdentifier);
      }
    }
  }

  nextStep() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.util.showLoader();
    this.persistStepStateService.sendParameters({
      achCrudState: {
        formValues: this.form.value,
        typeClient: this.currentTypeClient,
        bankSelected: this.bankSelected,
      } as ICrudACHStorageState,
    });

    this.saveNavigationProtectedParameter();

    this.router.navigate([EACHCrudUrlNavigationCollection.CREATE_VOUCHER]).finally(() => {
      this.util.hideLoader();
    });
  }

  lastStep() {
    this.location.back();
    this.resetStorage();
  }

  initFormDefinition() {
    switch (this.currentTypeClient) {
      case ECrudAchTypeClient.NATURAL:
        this.formDefinitionForNaturalClient();
        break;
      case ECrudAchTypeClient.LEGAL:
        this.formDefinitionForLegalClient();
        break;
      default:
        this.formDefinitionForNaturalClient();
        break;
    }
  }

  formDefinitionForNaturalClient() {
    this.formLayout = this.crudManagerDefinition.buildCreateFormForNaturalClient();
    this.form = this.adfFormDefinition.formDefinition(this.formLayout.attributes);
    this.form.get(AttributeFormCrudAch.TYPE_CLIENT)?.setValue(ECrudAchTypeClient.NATURAL);
    this.changeForm();
  }

  formDefinitionForLegalClient() {
    this.formLayout = this.crudManagerDefinition.buildCreateFormForLegalClient();
    this.form = this.adfFormDefinition.formDefinition(this.formLayout.attributes);
    this.form.get(AttributeFormCrudAch.TYPE_CLIENT)?.setValue(ECrudAchTypeClient.LEGAL);
    this.changeForm();
  }

  changeForm() {
    this.form.get(AttributeFormCrudAch.TYPE_CLIENT)?.valueChanges.subscribe((typeClient) => {
      if (this.currentTypeClient === typeClient) {
        return;
      }

      this.currentTypeClient = typeClient;
      this.initFormDefinition();
    });

    this.form.get(AttributeFormCrudAch.BANK_NAME)?.valueChanges.subscribe((bank) => {
      this.handleGetTypeAccountOptions(bank);
    });

    this.form.get(AttributeFormCrudAch.TYPE_ACCOUNT)?.valueChanges.subscribe((typeAccount) => {
      this.handleSetCurrencyOptions(typeAccount);
    });


    this.form.get(AttributeFormCrudAch.CURRENCY)?.valueChanges.subscribe(currency => {
      this.handleSetNumberAccountLimits(currency);
    });
  }

  getSelectOptions() {
    this.getTypeClient();
    this.getLisOfBank();
  }

  getLisOfBank() {
    const responseFromResolver = this.activatedRoute.snapshot.data['settings'];

    const bankDataSelect: IDataSelect = {
      controlName: AttributeFormCrudAch.BANK_NAME,
      data: [],
    };

    if (responseFromResolver.hasOwnProperty('error')) {
      this.showAlert('error', (responseFromResolver as IFlowError).message);
      this.optionsList = [...this.optionsList, { ...bankDataSelect }];
      return;
    }

    this.settings = responseFromResolver as IACHSettings[];

    const banks = this.settings.map((item) => {
      return {
        value: `${item?.id}`,
        name: item?.name,
      } as IPossibleValue;
    });

    this.optionsList = [...this.optionsList, { ...bankDataSelect, data: banks }];
  }

  getTypeClient() {
    const typeClientDataSelect: IDataSelect = {
      controlName: AttributeFormCrudAch.TYPE_CLIENT,
      data: typeClientOptionsJson,
    };

    const typeAccountDataSelect: IDataSelect = {
      controlName: AttributeFormCrudAch.TYPE_ACCOUNT,
      data: [],
    };

    const currencyDataSelect: IDataSelect = {
      controlName: AttributeFormCrudAch.CURRENCY,
      data: [],
    };

    this.optionsList = [...this.optionsList, { ...typeClientDataSelect }, currencyDataSelect, typeAccountDataSelect];
  }

  private handleSetNumberAccountLimits(currency: string) {
    if (!currency || !this.typeAccount) return;

    const limitFound = this.typeAccount.find((item) => item.toCurrency === currency);

    if (!limitFound) return;

    const messageMinLengthBuilder = new MinLengthMessageHandlerBuilder()
      .label(this.translate.instant('error:ach_account_min_length', {
        number: limitFound.length.min,
      }))
      .build();

    const maxMinLengthBuilder = new MaxLengthMessageHandlerBuilder()
      .label(this.translate.instant('error:ach_account_max_length', {
        number: limitFound.length.max,
      }))
      .build();


    const validationNumberAccount = new FormValidationsBuilder()
      .required(true)
      .maxLength(limitFound.length.max)
      .minLength(limitFound.length.min)
      .validationMessageHandlerList([messageMinLengthBuilder, maxMinLengthBuilder])
      .build();

    this.formLayout.attributes.forEach((item) => {
      if (item.controlName === AttributeFormCrudAch.NUMBER_ACCOUNT) {
        item.formValidations = validationNumberAccount;
      }
    });

    const numberAccountControl = this.form.get(AttributeFormCrudAch.NUMBER_ACCOUNT);
    numberAccountControl?.setValidators([Validators.minLength(limitFound.length.min), Validators.maxLength(limitFound.length.max), Validators.required]);
    numberAccountControl?.updateValueAndValidity();
  }

  private handleGetTypeAccountOptions(bank: string) {
    const bankFounded = this.settings.find((item) => item.id === Number(bank));
    this.form.get(AttributeFormCrudAch.CURRENCY)?.setValue('');
    this.form.get(AttributeFormCrudAch.TYPE_ACCOUNT)?.setValue('');

    if (!bankFounded) {
      this.setCustomOptionList(AttributeFormCrudAch.TYPE_ACCOUNT, []);
      return;
    }

    this.bankSelected = bankFounded;

    const products: IPossibleValue[] = Object.keys(bankFounded.toAccounts).map((key) => ({
      name: this.util.getLabelProduct(Number(Product[key])),
      value: key,
    }));

    products.unshift({
      name: this.translate.instant('select_of_type'),
      value: '',
    });

    this.setCustomOptionList(AttributeFormCrudAch.TYPE_ACCOUNT, products);
  }

  private handleSetCurrencyOptions(typeAccount: string) {
    const currencyFounded = this.bankSelected?.toAccounts[typeAccount] ?? null;
    this.form.get(AttributeFormCrudAch.CURRENCY)?.setValue('');

    if (!currencyFounded) {
      this.setCustomOptionList(AttributeFormCrudAch.CURRENCY, []);
      return;
    }

    this.typeAccount = currencyFounded;


    const currencies: IPossibleValue[] = currencyFounded.map((item) => ({
      name: this.util.getLabelCurrency(item?.toCurrency ?? 'UNDEFINED'),
      value: item?.toCurrency ?? 'UNDEFINED',
    }));

    currencies.unshift({
      name: this.translate.instant('select_currency'),
      value: '',
    });

    this.setCustomOptionList(AttributeFormCrudAch.CURRENCY, currencies);
  }

  setCustomOptionList(controlName: string, options: IPossibleValue[]) {
    this.optionsList.forEach((option) => {
      if (option.controlName === controlName) {
        option.data = options;
      }
    });
  }

  saveNavigationProtectedParameter() {
    this.persistStepStateService.sendParameters({
      navigationProtectedParameter: EACHNavigationParameters.CRUD_CREATE_VOUCHER,
    });
  }

  resetStorage() {
    this.persistStepStateService.sendParameters({
      navigationProtectedParameter: null,
      achCrudState: null,
    });
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }
}
