import { Injectable } from '@angular/core';
import { AdfFormBuilderService, IDataSelect, ILayout, IPossibleValue } from '@adf/components';
import { FormGroup } from '@angular/forms';
import { IFlowError } from '../../../../../../models/error.interface';
import { IAccount } from '../../../../../../models/account.inteface';
import { IAchAccount } from '../../interfaces/ach-account-interface';
import {
  IATEChangeDebitedAccountResponse,
  IATEFormStartupParameters,
  IATEInitForm,
  ITTEInitFormResponse
} from '../../interfaces/ach-transfer-definition.inteface';
import { AtdTransferManagerService } from '../definition/transaction/atd-transfer-manager.service';
import { AttributeFormTransferAch } from '../../enum/ach-transfer-control-name.enum';
import { Product } from '../../../../../../enums/product.enum';

import { UtilService } from 'src/app/service/common/util.service';
import { AttributeThirdFormTransfer } from '../../../transfer-third/enums/third-transfer-control-name.enum';


@Injectable({
  providedIn: 'root'
})
export class AteTransferFormService {
  private catchErrorList: IFlowError[] = [];
  private accountDebitList: IAccount[] = [];
  private accountAccreditList: IAchAccount[] = [];
  private optionList: IDataSelect[] = [];
  private accountAccredit: IAchAccount | null = null;
  private transferFormLayout: ILayout | undefined = undefined;
  private transferForm: FormGroup | null = null;
  private isModify: boolean | undefined = false;

  constructor(
    private util: UtilService,
    private transferDefinitionManager: AtdTransferManagerService,
    private adfFormBuilder: AdfFormBuilderService,
  ) { }

  formScreenBuilder(startupParameters: IATEInitForm) {
    this.clearDataInit();
    this.formDefinition(startupParameters);
    this.accountListCredit(startupParameters);
    this.hourListOptions();

    this.isModify = startupParameters?.isModify;

    if (startupParameters?.isModify) {
      this.accountListDebited(startupParameters);
    } else {
      this.accountDebitFilter(startupParameters);
    }


    return this.responseFromScreenBuilder();
  }

  changeAccountDebited(accountNumber: string) {
    const accountSelected = this.accountDebitList.find(account => account.account === accountNumber);

    if (!accountSelected) { return this.changeAccountDebitedResponse(); }

    this.transferFormLayout?.attributes.forEach(attribute => {
      if (attribute.controlName === AttributeFormTransferAch.ACCOUNT_DEBITED) {
        attribute.layoutSelect = this.transferDefinitionManager.buildLayoutAttribute(accountSelected);
      }
    });

    return this.changeAccountDebitedResponse(accountSelected);
  }

  changeTargetAccount(accountNumber: string) {
    const accountSelected = this.accountAccreditList.find((account) => account.account === accountNumber);

    if (!accountSelected) { return this.changeAccountAccreditResponse(); }

    if (this.isModify) {
      this.handleChangeDebitOptions(accountSelected);
    }

    const product = this.util.getLabelProduct(Number(Product[accountSelected?.type ?? '00']));


    this.transferFormLayout?.attributes.forEach(attribute => {
      if (attribute.controlName === AttributeFormTransferAch.ACCOUNT_CREDIT_CURRENCY) {
        attribute.placeholder = this.util.getLabelCurrency(accountSelected?.currency ?? 'UNDEFINED');
      }

      if (attribute.controlName === AttributeFormTransferAch.ACCOUNT_CREDIT_TYPE) {
        attribute.placeholder =  product;
      }

      if (attribute.controlName === AttributeFormTransferAch.ACCOUNT_CREDIT_BANK) {
        attribute.placeholder = accountSelected?.bankName;
      }


      if (attribute.controlName === AttributeFormTransferAch.ACCOUNT_CREDIT_ALIAS) {
        attribute.placeholder = accountSelected?.alias;
      }
    });

    return this.changeAccountAccreditResponse(accountSelected);

  }

  private handleChangeDebitOptions(targetAccount: IAchAccount) {
    const possibleValuesAccountsCredit: IPossibleValue[] = [];

    if (this.accountDebitList.length === 0) { return; }

    this.accountDebitList.forEach((accountToDebit) => {
      const currencyCode = this.util.getCurrencySymbolToIso(targetAccount?.currency);
      if (accountToDebit?.account !== targetAccount?.account && accountToDebit.currency === currencyCode) {
        const accountCreditTemp: IPossibleValue = {
          value: accountToDebit?.account,
          name: ` ${this.nameFormatting(accountToDebit?.name, accountToDebit?.account)}`,
        };

        possibleValuesAccountsCredit.push(accountCreditTemp);
      }
    });

    this.transferForm?.get(AttributeFormTransferAch.ACCOUNT_DEBITED)?.reset('');
    this.transferForm?.get(AttributeFormTransferAch.ACCOUNT_DEBITED)?.markAsTouched();

    this.util.removeLayoutSelect(this.transferFormLayout as never, AttributeFormTransferAch.ACCOUNT_DEBITED);

    this.optionList.forEach(option => {
      if (AttributeFormTransferAch.ACCOUNT_DEBITED === option.controlName) {
        option.data = this.addPlaceholder(possibleValuesAccountsCredit);
      }
    });
  }

  private changeAccountAccreditResponse(accountSelected?: IAchAccount) {
    return {
      thirdTransferLayout: this.transferFormLayout,
      accountAccredit: accountSelected ?? undefined
    };
  }

  private addPlaceholder(newList: IPossibleValue[]): IPossibleValue[] {
    this.transferFormLayout?.attributes.map(attribute => {
      if (newList.length > 0 && attribute.controlName === AttributeThirdFormTransfer.ACCOUNT_DEBITED) {
        const placeholder: IPossibleValue = {
          name: attribute.placeholder,
          value: ''
        };

        newList = [placeholder, ...newList];
      }
    });

    return newList;
  }


  private responseFromScreenBuilder(): ITTEInitFormResponse {
    return {
      transferFormLayout: this.transferFormLayout as never,
      transferForm: this.transferForm as never,
      optionList: this.optionList,
      error: undefined,
    } as ITTEInitFormResponse;
  }

  private clearDataInit(): void {
    this.catchErrorList = [];
    this.accountDebitList = [];
    this.optionList = [];
  }

  private formDefinition(startupParameters: IATEInitForm) {
    const parameters: IATEFormStartupParameters = {
      title: startupParameters.title,
      subtitle: startupParameters.subtitle,
      isModify: startupParameters.isModify ?? false,
      targetAccountSelected: startupParameters?.accountCredit
    };


    this.transferFormLayout = this.transferDefinitionManager.buildFormLayout(parameters);
    this.transferForm = this.adfFormBuilder.formDefinition(this.transferFormLayout.attributes);

    this.getAccreditAccountData(startupParameters.accountCredit);
    this.injectMask();
  }

  private getAccreditAccountData(accountAccredit: IAchAccount): void {
    this.accountAccredit = accountAccredit;
  }

  private nameFormatting(alias: string, account: string): string {
    return `${alias ?? account}`;
  }

  private accountListDebited(startupParameters: IATEInitForm) {
    const accountResponse = startupParameters?.accountDebitedList ?? [];

    if (accountResponse.hasOwnProperty('error')) {
      this.handleAccountsError(accountResponse as IFlowError);
      return;
    }

    this.accountDebitList = accountResponse as IAccount[];

    const debitAccountOptions: IDataSelect = {
      controlName: AttributeFormTransferAch.ACCOUNT_DEBITED,
      data: this.selectFormatting(this.accountDebitList)
    };

    this.optionList.push(debitAccountOptions);
  }

  private accountListCredit(startupParameters: IATEInitForm) {
    const accountResponse = (startupParameters?.accountCreditList ?? []);

    if (accountResponse.hasOwnProperty('error')) {
      this.handleAccountsError(accountResponse as IFlowError);
      return;
    }

    this.accountAccreditList = accountResponse as IAchAccount[];

    const creditAccountOptions: IDataSelect = {
      controlName: AttributeFormTransferAch.ACCOUNT_CREDIT_NAME,
      data: this.selectFormatting(this.accountAccreditList as any)
    };

    this.optionList.push(creditAccountOptions);
  }

  private hourListOptions() {
    this.optionList.push({
      controlName: AttributeFormTransferAch.HOUR,
      data: [],
    });
  }

  private accountDebitFilter(startupParameters: IATEInitForm) {
    const accountResponse = startupParameters?.accountDebitedList ?? [];


    if (accountResponse.hasOwnProperty('error')) {
      this.handleAccountsError(accountResponse as IFlowError);
      return;
    }

    const accountsDebitedTemp = accountResponse as IAccount[] ?? [];


    accountsDebitedTemp.forEach(account => {
      if (this.accountAccredit?.currencyCode === account?.currency) {
        this.accountDebitList.push(account);
      }
    });

    const debitedAccountOptions: IDataSelect = {
      controlName: AttributeFormTransferAch.ACCOUNT_DEBITED,
      data: this.selectFormatting(this.accountDebitList)
    };


    this.optionList.push(debitedAccountOptions);
  }


  private changeAccountDebitedResponse(accountSelected?: IAccount) {
    return {
      transferFormLayout: this.transferFormLayout,
      accountDebited: accountSelected ?? null,
    } as IATEChangeDebitedAccountResponse;
  }

  private handleAccountsError(errorResponse: IFlowError) {
    this.catchErrorList = [...this.catchErrorList, errorResponse];
  }

  private selectFormatting(accountList: IAccount[]): IPossibleValue[] {
    if (accountList && accountList.length === 0) {
      return [];
    }

    return accountList.map((account) => {
      const accountTemp: IPossibleValue = {
        value: account.account,
        name: `${this.nameFormatting(account?.alias, account?.account)}`,
      };
      return accountTemp;
    });
  }

  private injectMask() {
    const currency = this.util.getCurrencySymbolToIso(this.accountAccredit?.currency ?? 'L') ?? 'L';
    const currencyMask = this.util.getAmountMask(currency);

    if (this.transferFormLayout){
      for (const attribute of this.transferFormLayout.attributes) {
        if (attribute.controlName === AttributeFormTransferAch.AMOUNT) {
          attribute.imaskOptions = currencyMask;
          attribute.placeholder = `${currency} 0.00`;
        }
      }
    }
  }
}
