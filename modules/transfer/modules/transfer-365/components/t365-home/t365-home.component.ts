import { Component, OnInit } from '@angular/core';
import {
  AdfFormBuilderService,
  DataLayoutSelectBuilder,
  IDataLayoutSelect,
  IDataSelect,
  ILayout, IPossibleValue
} from '@adf/components';
import { FormGroup } from '@angular/forms';
import { UtilService } from '../../../../../../service/common/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { T365dFormService } from '../../services/definition/t365d-form.service';
import { IAccount } from '../../../../../../models/account.inteface';
import { V3IAchAccount } from '../../../transfer-ach/interfaces/ach-account-interface';
import { IFlowError } from '../../../../../../models/error.interface';
import { ET365FormControlName } from '../../enum/form-control.enum';
import {
  OtdTransferBaseHomeService
} from '../../../transfer-own/services/definition/base/otd-transfer-base-home.service';
import { Product } from '../../../../../../enums/product.enum';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { I365HomeState } from '../../interfaces/state.interface';
import { E365UrlCollection } from '../../enum/url-collection.enum';
import {
  BisvGeneralParameters,
  IACHBiesGeneralParameterBank,
} from '../../../../../../models/ach-general-parameters.interface';
import { distinctUntilChanged } from 'rxjs/operators';
import { T365RouteProtected } from '../../enum/route-protected.enum';
import { Ttr365UtilsService } from '../../../../services/utils/ttr-365-utils.service';
import {
  AchUniTransferUrlNavigationCollection
} from '../../../transfer-ach-uni/enums/ach-uni-navigation-parameter.enum';

@Component({
  selector: 'byte-t365-home',
  templateUrl: './t365-home.component.html',
  styleUrls: ['./t365-home.component.scss']
})
export class T365HomeComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  formLayout!: ILayout;
  form!: FormGroup;
  selectOptions: IDataSelect[] = [];

  settings = new BisvGeneralParameters().build();
  sourceAccountList: Array<IAccount> = [];
  targetAccountList: Array<V3IAchAccount> = [];

  sourceAccountSelected: IAccount | undefined = undefined;
  targetAccountSelected: V3IAchAccount | undefined = undefined;
  bankSettingSelected: IACHBiesGeneralParameterBank | undefined = undefined;

  TRANSFER_LIMIT_BY_USER = 0;



  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get isShowNextButton() {
    return this.form.valid;
  }



  constructor(
    private utils: UtilService,
    private router: Router,
    private formDefinitionService: T365dFormService,
    private adfFormBuilderService: AdfFormBuilderService,
    private activatedRouter: ActivatedRoute,
    private ownTransferBaseUtil: OtdTransferBaseHomeService,
    private parameterManagement: ParameterManagementService,
    private ttr365Utils: Ttr365UtilsService,
  ) { }

  ngOnInit(): void {
    this.initState();
    this.initFormDefinition();
    this.utils.hideLoader();
  }

  initState() {
    this.getSourceAccountList();
    this.getGeneralParameters();
    this.getTargetAccountList();
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

  getLimitByUser() {
    const limitByUserResponse = this.activatedRouter.snapshot.data['getLimitUser'];

    if (limitByUserResponse.hasOwnProperty('error')) {
      this.showAlert('error', (limitByUserResponse as IFlowError).message);
      return;
    }

    this.TRANSFER_LIMIT_BY_USER = limitByUserResponse?.amount ?? 0;
  }

  getGeneralParameters() {
    const settingResponse = this.activatedRouter.snapshot.data['settings'];

    if (settingResponse.hasOwnProperty('error')) {
      this.showAlert('error', (settingResponse as IFlowError).message);
      return;
    }

    this.settings = settingResponse;
  }

  getTargetAccountList() {
    const targetAccountListResponse = this.activatedRouter.snapshot.data['targetAccountList'];

    if (targetAccountListResponse.hasOwnProperty('error')) {
      this.showAlert('error', (targetAccountListResponse as IFlowError).message);
      return;
    }

    this.targetAccountList = targetAccountListResponse;
  }

  initFormDefinition() {
    this.formLayout = this.formDefinitionService.buildAchTransferLayout();
    this.form = this.adfFormBuilderService.formDefinition(this.formLayout.attributes);
      this.buildFormOptions();
    this.manageDataPersistence();
    this.changeForm();
  }

  manageDataPersistence() {
    const state = this.parameterManagement.getParameter<I365HomeState>(PROTECTED_PARAMETER_STATE);

    if (!state) return;

    const { formValues: { targetAccount, sourceAccount, bank, ...form } } = this.parameterManagement.getParameter<I365HomeState>(PROTECTED_PARAMETER_STATE);

    this.form.patchValue(form);

    const sourceAccountSelected = this.utils.findSourceAccount(sourceAccount, this.sourceAccountList);
    const targetAccountSelected = this.utils.findSourceAccount(targetAccount, this.targetAccountList);
    const bankSelected = this.utils.findSourceAccount(bank, this.settings.banks, 'code');

    if (sourceAccountSelected) {
      this.form.get(ET365FormControlName.SOURCE_ACCOUNT)?.setValue(sourceAccount);
    }

    if (bankSelected) {
      this.form.get(ET365FormControlName.BANK)?.setValue(bank);
    }

    setTimeout(() => {
      if (targetAccountSelected) {
        this.form.get(ET365FormControlName.TARGET_ACCOUNT)?.setValue(targetAccount);
      }
    }, 100);
  }

  buildFormOptions() {
    const sourceAccountOptions = this.buildOptionsForSourceAccount();
    const bankOptions = this.buildOptionsForBankField();

    this.selectOptions = [sourceAccountOptions, bankOptions];
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
       controlName: ET365FormControlName.SOURCE_ACCOUNT,
       data: options,
     }
  }

  buildOptionsForBankField() {
    const bankAvailable = this.settings.banks.filter(bank => bank.participant[1] === 'S');

    const options = bankAvailable.map(setting => {
      return {
        name: setting.description,
        value: `${setting.code}`,
      }
    });

    return {
      controlName: ET365FormControlName.BANK,
      data: options,
    }
  }

  buildOptionsForTargetAccount(bankSettingSelected: IACHBiesGeneralParameterBank, showFavorites = false) {
    if (!bankSettingSelected) return;

    const accountFiltered = this.targetAccountList.filter(account => +account.bank === +bankSettingSelected.code);
    const accountFilteredFavoritesOnly = this.targetAccountList
      .filter(account => +account.bank === +bankSettingSelected.code)
      .filter(account => account.favorite);

    const accountToUse = showFavorites ? accountFilteredFavoritesOnly : accountFiltered;

    if (accountToUse.length <= 0) {
      this.targetAccountSelected = undefined;
      this.handleChangeTargetAccount('');
    }

    const options = accountToUse.map(account => {
      return {
        name: `${account.account} - ${account.name}`,
        value: account.account,
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
    this.selectOptions = this.selectOptions.map(value => {
      if (value.controlName === ET365FormControlName.TARGET_ACCOUNT) {
        return {
          ...value,
          data,
        }
      }

      return value;
    });
  }

  addTargetAccountOptions(data: Array<IPossibleValue>) {
    const isIncludeTargetAccountOptions = this.selectOptions.some(value => value.controlName === ET365FormControlName.TARGET_ACCOUNT);

    if (isIncludeTargetAccountOptions) return;

    const option =  {
      controlName: ET365FormControlName.TARGET_ACCOUNT,
      data: data,
    }

    this.selectOptions = [...this.selectOptions, option];
  }

  changeForm() {
    this.form.get(ET365FormControlName.SOURCE_ACCOUNT)?.valueChanges.subscribe({
      next: (value) => this.handleChangeSourceAccount(value),
    });

    this.form.get(ET365FormControlName.TARGET_ACCOUNT)?.valueChanges.subscribe({
      next: (value) => this.handleChangeTargetAccount(value),
    });

    this.form.get(ET365FormControlName.BANK)?.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe({
      next: (value) => {
        this.handleChangeBankSelected(value);
      }
    });

    this.form.get(ET365FormControlName.IS_SHOW_FAVORITES)?.valueChanges.subscribe({
      next: (value) => this.handleChangeShowFavoriteOption(value),
    });
  }

  handleChangeShowFavoriteOption(value: boolean) {
    this.targetAccountSelected = undefined;
    this.form.get(ET365FormControlName.TARGET_ACCOUNT)?.reset('');
    this.buildOptionsForTargetAccount(this.bankSettingSelected as IACHBiesGeneralParameterBank, value);
    this.handleChangeTargetAccount('');
  }

  handleChangeBankSelected(value: string) {
    this.bankSettingSelected = this.settings.banks.find((setting) => String(setting.code) === value);
    this.targetAccountSelected = undefined;
    this.handleChangeTargetAccount('');
    this.form.get(ET365FormControlName.TARGET_ACCOUNT)?.reset('');

    if (!this.bankSettingSelected) {
      this.resetTargetAccountOptions([]);
      return;
    }

    const isFavorite = this.form.get(ET365FormControlName.IS_SHOW_FAVORITES)?.value || false;
    this.buildOptionsForTargetAccount(this.bankSettingSelected, isFavorite);
  }

  handleChangeSourceAccount(value: string) {
    const selectedAccount = this.sourceAccountList.find((accountTemp) => accountTemp.account === value);
    if (!selectedAccount) {
      this.sourceAccountSelected = undefined;
      this.formLayout.attributes.forEach((attribute) => {
        if (attribute.controlName === ET365FormControlName.SOURCE_ACCOUNT) {
          attribute.layoutSelect = [];
        }
      });
      return;
    }

    this.sourceAccountSelected = selectedAccount;
    this.formLayout.attributes.forEach((attribute) => {
      if (attribute.controlName === ET365FormControlName.SOURCE_ACCOUNT) {
        attribute.layoutSelect = this.ownTransferBaseUtil.buildDebitedAccountSelectAttributes(selectedAccount);
      }
    });
  }

  handleChangeTargetAccount(value: string) {
    const selectedAccount = this.targetAccountList.find((accountTemp) => accountTemp.account === value);

    if (!selectedAccount) {
      this.targetAccountSelected = undefined;
      this.formLayout.attributes.forEach((attribute) => {
        if (attribute.controlName === ET365FormControlName.TARGET_ACCOUNT) {
          attribute.layoutSelect = []
        }
      });
      return;
    }

    this.targetAccountSelected = selectedAccount;
    this.formLayout.attributes.forEach((attribute) => {
      if (attribute.controlName === ET365FormControlName.TARGET_ACCOUNT) {
        attribute.layoutSelect = this.buildTargetAccountSelectAttributes(selectedAccount);
      }
    });
  }

  buildTargetAccountSelectAttributes(account: V3IAchAccount): IDataLayoutSelect[] {
    const attributeList: IDataLayoutSelect[] = [];
    const productName = this.utils.getLabelProduct(Number(Product[account.type])).toUpperCase();
    const typeIdentification = this.settings.general.listDocuments.find(doc => doc.identificationId === account.identificationType)

    const attributeProductName = new DataLayoutSelectBuilder()
      .label('ach-uni:transfer-target-account-type-form')
      .value(productName)
      .build();

    const attributeIdentification = new DataLayoutSelectBuilder()
      .label('365:label_identify')
      .value(typeIdentification ? `${typeIdentification.description} ${account.documentNumber}` : '')
      .build();

    attributeList.push(attributeProductName);
    attributeList.push(attributeIdentification);

    return attributeList;
  }

  previous() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: null,
    });

    this.router.navigate([AchUniTransferUrlNavigationCollection.HOME]).finally(() => {});
  }

  nextStep() {
    if (!this.form.valid ) {
      this.form.markAllAsTouched();
      return;
    }

    const amount = this.form.get(ET365FormControlName.AMOUNT)?.value;
    const { isValid, message } = this.ttr365Utils.getIsAmountValidByLimits({
      amount,
      currencies: this.settings.currencies,
      limitByUser: this.TRANSFER_LIMIT_BY_USER,
      currency: this.sourceAccountSelected!.currency,
      availableAmountInSourceAccount: this.sourceAccountSelected?.availableAmount ?? 0,
    });

    if (!isValid) {
      this.utils.scrollToTop();
      this.showAlert('warning', message ?? '');
      return;
    }

    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        formValues: this.form.value,
        sourceAccountSelected: this.sourceAccountSelected,
        targetAccountSelected: this.targetAccountSelected,
        bankSelected: this.bankSettingSelected,
      } as I365HomeState,
      [PROTECTED_PARAMETER_ROUTE]: T365RouteProtected.CONFIRMATION,
    });

    this.router.navigate([E365UrlCollection.CONFIRMATION]).finally(() => {});
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

}
