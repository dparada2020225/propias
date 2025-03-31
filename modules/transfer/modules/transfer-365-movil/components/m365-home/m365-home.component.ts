import { Component, OnInit } from '@angular/core';
import {
  AdfFormBuilderService,
  DataLayoutSelectBuilder,
  IDataLayoutSelect,
  IDataSelect,
  ILayout,
  IPossibleValue
} from '@adf/components';
import { FormControl, FormGroup } from '@angular/forms';
import { UtilService } from '../../../../../../service/common/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  OtdTransferBaseHomeService
} from '../../../transfer-own/services/definition/base/otd-transfer-base-home.service';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { M365FormService } from '../../services/definition/m365-form.service';
import { EM365FormControlName, EM365TypeLoadBeneficiary } from '../../enum/form-control.enum';
import { IAccount } from '../../../../../../models/account.inteface';
import { IFlowError } from '../../../../../../models/error.interface';
import beneficiariesListJson from '../../data/beneficiaries-list-option.json';
import { TranslateService } from '@ngx-translate/core';
import { M365StateHome, M365StDetail } from '../../interfaces/state.interface';
import { EM365UrlCollection } from '../../enum/url-collection.enum';
import {
  AM365Account,
  AM365AccountList
} from '../../../../../accounts-management/modules/t365-movil/interfaces/associated-account.interface';
import {
  BisvGeneralParameters,
  IACHBiesGeneralParameterBank
} from '../../../../../../models/ach-general-parameters.interface';
import { S365RouteProtected } from '../../enum/route-protected.enum';
import { Ttr365UtilsService } from '../../../../services/utils/ttr-365-utils.service';
import {
  AchUniTransferUrlNavigationCollection
} from '../../../transfer-ach-uni/enums/ach-uni-navigation-parameter.enum';
import { MT365View } from '../../enum/view.enum';
import {
  ESignatureTrackingUrlFlow
} from '../../../../../transaction-manager/modules/signature-tracking/enum/st-navigate-enum';

@Component({
  selector: 'byte-m365-home',
  templateUrl: './m365-home.component.html',
  styleUrls: ['./m365-home.component.scss']
})
export class M365HomeComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  formLayout!: ILayout;
  form!: FormGroup;
  selectOptions: IDataSelect[] = [];

  formTypeLoadLayout!: ILayout;
  formTypeLoad!: FormGroup;
  selectTypeLoadOptions: IDataSelect[] = [];

  settings = new BisvGeneralParameters().build();
  sourceAccountList: Array<IAccount> = [];
  beneficiaryRegisteredList: AM365AccountList = [];

  bankFormOptions: Array<IPossibleValue> = [];

  sourceAccountSelected: IAccount | undefined = undefined;
  bankSettingSelected: IACHBiesGeneralParameterBank | undefined = undefined;
  beneficiarySelected: AM365Account | undefined = undefined;

  bankValueSelect: string = '';
  isShowBankField: boolean = false;
  typeLoadBeneficiary: EM365TypeLoadBeneficiary | undefined = undefined;

  TRANSFER_LIMIT_BY_USER = 0;

  view: MT365View = MT365View.DEFAULT;

  title = 'ach:bisv:label_home';
  subTitle = '';

  get isShowEnteredForm() {
    if (!this.typeLoadBeneficiary) return false;

    return this.typeLoadBeneficiary === EM365TypeLoadBeneficiary.ENTERED;
  }

  get isShowRegisteredForm() {
    if (!this.typeLoadBeneficiary) return false;

    return this.typeLoadBeneficiary === EM365TypeLoadBeneficiary.REGISTERED;
  }

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get bankValueControl() {
    return this.form.get(EM365FormControlName.BANK) as FormControl;
  }

  get isShowNextButton() {
    return this.form.get(EM365FormControlName.SOURCE_ACCOUNT)?.value;
  }


  constructor(
    private utils: UtilService,
    private router: Router,
    private translate: TranslateService,
    private formDefinitionService: M365FormService,
    private adfFormBuilderService: AdfFormBuilderService,
    private activatedRouter: ActivatedRoute,
    private ownTransferBaseUtil: OtdTransferBaseHomeService,
    private parameterManagement: ParameterManagementService,
    private ttr365Utils: Ttr365UtilsService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initState();
    this.initFormDefinition();
    this.utils.hideLoader();
  }

  initState() {
    this.view = this.activatedRoute.snapshot.data['view'];

    if (this.view === MT365View.ST_MODIFY) {
      this.title = 'signature_tracking_label';
      this.subTitle = 'edit_transaction';
    }

    this.getSourceAccountList();
    this.getGeneralParameters();
    this.getBeneficiaryRegisteredList();
    this.getLimitByUser();
  }

  getSourceAccountList() {
    const sourceAccountListResponse = this.activatedRouter.snapshot.data['sourceAccountList'];

    if (sourceAccountListResponse.hasOwnProperty('error')) {
      this.showAlert('error', (sourceAccountListResponse as IFlowError).message);
      return;
    }

    this.sourceAccountList = sourceAccountListResponse;
  }

  getGeneralParameters() {
    const settingResponse = this.activatedRouter.snapshot.data['settings'];

    if (settingResponse.hasOwnProperty('error')) {
      this.showAlert('error', (settingResponse as IFlowError).message);
      return;
    }

    this.settings = settingResponse;
  }

  getLimitByUser() {
    const limitByUserResponse = this.activatedRouter.snapshot.data['getLimitUser'];

    if (limitByUserResponse.hasOwnProperty('error')) {
      this.showAlert('error', (limitByUserResponse as IFlowError).message);
      return;
    }

    this.TRANSFER_LIMIT_BY_USER = limitByUserResponse?.amount ?? 0;
  }

  getBeneficiaryRegisteredList() {
    const beneficiaryRegisteredResponse = this.activatedRouter.snapshot.data['beneficiaryRegistered'];

    if (beneficiaryRegisteredResponse.hasOwnProperty('error')) {
      this.showAlert('error', (beneficiaryRegisteredResponse as IFlowError).message);
      return;
    }

    this.beneficiaryRegisteredList = beneficiaryRegisteredResponse;
  }

  initFormDefinition() {
    this.formLayout = this.formDefinitionService.buildTransactionFormLayoutDefinition();
    this.form = this.adfFormBuilderService.formDefinition(this.formLayout.attributes);
    this.buildFormOptions();
    this.manageDataPersistence();
    this.setDefaultValuesForStUpdate();
    this.changeForm();
  }

  manageDataPersistence() {
    const state = this.parameterManagement.getParameter<M365StateHome>(PROTECTED_PARAMETER_STATE);

    if (!state?.baseFormValues) return;
    this.form.patchValue(state.baseFormValues);
    this.bankValueSelect = state.baseFormValues.bank;
  }

  manageFormExtendedDataPersistence() {
    const state = this.parameterManagement.getParameter<M365StateHome>(PROTECTED_PARAMETER_STATE);

    if (!this.form || !state.formValues) return;

    this.formTypeLoad.patchValue(state.formValues);
    setTimeout(() => {
      this.formTypeLoad.get(EM365FormControlName.NUMBER_PHONE)?.reset(state.formValues.numberPhone);
    },  100);
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
      controlName: EM365FormControlName.SOURCE_ACCOUNT,
      data: options,
    }
  }

  buildOptionsForBeneficiaries() {
    const options = beneficiariesListJson.map(account => {
      return {
        name: this.translate.instant(account.name).toUpperCase(),
        value: account.value,
      }
    });

    return {
      controlName: EM365FormControlName.BENEFICIARY,
      data: options,
    }
  }

  buildOptionsForBankField() {
    const bankAvailable = this.settings.banks.filter(bank => bank.participant[2] === 'S');
    const options = bankAvailable.map(setting => {
      return {
        name: setting.description,
        value: `${setting.code}`,
      }
    });

    options.unshift({
      name: 'label_select_and_option',
      value: '',
    })

    return {
      controlName: EM365FormControlName.BANK,
      data: options,
    }
  }

  buildOptionsForBeneficiaryRegistered(bankSettingSelected: IACHBiesGeneralParameterBank, showFavorites = false) {
    if (!bankSettingSelected) return;

    const accountFiltered = this.beneficiaryRegisteredList.filter(account => +account.bank === +bankSettingSelected.code);
    const accountFilteredFavoritesOnly = this.beneficiaryRegisteredList
      .filter(account => +account.bank === +bankSettingSelected.code)
      .filter(account => account.favorite);

    const accountToUse = showFavorites ? accountFilteredFavoritesOnly : accountFiltered;

    if (accountToUse.length <= 0) {
      this.beneficiarySelected = undefined;
      this.handleChangeNumberPhone('');
    }

    const options = accountToUse.map(setting => {
      return {
        name: setting.name,
        value: `${setting.account}`,
      }
    });

    options.unshift({
      name: 'label_select_and_option',
      value: '',
    });


    this.addTargetAccountOptions(options);
    this.resetTargetAccountOptions(options);
  }

  resetTargetAccountOptions(data: Array<IPossibleValue>) {
    this.selectTypeLoadOptions = this.selectTypeLoadOptions.map(value => {
      if (value.controlName === EM365FormControlName.NUMBER_PHONE) {
        return {
          ...value,
          data,
        }
      }

      return value;
    });
  }

  addTargetAccountOptions(data: Array<IPossibleValue>) {
    const isIncludeTargetAccountOptions = this.selectTypeLoadOptions.some(value => value.controlName === EM365FormControlName.NUMBER_PHONE);

    if (isIncludeTargetAccountOptions) return;

    const option =  {
      controlName: EM365FormControlName.NUMBER_PHONE,
      data: data,
    }

    this.selectTypeLoadOptions = [...this.selectTypeLoadOptions, option];
  }

  buildFormOptions() {
    const sourceAccountOptions = this.buildOptionsForSourceAccount();
    const bankOptions = this.buildOptionsForBankField();
    const beneficiaryOptions = this.buildOptionsForBeneficiaries();

    this.selectOptions = [sourceAccountOptions, beneficiaryOptions];
    this.bankFormOptions = bankOptions.data;
  }

  changeForm() {
    this.form.get(EM365FormControlName.SOURCE_ACCOUNT)?.valueChanges.subscribe({
      next: (value) => this.handleChangeSourceAccount(value),
    });

    this.form.get(EM365FormControlName.BENEFICIARY)?.valueChanges.subscribe({
      next: (value) => this.handleChangeBeneficiary(value),
    });

    this.form.get(EM365FormControlName.BANK)?.valueChanges.subscribe({
      next: (value) => {
        this.handleChangeBankSelected(value);
      }
    });
  }

  changeFormTypeLoad() {
    this.manageChangeBeneficiaryRegistered();
  }

  manageChangeBeneficiaryRegistered() {
    if (this.typeLoadBeneficiary === EM365TypeLoadBeneficiary.ENTERED) return;

    this.beneficiarySelected = undefined;
    this.formTypeLoad.get(EM365FormControlName.NUMBER_PHONE)?.valueChanges.subscribe({
      next: (value) => this.handleChangeNumberPhone(value),
    });

    this.formTypeLoad.get(EM365FormControlName.IS_SHOW_FAVORITES)?.valueChanges.subscribe({
      next: (value) => this.handleChangeShowFavoriteOption(value),
    });
  }

  handleChangeShowFavoriteOption(value: boolean) {
    this.beneficiarySelected = undefined;
    this.formTypeLoad.get(EM365FormControlName.NUMBER_PHONE)?.reset('');
    this.buildOptionsForBeneficiaryRegistered(this.bankSettingSelected as IACHBiesGeneralParameterBank, value);
    this.handleChangeNumberPhone('');
  }

  handleChangeSourceAccount(value: string) {
    const selectedAccount = this.sourceAccountList.find((accountTemp) => accountTemp.account === value);

    if (!selectedAccount) {
      this.sourceAccountSelected = undefined;
      this.formLayout.attributes.forEach((attribute) => {
        if (attribute.controlName === EM365FormControlName.SOURCE_ACCOUNT) {
          attribute.layoutSelect = [];
        }
      });
      return;
    }

    this.sourceAccountSelected = selectedAccount;
    this.formLayout.attributes.forEach((attribute) => {
      if (attribute.controlName === EM365FormControlName.SOURCE_ACCOUNT) {
        attribute.layoutSelect = this.ownTransferBaseUtil.buildDebitedAccountSelectAttributes(selectedAccount);
      }
    });
  }

  handleChangeBankSelected(value: string) {
    this.bankSettingSelected = this.settings.banks.find((setting) => String(setting.code) === value);
    this.beneficiarySelected = undefined;
    this.handleChangeNumberPhone('');
    this.formTypeLoad.get(EM365FormControlName.NUMBER_PHONE)?.reset('');

    if (!this.bankSettingSelected) {
      this.resetTargetAccountOptions([]);
      return;
    }


    const isFavorite = this.formTypeLoad.get(EM365FormControlName.IS_SHOW_FAVORITES)?.value || false;
    this.buildOptionsForBeneficiaryRegistered(this.bankSettingSelected, isFavorite);
  }

  handleChangeNumberPhone(value: string) {
    const selectedAccount = this.beneficiaryRegisteredList.find(beneficiary => beneficiary.account === value);
    if (!selectedAccount) {
      this.beneficiarySelected = undefined;
      this.formTypeLoadLayout.attributes.forEach((attribute) => {
        if (attribute.controlName === EM365FormControlName.NUMBER_PHONE) {
          attribute.layoutSelect = []
        }
      });
      return;
    }

    this.beneficiarySelected = selectedAccount;
    this.formTypeLoadLayout.attributes.forEach((attribute) => {
      if (attribute.controlName === EM365FormControlName.NUMBER_PHONE) {
        attribute.layoutSelect = this.buildNumberPhoneSelectAttributes(selectedAccount);
      }
    });
  }

  handleChangeBeneficiary(value: string) {
    const state = this.parameterManagement.getParameter<M365StateHome>(PROTECTED_PARAMETER_STATE);
    this.hideAlert();
    if (this.formTypeLoadLayout && this.typeLoadBeneficiary !== value && state) {
      this.formTypeLoad.reset();
      const { formValues, ...state } = this.parameterManagement.getParameter<M365StateHome>(PROTECTED_PARAMETER_STATE);
      this.parameterManagement.sendParameters({
        [PROTECTED_PARAMETER_STATE]: {
          ...state,
          formValues: {},
        }
      });
    }


    this.isShowBankField = !!value;
    this.typeLoadBeneficiary = value as EM365TypeLoadBeneficiary;

    if (this.isShowRegisteredForm) {
      this.formTypeLoadLayout = this.formDefinitionService.buildAttributesForRegisteredOption();
      this.formTypeLoad = this.adfFormBuilderService.formDefinition(this.formTypeLoadLayout.attributes);
    }

    if (this.isShowEnteredForm) {
      this.formTypeLoadLayout = this.formDefinitionService.buildAttributesForEnteredOption();
      this.formTypeLoad = this.adfFormBuilderService.formDefinition(this.formTypeLoadLayout.attributes);
    }


    this.manageFormExtendedDataPersistence();
    this.changeFormTypeLoad();
  }

  buildNumberPhoneSelectAttributes(account: AM365Account): IDataLayoutSelect[] {
    const attributeList: IDataLayoutSelect[] = [];

    const attributeProductName = new DataLayoutSelectBuilder()
      .label('m365:label_name_beneficiary:')
      .value(account.name)
      .build();

    const attributeIdentification = new DataLayoutSelectBuilder()
      .label('m365:label_email:')
      .class('email-registered')
      .value(account.email)
      .build();

    attributeList.push(attributeProductName);
    attributeList.push(attributeIdentification);

    return attributeList;
  }

  previous() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: null,
      [PROTECTED_PARAMETER_ROUTE]: null,
    });

    if (this.view === MT365View.DEFAULT) {
      this.router.navigate([AchUniTransferUrlNavigationCollection.HOME]).finally(() => {});
      return;
    }

    this.router.navigate([ESignatureTrackingUrlFlow.HOME]).finally(() => {});
  }

  nextStep() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.showAlert('error', 'm365:label_verify_amount');
      this.utils.scrollToTop();
      return;
    }

    if (this.formTypeLoad && !this.formTypeLoad.valid) {
      this.formTypeLoad.markAllAsTouched();
      return;
    }

    const amount = this.formTypeLoad.get(EM365FormControlName.AMOUNT)?.value;
    const { isValid, message } = this.ttr365Utils.getIsAmountValidByLimits({
      amount,
      currencies: this.settings.currencies,
      limitByUser: this.TRANSFER_LIMIT_BY_USER,
      currency: this.sourceAccountSelected!.currency,
      isT365MovilValidation: true,
      availableAmountInSourceAccount: this.sourceAccountSelected?.availableAmount ?? 0,
    });

    if (!isValid) {
      this.utils.scrollToTop();
      this.showAlert('warning', message ?? '');
      return;
    }

    this.manageNavigateToConfirmationTransaction();
  }

  manageNavigateToConfirmationTransaction() {
    if (this.view === MT365View.DEFAULT) {
      this.manageNavigateToDefaultTransaction();
      return;
    }

    this.manageNavigateToStUpdate();
  }

  manageNavigateToDefaultTransaction() {
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        formValues: this.formTypeLoad.value,
        sourceAccountSelected: this.sourceAccountSelected,
        bankSettingSelected: this.bankSettingSelected,
        typeLoadBeneficiary: this.typeLoadBeneficiary,
        beneficiarySelected: this.beneficiarySelected,
        baseFormValues: this.form.value,
      } as M365StateHome,
      [PROTECTED_PARAMETER_ROUTE]: S365RouteProtected.CONFIRMATION,
    });

    this.utils.showLoader();
    this.router.navigate([EM365UrlCollection.CONFIRMATION]).finally(() => {});
  }

  manageNavigateToStUpdate() {
    const { transactionSelected, transactionManagerDetail, position } = this.parameterManagement.getParameter<M365StDetail>(PROTECTED_PARAMETER_STATE);

    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        formValues: this.formTypeLoad.value,
        sourceAccountSelected: this.sourceAccountSelected,
        bankSettingSelected: this.bankSettingSelected,
        typeLoadBeneficiary: this.typeLoadBeneficiary,
        beneficiarySelected: this.beneficiarySelected,
        baseFormValues: this.form.value,
        transactionSelected,
        transactionManagerDetail,
        position,
      } as M365StateHome,
      [PROTECTED_PARAMETER_ROUTE]: S365RouteProtected.ST_MODIFY_CONFIRM,
    });

    this.utils.showLoader();
    this.router.navigate([EM365UrlCollection.ST_MODIFY_CONFIRM]).finally(() => {});
  }

  setDefaultValuesForStUpdate() {
    const { sourceAccountSelected, formValues } = this.parameterManagement.getParameter<M365StDetail>(PROTECTED_PARAMETER_STATE);

    const isFoundSourceAccount = this.utils.findSourceAccount(sourceAccountSelected.account, this.sourceAccountList);

    if (isFoundSourceAccount && !formValues) {
      this.form.get(EM365FormControlName.SOURCE_ACCOUNT)?.setValue(sourceAccountSelected.account);
    }
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
