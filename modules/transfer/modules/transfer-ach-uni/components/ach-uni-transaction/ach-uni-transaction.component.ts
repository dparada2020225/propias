import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from 'src/app/service/common/util.service';
import { DataLayoutSelectBuilder, IDataLayoutSelect, IDataSelect, ILayout, IPossibleValue } from '@adf/components';
import { FormControl, FormGroup } from '@angular/forms';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { AchUniTransactionViewMode } from '../../enums/AchUniTransactionViewMode.enum';
import { ACHUniAccount } from '../../interfaces/ach-uni-account-interface';
import { AchUniTransferInitForm } from '../../interfaces/ach-uni-definition';
import { EachUniTransferManagerService } from '../../services/execution/e-ach-uni-transfer-manager.service';
import { AchUniBank } from '../../interfaces/ach-uni-bank';
import { AchUniPurpose } from '../../interfaces/ach-uni-purpose';
import { AchUniCommisionResponse } from '../../interfaces/ach-uni-commision-response';
import { AchUniAttributeForm } from '../../enums/ach-uni-attribute-form.enum';
import { IAccount } from 'src/app/models/account.inteface';
import { TranslateService } from '@ngx-translate/core';
import { AchUniTransactionNavigateParameterState } from '../../interfaces/ach-uni-transaction-navigate-parameter-state';
import { AchUniTransferProtectedNavigation, AchUniTransferUrlNavigationCollection } from '../../enums/ach-uni-navigation-parameter.enum';
import { AchUniLimitForUserResponse, LimitTransferClientCurrency } from '../../interfaces/ach-uni-limits-response';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import {
  ESignatureTrackingUrlFlow
} from '../../../../../transaction-manager/modules/signature-tracking/enum/st-navigate-enum';
import { CanComponentDeactivate } from '../../../transfer-ach-uni-multiple/guards/verify-terms-conditions.guard';
import { EProductFromCode } from '../../../../../../enums/product.enum';

@Component({
  selector: 'byte-ach-uni-transaction',
  templateUrl: './ach-uni-transaction.component.html',
  styleUrls: ['./ach-uni-transaction.component.scss']
})
export class AchUniTransactionComponent implements OnInit, CanComponentDeactivate {
  sourceAccountList!: ACHUniAccount[];
  bankList!: any[];
  targetAccountList!: any[];
  purposeList!: any[];
  comission;

  transferFormLayout!: ILayout;
  transferForm!: FormGroup;
  view: string | null = null;
  optionList: IDataSelect[] = [];

  typeAlert: string | null = null;
  messageAlert: string | null = null;

  accountSelectedDebited: IAccount | null = null;
  accountSelectedDestination: IAccount | null = null;
  bankSelected!: AchUniBank;
  purposeSelected!: AchUniPurpose;

  purposeOptions!: Array<IPossibleValue>;

  limitUser!: AchUniLimitForUserResponse;
  limitCurrencyTypeClient!: LimitTransferClientCurrency;
  urlUni: string = 'assets/images/logos/SVG_BIES_TOB_UNI_Logo.svg';

  title = 'transfers_other_banks';
  subTitle = '';

  get getControlPurpose(): FormControl{
    return this.transferForm.get(AchUniAttributeForm.PURPOSE) as FormControl;
  }

  get isShowPurpose(): boolean {
    return this.transferForm.get(AchUniAttributeForm.DESTINATION_ACCOUNT)?.value !== '';
  }

  canDeactivate(): boolean {
    return true;
  }

  constructor(
    public utils: UtilService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private persistStepStateService: ParameterManagementService,
    private executionManager: EachUniTransferManagerService,
    private translate: TranslateService
  ) {
    this.manageLanguageChange();
  }

  manageLanguageChange() {
    this.translate.onLangChange.subscribe(() => {
      if (this.accountSelectedDestination) {
        this.onChangeProductName(this.accountSelectedDestination.account);
      }
    });
  }

  ngOnInit(): void {
    this.view = this.activatedRouter.snapshot.data['view'];
    this.initDefinition();
    this.utils.hideLoader();
  }

  initDefinition() {
    if (this.view === AchUniTransactionViewMode.TRANSACTION) {
      this.formDefinition();
      return;
    }

    this.buildFormDefinitionForStUpdateTxn();
  }

  formDefinition() {
    const sourceAccountList: ACHUniAccount[] = this.activatedRouter.snapshot.data['sourceAccountList'] ?? [];
    const targetAccountList: ACHUniAccount[] = this.activatedRouter.snapshot.data['targetAccountList'] ?? [];
    const bankList: AchUniBank[] = this.activatedRouter.snapshot.data['getBankList'] ?? [];
    const purposeList: AchUniPurpose[] = this.activatedRouter.snapshot.data['getPurposeList'] ?? [];
    const comission: AchUniCommisionResponse = this.activatedRouter.snapshot.data['getCommissionCalculation'] ?? null;

    const limitUser: AchUniLimitForUserResponse = this.activatedRouter.snapshot.data['getLimitUser'] ?? null;
    const limitCurrencyTypeClient: LimitTransferClientCurrency = this.activatedRouter.snapshot.data['getLimitCurrencyTypeClient'] ?? null;

    if(sourceAccountList.length > 0){
      this.sourceAccountList = [];
      this.sourceAccountList = sourceAccountList.filter((element:ACHUniAccount) => element.status === 'Activa');

    }
    if(targetAccountList.length > 0){
      this.targetAccountList = [];
      this.targetAccountList = targetAccountList;
    }
    if(bankList.length > 0){
      this.bankList = [];
      this.bankList = bankList;
    }
    if(purposeList.length > 0){
      this.purposeList = [];
      this.purposeList = purposeList;
    }
    if(comission){
      this.comission = comission.commissionValue;
    }

    if(limitUser){
      this.limitUser = limitUser;
    }

    if(limitCurrencyTypeClient){
      this.limitCurrencyTypeClient = limitCurrencyTypeClient;
    }

    const startupParameters: AchUniTransferInitForm = {
      title: '',
      subtitle: '',
      sourceAccountList: this.sourceAccountList,
      // amount: '',
      bankList: this.bankList,
      targetAccountList: this.targetAccountList,
      purposeList: this.purposeList,
      // comment: '',
      commission: this.comission.toString(),
      accountCredit: undefined
    };

    const { transferFormLayout, transferForm, optionList, error } = this.executionManager.buildFormScreenBuilder(startupParameters);

    this.transferFormLayout = transferFormLayout;
    this.transferForm = transferForm;
    this.optionList = optionList;
    this.changeForm();

    if (error) {
      this.showAlert('error', error);
    }

  }

  changeForm() {
    this.transferForm.get(AchUniAttributeForm.SOURCE_ACCOUNT)?.valueChanges.subscribe((accountNumber) => {
      this.handleAccountDebitedChange(accountNumber);
    });

    this.transferForm.get(AchUniAttributeForm.PURPOSE)?.valueChanges.subscribe((codePurpose) => {
      this.handlePurposeChange(codePurpose);
    });

    this.transferForm.get(AchUniAttributeForm.BANK)?.valueChanges.subscribe((bank) => {
      this.handleBankChange(bank);
    });

    this.transferForm.get(AchUniAttributeForm.DESTINATION_ACCOUNT)?.valueChanges.subscribe((account) => {
      this.handleDestinationAccountChange(account);
      if(account){
        const purposes: IPossibleValue[] = this.purposeList?.map((item) => ({
          name: `${item.code} - ${item.description}`,
          value: item.code,
        }));
        purposes.unshift({
          name: 'ach-uni:label-select-option-placeholder',
          value: '',
        });
        this.setCustomOptionList(AchUniAttributeForm.PURPOSE, purposes);
      }
    });
  }


  validateLimitTypeClient(amount: number): boolean {
    const lowerLimitClient = this.limitCurrencyTypeClient.lowerLimit;
    const upperLimitClient = this.limitCurrencyTypeClient.upperLimit;
    return amount >= lowerLimitClient && amount <= upperLimitClient;
  }

  validateLimitUser(amount: number): boolean {
    const userLimit = this.limitUser.amount;
    return amount <= userLimit;
  }

  validateAmountFound(amount: number): boolean {

    if(this.accountSelectedDebited?.availableAmount){
      return amount <= this.accountSelectedDebited?.availableAmount;
    } else {
      return false;
    }

  }

  handleDestinationAccountChange(account: string) {
    if (!account) {
      this.utils.removeLayoutSelect(this.transferFormLayout, AchUniAttributeForm.DESTINATION_ACCOUNT);
      return;
    }

    const { accountDestination, transferFormLayout } = this.executionManager.handleChangeDestinationAccount(account);



    this.transferFormLayout = transferFormLayout;
    this.setNameProductTargetAccount(account);
    this.accountSelectedDestination = accountDestination as IAccount;
  }

  setNameProductTargetAccount(account: string) {
    this.transferFormLayout?.attributes.forEach(attribute => {
      if (attribute.controlName === AchUniAttributeForm.DESTINATION_ACCOUNT) {
        const accountSelected = this.targetAccountList.find((item: any) => item.account === account);
        if(accountSelected){
          attribute.layoutSelect = this.buildAccountResumeAttributeForSelectAccounts(accountSelected);
        }else{
          attribute.layoutSelect = undefined;
        }
      }
    });
  }


  onChangeProductName(account: string) {
    const x  = this.transferFormLayout?.attributes.map(attribute => {
      if (attribute.controlName === AchUniAttributeForm.DESTINATION_ACCOUNT) {
        const accountSelected = this.targetAccountList.find((item: any) => item.account === account);
        if(accountSelected){
          attribute.layoutSelect = this.buildAccountResumeAttributeForSelectAccounts(accountSelected);
          return attribute;
        }

        return attribute;
      }

      return attribute;
    });

    this.transferFormLayout = {
      ...this.transferFormLayout,
      attributes: x,
    }

  }

  buildAccountResumeAttributeForSelectAccounts(account: IAccount): IDataLayoutSelect[] {
    const accountDebitSelectedOptions: IDataLayoutSelect[] = [];
    const codeProduct = Number(this.getCodeFromAccountType(account.type));
    const x = this.utils.getLabelProduct(codeProduct);
    const typeProductOption = new DataLayoutSelectBuilder()
      .label('ach-uni:transfer-target-account-type-form')
      .value(`${x}`)
      .build();

    accountDebitSelectedOptions.push(typeProductOption);
    return accountDebitSelectedOptions;
  }

  getCodeFromAccountType(type: string | undefined): string | null {

    if (type === undefined) {
      return null;
    }
    const entries = Object.entries(EProductFromCode) as [string, string][];
    const entry = entries.find(([, value]) => value === type);
    return entry ? entry[0] : null;
  }

  handlePurposeChange(codePurpose: string) {
    const { purposeSelected, transferFormLayout } = this.executionManager.handleChangePurpose(codePurpose);
    this.transferFormLayout = transferFormLayout;
    this.purposeSelected = purposeSelected as AchUniPurpose;
  }

  handleBankChange(codeBank: string) {
    const { bank, transferFormLayout } = this.executionManager.handleChangeBank(codeBank);
    this.transferFormLayout = transferFormLayout;
    this.bankSelected = bank as AchUniBank;
    this.transferForm.get(AchUniAttributeForm.DESTINATION_ACCOUNT)?.setValue('');
  }

  handleAccountDebitedChange(accountNumber: string) {
    if (!accountNumber) {
      this.accountSelectedDebited = null;
      this.utils.removeLayoutSelect(this.transferFormLayout, AchUniAttributeForm.SOURCE_ACCOUNT);
      return;
    }

    const { accountDebited, transferFormLayout } = this.executionManager.handleChangeDebitedAccount(accountNumber);
    this.transferFormLayout = transferFormLayout;
    this.accountSelectedDebited = accountDebited as IAccount;
    this.transferForm.get(AchUniAttributeForm.AMOUNT)?.reset();
  }

  setCustomOptionList(controlName: string, options: IPossibleValue[]) {
    this.purposeOptions = options;
    this.optionList.forEach((option) => {
      if (option.controlName === controlName) {
        option.data = options;
      }
    });
    this.transferForm.get(AchUniAttributeForm.PURPOSE)?.setValue('');
  }

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  nextStep() {
    const isVaidFunds = this.validateAmountFound(Number(this.transferForm.get(AchUniAttributeForm.AMOUNT)?.value));
    const isValidLimitTypeClient = this.validateLimitTypeClient(Number(this.transferForm.get(AchUniAttributeForm.AMOUNT)?.value));
    const isValidLimitUser = this.validateLimitUser(Number(this.transferForm.get(AchUniAttributeForm.AMOUNT)?.value));

    if (!isVaidFunds) {
      this.utils.scrollToTop();
      this.transferForm.controls[AchUniAttributeForm.AMOUNT].setErrors({ 'ach-uni:amount_validate_found': true });
      return;
    }else if (!isValidLimitTypeClient) {
      this.utils.scrollToTop();
      this.transferForm.controls[AchUniAttributeForm.AMOUNT].setErrors({ 'ach-uni:amount_validate_range': true });
      return;
    }else if (!isValidLimitUser) {
      this.utils.scrollToTop();
      this.transferForm.controls[AchUniAttributeForm.AMOUNT].setErrors({ 'ach-uni:limit_user_error': true });
      return;
    }

    if (!this.transferForm.valid) {
      this.transferForm.markAllAsTouched();
      return;
    }

    if (this.view === AchUniTransactionViewMode.TRANSACTION) {
      this.saveNavigationProtectedParameter();
      this.goToConfirmation();
      return;
    }

    this.manageToConfirmStUpdateTxn();
  }

  lastStep() {
    if (this.view === AchUniTransactionViewMode.TRANSACTION) {
      this.router.navigate([AchUniTransferUrlNavigationCollection.HOME]).then(() => {});
      this.resetStorage();
      return;
    }

    this.router.navigate([ESignatureTrackingUrlFlow.HOME]).then(() => {});
    this.resetStorage();
  }

  goToConfirmation() {
    this.utils.showLoader();
    this.transferForm.get(AchUniAttributeForm.COMMISSION)?.setValue(this.comission);

    const propertiesToTransferFormStep: AchUniTransactionNavigateParameterState = {
      formValues: this.transferForm.value,
      accountDebited: this.accountSelectedDebited as IAccount,
      accountDestination: this.accountSelectedDestination as IAccount,
      bank: this.bankSelected as AchUniBank,
      purpose: this.purposeSelected,
      commission: this.comission
    };
    this.persistStepStateService.sendParameters({
      navigateStateParameters: propertiesToTransferFormStep,
    });

    this.router.navigate([AchUniTransferUrlNavigationCollection.DEFAULT_CONFIRMATION])
                .finally(() => this.utils.hideLoader());
  }

  saveNavigationProtectedParameter() {
    this.persistStepStateService.sendParameters({
      navigationProtectedParameter: AchUniTransferProtectedNavigation.CONFIRMATION,
    });
  }

  resetStorage() {
    this.persistStepStateService.sendParameters({
      navigationProtectedParameter: null,
      navigateStateParameters: null,
    });
  }

  showAlert(typeAlert: string, message: string) {
    this.typeAlert = typeAlert;
    this.messageAlert = message;
  }



  /* ============================ ST MODIFY FLOW ============================*/
  buildFormDefinitionForStUpdateTxn() {
    const sourceAccountList: ACHUniAccount[] = this.activatedRouter.snapshot.data['sourceAccountList'] ?? [];
    const targetAccountList: ACHUniAccount[] = this.activatedRouter.snapshot.data['targetAccountList'] ?? [];
    const bankList: AchUniBank[] = this.activatedRouter.snapshot.data['getBankList'] ?? [];
    const purposeList: AchUniPurpose[] = this.activatedRouter.snapshot.data['getPurposeList'] ?? [];
    const comission: AchUniCommisionResponse = this.activatedRouter.snapshot.data['getCommissionCalculation'] ?? null;

    this.title = 'signature_tracking_label';
    this.subTitle = 'edit_transaction';

    const limitUser: AchUniLimitForUserResponse = this.activatedRouter.snapshot.data['getLimitUser'] ?? null;
    const limitCurrencyTypeClient: LimitTransferClientCurrency = this.activatedRouter.snapshot.data['getLimitCurrencyTypeClient'] ?? null;

    if(sourceAccountList.length > 0){
      this.sourceAccountList = [];
      this.sourceAccountList = sourceAccountList.filter((element:ACHUniAccount) => element.status === 'Activa');

    }
    if(targetAccountList.length > 0){
      this.targetAccountList = [];
      this.targetAccountList = targetAccountList;
    }
    if(bankList.length > 0){
      this.bankList = [];
      this.bankList = bankList;
    }
    if(purposeList.length > 0){
      this.purposeList = [];
      this.purposeList = purposeList;
    }
    if(comission){
      this.comission = comission.commissionValue;
    }

    if(limitUser){
      this.limitUser = limitUser;
    }

    if(limitCurrencyTypeClient){
      this.limitCurrencyTypeClient = limitCurrencyTypeClient;
    }

    const startupParameters: AchUniTransferInitForm = {
      title: '',
      subtitle: '',
      sourceAccountList: this.sourceAccountList,
      bankList: this.bankList,
      targetAccountList: this.targetAccountList,
      purposeList: this.purposeList,
      commission: this.comission.toString(),
      accountCredit: undefined
    };

    const { transferFormLayout, transferForm, optionList, error } = this.executionManager.buildFormScreenBuilder(startupParameters);

    this.transferFormLayout = transferFormLayout;
    this.transferForm = transferForm;
    this.optionList = optionList;
    this.setDefaultFormValuesForStUpdateTxn();
    this.changeForm();

    if (error) {
      this.showAlert('error', error);
    }

  }

  setDefaultFormValuesForStUpdateTxn() {
    const state: any = this.persistStepStateService.getParameter(PROTECTED_PARAMETER_STATE);

    if (!state) return;

    const { formValues: {
      destinationAccount,
      originAccount,
      bank,
      amount,
      purpose,
      ...rest } } = state;

    this.transferForm.patchValue(rest);
    this.transferForm.get(AchUniAttributeForm.BANK)?.setValue(Number(bank));

    const isFoundSourceAccount = this.utils.findSourceAccount(originAccount, this.sourceAccountList);
    const isFoundTargetAccount = this.utils.findSourceAccount(destinationAccount, this.targetAccountList);

    if (isFoundSourceAccount) {
      this.transferForm.get(AchUniAttributeForm.SOURCE_ACCOUNT)?.setValue(originAccount);
    }

    if (isFoundTargetAccount) {
      setTimeout(() => {
        this.transferForm.get(AchUniAttributeForm.DESTINATION_ACCOUNT)?.setValue(destinationAccount);
      }, 100);
    }

    setTimeout(() => {
      this.transferForm.get(AchUniAttributeForm.AMOUNT)?.setValue(amount);
    }, 100);

    setTimeout(() => {
      this.transferForm.get(AchUniAttributeForm.PURPOSE)?.setValue(purpose);
    }, 200);
  }

  manageToConfirmStUpdateTxn() {
    this.utils.showLoader();
    const { transactionManagerDetail, transactionSelected }: any = this.persistStepStateService.getParameter(PROTECTED_PARAMETER_STATE);

    const propertiesToTransferFormStep: AchUniTransactionNavigateParameterState = {
      formValues: this.transferForm.value,
      accountDebited: this.accountSelectedDebited as IAccount,
      accountDestination: this.accountSelectedDestination as IAccount,
      bank: this.bankSelected,
      purpose: this.purposeSelected,
      commission: this.comission,
    };

    this.persistStepStateService.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        ...propertiesToTransferFormStep,
        transactionSelected,
        transactionManagerDetail,
      },
      [PROTECTED_PARAMETER_ROUTE]: AchUniTransferProtectedNavigation.ST_UPDATE_CONFIRM,
    });

    this.router.navigate([AchUniTransferUrlNavigationCollection.ST_MODIFY_CONFIRM])
      .finally(() => this.utils.hideLoader());
  }
}
