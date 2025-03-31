import { Injectable } from '@angular/core';
import { AchUniFormStartupParameters, AchUniInitFormResponse, AchUniTransferInitForm } from '../../interfaces/ach-uni-definition';
import { IFlowError } from 'src/app/models/error.interface';
import { ACHUniAccount } from '../../interfaces/ach-uni-account-interface';
import { AchUniBank } from '../../interfaces/ach-uni-bank';
import { IAchAccount } from '../../../transfer-ach/interfaces/ach-account-interface';
import { AdfFormBuilderService, IDataSelect, ILayout, IPossibleValue } from '@adf/components';
import { FormGroup } from '@angular/forms';
import { UtilService } from 'src/app/service/common/util.service';
import { TAchUniTransferManagerService } from '../definition/transaction/t-ach-uni-transfer-manager.service';
import { AchUniAttributeForm } from '../../enums/ach-uni-attribute-form.enum';
import { AchUniPurpose } from '../../interfaces/ach-uni-purpose';
import { IAccount } from 'src/app/models/account.inteface';

@Injectable({
  providedIn: 'root'
})
export class EachUniTransferFormService {

  private catchErrorList: IFlowError[] = [];
  private accountDebitList: IAccount[] = [];
  private bankList: AchUniBank[] = [];
  private bankListAux: AchUniBank[] = [];
  private purposeList: AchUniPurpose[] = [];
  private targetAccountList: IAccount[] = [];
  private accountCredit: IAchAccount | null = null;
  private transferFormLayout: ILayout | undefined = undefined;
  private transferForm: FormGroup | null = null;
  private isModify: boolean | undefined = false;
  private optionList: IDataSelect[] = [];
  /**NEW */
  // private accountDebitList: IAccount[] = [];

  constructor(
    private utils: UtilService,
    private transferDefinitionManager: TAchUniTransferManagerService,
    private adfFormBuilder: AdfFormBuilderService,
  ) { }

  formScreenBuilder(startupParameters: AchUniTransferInitForm) {
    this.clearDataInit();
    this.formDefinition(startupParameters);
    this.setSourceAccountList(startupParameters);
    this.setBankList(startupParameters);
    this.setPurposeList(startupParameters);
    this.setTargetAccoutList(startupParameters);
    this.isModify = startupParameters?.isModify;

  // Esto es para configurar mas opciones de dropdown
  //   if (startupParameters?.isModify) {
  //     this.accountListDebited(startupParameters);
  //   } else {
  //     this.accountDebitFilter(startupParameters);
  //   }
    return this.responseFromScreenBuilder();
  }

  private setBankList(startupParameters: AchUniTransferInitForm){
    const bankListResponse = (startupParameters?.bankList ?? []);

    if (bankListResponse.hasOwnProperty('error')) {
      this.handleAccountsError(bankListResponse as IFlowError);
      return;
    }

    this.bankList = bankListResponse as AchUniBank[];

    const bankOptions: IDataSelect = {
      controlName: AchUniAttributeForm.BANK,
      data: this.selectFormattingBank(this.bankList as any)
    };

    this.optionList.push(bankOptions);

  }

  selectFormattingBank(bankList: AchUniBank[]): IPossibleValue[] {
    if (bankList && bankList.length === 0) {
      return [];
    }
    return bankList.map((bank: AchUniBank) => {
      const bankTemp: IPossibleValue = {
        value: bank.code,
        name: bank.description,
      };
      return bankTemp;
    });
  }

  private setTargetAccoutList(startupParameters: AchUniTransferInitForm){
    const setTargetAccoutListResponse = (startupParameters?.targetAccountList ?? []);

    if (setTargetAccoutListResponse.hasOwnProperty('error')) {
      this.handleAccountsError(setTargetAccoutListResponse as IFlowError);
      return;
    }

    this.targetAccountList = setTargetAccoutListResponse as IAccount[];

    const targetAccountOptions: IDataSelect = {
      controlName: AchUniAttributeForm.DESTINATION_ACCOUNT,
      data: []
    };

    this.optionList.push(targetAccountOptions);

  }

  selectFormattingPurpose(purposeList: AchUniPurpose[]): IPossibleValue[] {
    if (purposeList && purposeList.length === 0) {
      return [];
    }
    return purposeList.map((purpose: AchUniPurpose) => {
      const purposeTemp: IPossibleValue = {
        value: purpose.code,
        name: `${purpose.code} - ${purpose.description}`,
      };
      return purposeTemp;
    });
  }

  private setPurposeList(startupParameters: AchUniTransferInitForm){
    const purposeListResponse = (startupParameters?.purposeList ?? []);

    if (purposeListResponse.hasOwnProperty('error')) {
      this.handleAccountsError(purposeListResponse as IFlowError);
      return;
    }

    this.purposeList = purposeListResponse as AchUniPurpose[];

    const purposeOptions: IDataSelect = {
      controlName: AchUniAttributeForm.PURPOSE,
      data: this.selectFormattingPurpose(this.purposeList as any)
    };

    this.optionList.push(purposeOptions);

  }

  private clearDataInit(): void {
    this.catchErrorList = [];
    this.accountDebitList = [];
    this.bankList = [];
    this.targetAccountList = [];
    this.optionList = [];
  }

  private formDefinition(startupParameters: AchUniTransferInitForm) {
    const parameters: AchUniFormStartupParameters = {
      title: startupParameters.title,
      subtitle: startupParameters.subtitle,
      isModify: startupParameters.isModify ?? false,
      targetAccountSelected: undefined,
      commission: startupParameters?.commission
    };
    this.transferFormLayout = this.transferDefinitionManager.buildFormLayout(parameters);
    this.transferForm = this.adfFormBuilder.formDefinition(this.transferFormLayout.attributes);

    // this.getAccreditAccountData(startupParameters.accountCredit);
    this.injectMask();
    this.injectMaskCommission(startupParameters.commission);
  }

  private setSourceAccountList(startupParameters: AchUniTransferInitForm) {
    const accountResponse = (startupParameters?.sourceAccountList ?? []);

    if (accountResponse.hasOwnProperty('error')) {
      this.handleAccountsError(accountResponse as IFlowError);
      return;
    }

    this.accountDebitList = accountResponse as [];

    const creditAccountOptions: IDataSelect = {
      controlName: AchUniAttributeForm.SOURCE_ACCOUNT,
      data: this.selectFormatting(this.accountDebitList as any)
    };

    this.optionList.push(creditAccountOptions);
  }

  private handleAccountsError(errorResponse: IFlowError) {
    this.catchErrorList = [...this.catchErrorList, errorResponse];
  }

  private selectFormatting(accountList: ACHUniAccount[]): IPossibleValue[] {
    if (accountList && accountList.length === 0) {
      return [];
    }
//VALUE PARA SELECT
    return accountList.map((account: ACHUniAccount) => {
      const accountTemp: IPossibleValue = {
        value: account.account,
        name: `${this.nameFormatting(this.utils.getProductAcronym(account.product), account?.account)}`,
      };
      return accountTemp;
    });
  }

  private nameFormatting(product: string, account: string): string {
    return `${product} - ${account}`;
  }

  private responseFromScreenBuilder(): AchUniInitFormResponse {
    return {
      transferFormLayout: this.transferFormLayout as never,
      transferForm: this.transferForm as never,
      optionList: this.optionList,
      error: undefined,
    } as AchUniInitFormResponse;
  }

  private injectMask() {
    const currency = 'USD';
    const currencyMask = this.utils.getAmountMask(currency);

    if (this.transferFormLayout){
      for (const attribute of this.transferFormLayout.attributes) {
        if (attribute.controlName === AchUniAttributeForm.AMOUNT) {
          attribute.imaskOptions = currencyMask;
          attribute.placeholder = `${currency} 0.00`;
        }
      }
    }
  }

  private injectMaskCommission(commission: string) {
    const currency = 'USD';
    const currencyMask = this.utils.getAmountMask(currency);

    if (this.transferFormLayout){
      for (const attribute of this.transferFormLayout.attributes) {

        if (attribute.controlName === AchUniAttributeForm.COMMISSION) {
          attribute.imaskOptions = currencyMask;
          attribute.placeholder = `${currency} ${Number(commission).toFixed(2)}`;
        }
      }
    }
  }


  //*** */

  changeAccountDebited(accountNumber: string) {
    const accountSelected = this.accountDebitList.find((account: any) => account.account === accountNumber);

    if (!accountSelected) { return this.changeAccountDebitedResponse(); }

    this.transferFormLayout?.attributes.forEach(attribute => {
      if (attribute.controlName === AchUniAttributeForm.SOURCE_ACCOUNT) {
        if(accountNumber){
          attribute.layoutSelect = this.transferDefinitionManager.buildLayoutAttribute(accountSelected);
        }else{
          attribute.layoutSelect = undefined;
        }
      }
    });

    return this.changeAccountDebitedResponse(accountSelected);
  }

  changeAccountDestination(account: string) {
    const accountSelected = this.targetAccountList.find((item: any) => item.account === account);
    if (!accountSelected) { return this.changeDestinationAccountResponse(); }

    this.transferFormLayout?.attributes.forEach(attribute => {
      if (attribute.controlName === AchUniAttributeForm.DESTINATION_ACCOUNT) {
        if(account){
          attribute.layoutSelect = this.transferDefinitionManager.buildLayoutAttributeDestinationAccount(accountSelected);
        }else{
          attribute.layoutSelect = undefined;
        }
      }
    });

    return this.changeDestinationAccountResponse(accountSelected);
  }

  changePurpose(codePurpose: string) {
    const purposeSelected = this.purposeList.find((item: AchUniPurpose) => item.code === codePurpose);
    if (!purposeSelected) { return this.changePurposeResponse(); }

    return this.changePurposeResponse(purposeSelected);
  }

  private changeAccountDebitedResponse(accountSelected?: IAccount) {
    return {
      transferFormLayout: this.transferFormLayout,
      accountDebited: accountSelected ?? null,
    } as any;
  }

  private changeDestinationAccountResponse(accountSelected?: IAccount) {
    return {
      transferFormLayout: this.transferFormLayout,
      accountDestination: accountSelected ?? null,
    } as any;
  }

  private changePurposeResponse(purposeSelected?: AchUniPurpose) {
    return {
      transferFormLayout: this.transferFormLayout,
      purposeSelected: purposeSelected ?? null,
    } as any;
  }

  changeBank(codeBank: string) {
    const bankSelected = this.bankList.find((bank: AchUniBank) => Number(bank.code) === Number(codeBank));
    this.setListDestinationAccounts(codeBank);
    if (!bankSelected) { return this.changeBankResponse(); }
    return this.changeBankResponse(bankSelected);
  }

  private changeBankResponse(bankSelected?: AchUniBank) {
    return {
      transferFormLayout: this.transferFormLayout,
      bank: bankSelected ?? null,
    } as any;
  }

  private setListDestinationAccounts(codeBank: string){
    const targetAccountListResponse = this.targetAccountList.filter((account: IAccount) => (account.bank === Number(codeBank) && account.status === 'A'));
    let index = this.optionList.findIndex(option => option.controlName === AchUniAttributeForm.DESTINATION_ACCOUNT);

    if (index === -1) {
      const targetAccountsOptions: IDataSelect = {
        controlName: AchUniAttributeForm.DESTINATION_ACCOUNT,
        data: this.selectFormattingDestinationAccounts(targetAccountListResponse as IAccount[])
      };
      this.optionList.push(targetAccountsOptions);
    } else if(codeBank && codeBank !== ''){
      this.optionList[index].data = this.selectFormattingDestinationAccounts(targetAccountListResponse as IAccount[]);
    }else{
      this.optionList.splice(index, 1);
    }
  }

  selectFormattingDestinationAccounts(accountsList: IAccount[]): IPossibleValue[] {
    const defaultOption: IPossibleValue = {
      value: '',
      name: 'ach-uni:label-select-option-placeholder'
  };
  if (accountsList && accountsList.length === 0) {
      return [defaultOption];
  }
  const formattedAccounts = accountsList.map((account: IAccount) => {
      const accountTemp: IPossibleValue = {
          value: account.account,
          name: `${account.account} - ${account.name}`,
      };
      return accountTemp;
  });
  return [defaultOption, ...formattedAccounts];
  }

  setCustomOptionListPurpose() {
    const optionsPurpose: IPossibleValue[] = this.selectFormattingPurpose(this.purposeList);

    this.optionList.forEach((option) => {
      if (option.controlName === AchUniAttributeForm.PURPOSE) {
        option.data = optionsPurpose;
      }
    });
  }
}
