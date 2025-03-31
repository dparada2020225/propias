import { AdfFormBuilderService, IDataSelect, ILayout, IPossibleValue } from '@adf/components';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IFlowError } from '../../../../../../models/error.interface';
import { AttributeDonation } from '../../enum/donation-transfer-control-name.enum';
import { IDonationAccount } from '../../interfaces/donation-account.interface';
import { IDTDFormRequest } from '../../interfaces/donation-definition.interface';
import { IDTEInitStep1, IDTEInitStep1Response } from '../../interfaces/donation-execution.interface';
import { DtdTransferManagerService } from '../definition/dtd-transfer-manager.service';
import { TranslateService } from '@ngx-translate/core';
import { IAccount } from 'src/app/models/account.inteface';
import { UtilService } from 'src/app/service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class DteDonationFormService {

  accountFundationList: IDonationAccount[] = [];
  accountDebitList: IAccount[] = [];
  catchErrorList: IFlowError[] = [];
  optionsList: IDataSelect[] = [];

  donationLayout: ILayout | undefined = undefined;
  donationLayoutForm: FormGroup | null = null;

  constructor(
    private util: UtilService,
    private definitionServiceManager: DtdTransferManagerService,
    private formBuilderService: AdfFormBuilderService,
    private translateService: TranslateService,
  ) { }

  formScreenBuilder(startupParameters: IDTEInitStep1) {
    this.clearDataInit();
    this.formDefinition(startupParameters);
    this.accountListDebit(startupParameters);
    this.accountListFundation(startupParameters);

    return this.responseFormScreenBuilder()
  }

  private clearDataInit(): void {
    this.accountFundationList = [];
    this.accountDebitList = [];
    this.catchErrorList = [];
    this.optionsList = [];
  }

  private formDefinition(startupParameters: IDTEInitStep1) {
    const form: IDTDFormRequest = {
      title: startupParameters?.title,
      subtitle: startupParameters?.subtitle as string,
    }

    this.donationLayout = this.definitionServiceManager.builderDonationLayoutStep1(form);
    this.donationLayoutForm = this.formBuilderService.formDefinition(this.donationLayout.attributes);
    this.injectMask();
  }

  private responseFormScreenBuilder() {
    return {
      donationLayout: this.donationLayout,
      donationTransferForm: this.donationLayoutForm,
      optionsList: this.optionsList,
      error: this.buildAlertForResolver(),

    } as IDTEInitStep1Response
  }


  private buildAlertForResolver(): string | undefined {
    const baseError = this.translateService.instant('errorB2b:resolveError')
    const error = this.catchErrorList.reduce((txt: string, error: IFlowError) => {
      const translatedError = this.translateService.instant(error?.message ?? '')
      return `${txt + translatedError}. `
    }, '');
    return error ? `${baseError} ${error}` : undefined;
  }


  private accountListDebit(startupParameters: IDTEInitStep1): void {
    const accountsResponse = startupParameters?.accountDebitList;

    if (accountsResponse.hasOwnProperty('error')) {
      this.handleAccountsError(accountsResponse as IFlowError);
      return;
    }

    this.accountDebitList = accountsResponse as IAccount[];

    const debitAccountOptions: IDataSelect = {
      controlName: AttributeDonation.ACCOUNT_DEBITED,
      data: this.selectFormatting(this.accountDebitList)
    };

    this.optionsList.push(debitAccountOptions);
  }

  private accountListFundation(startupParameters: IDTEInitStep1): void {
    const accountsResponse = startupParameters?.accountFundationList;

    if (accountsResponse.hasOwnProperty('error')) {
      this.handleAccountsError(accountsResponse as IFlowError)
      return;
    }

    this.accountFundationList = accountsResponse as IDonationAccount[];

    const fundationAccountOptions: IDataSelect = {
      controlName: AttributeDonation.FUNDATION_ACCOUNT,
      data: this.selectFormatting(this.accountFundationList)
    };

    this.optionsList.push(fundationAccountOptions);
  }

  changeAccountDebited(account: string): ILayout | undefined{
    const selectedAccount = this.accountDebitList.find(
      (accountTemp) => accountTemp.account === account
    );

    if (!selectedAccount)  return;

    this.handleChangeDebitOptions(selectedAccount);


    this.donationLayout?.attributes.forEach((attribute) => {
      if (attribute.controlName === AttributeDonation.ACCOUNT_DEBITED) {
        attribute.layoutSelect = this.definitionServiceManager.buildDebitedAccountSelectAttributesStep1(selectedAccount);
      }
    });
    return this.donationLayout;
  }

  handleChangeDebitOptions(account: IAccount) {
    const possibleValuesAccountsCredit: IPossibleValue[] = [];

    if (this.accountFundationList.length === 0) { return; }

    this.accountFundationList.forEach((accountCredit) => {

      if (accountCredit.account !== account.account && accountCredit.currency === account.currency) {

        const accountCreditTemp: IPossibleValue = {
          value: accountCredit.account,
          name: ` ${this.nameFormatting(accountCredit?.name, accountCredit?.account)}`,
        };

        possibleValuesAccountsCredit.push(accountCreditTemp);
      }
    });

    this.util.removeLayoutSelect(this.donationLayout as never, AttributeDonation.FUNDATION_ACCOUNT);

    this.optionsList.forEach(option => {
      if (AttributeDonation.FUNDATION_ACCOUNT === option.controlName) {
        option.data = this.addPlaceholder(possibleValuesAccountsCredit);
      }
    });
  }

  private addPlaceholder(newList: IPossibleValue[]): IPossibleValue[] {
    this.donationLayout?.attributes.map(attribute => {
      if (newList.length > 0 && attribute.controlName === AttributeDonation.FUNDATION_ACCOUNT) {
        const placeholder: IPossibleValue = {
          name: attribute.placeholder,
          value: ''
        };

        newList = [placeholder, ...newList];
      }
    });

    return newList;
  }

  changeAccountFundation(account?: string): ILayout | undefined {
    const selectedAccount = this.accountFundationList.find(
      (accountTemp) => accountTemp.account === account
    );

    if (!selectedAccount) return;


    this.donationLayout?.attributes.forEach((attribute) => {
      if (attribute.controlName === AttributeDonation.FUNDATION_ACCOUNT) {
        attribute.layoutSelect = this.definitionServiceManager.buildFundationAccountSelectAttributesStep1(selectedAccount);
      }
    });

    return this.donationLayout;
  }


  private injectMask(selectedCurrency?: string): void {
    const currency = selectedCurrency ?? 'L';
    const mask = this.util.getAmountMask(currency);

    if(this.donationLayout) {
      for (const element of this.donationLayout.attributes) {
        if (element.controlName === AttributeDonation.AMOUNT) {
          element.imaskOptions = mask;
          element.placeholder = `${currency} 0.00`;
          break;
        }
      }
    }
  }

  private handleAccountsError(errorResponse: IFlowError) {
    this.catchErrorList = [...this.catchErrorList, errorResponse];
  }

  private selectFormatting<Account = any>(accountList: Account[]): IPossibleValue[] {
    if (accountList && accountList.length === 0) return [];

    return accountList.map((account: any) => {
      const accountTemp: IPossibleValue = {
        value: account.account,
        name: `${this.nameFormatting(account?.alias, account?.name)}`,
      };
      return accountTemp;
    });
  }

  private nameFormatting(alias: string, account: string): string {
    return `${alias ?? account}`;
  }
}
