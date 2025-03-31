import { AdfFormBuilderService, IDataSelect, ILayout, IPossibleValue } from '@adf/components';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EProfile } from 'src/app/enums/profile.enum';
import { IFlowError } from 'src/app/models/error.interface';
import { UtilService } from 'src/app/service/common/util.service';
import { environment } from 'src/environments/environment';
import { AttributeFormTransferOwn } from '../../enum/own-transfer-control-name.enum';
import { IOTDForm } from '../../interfaces/own-transfer-definition.interface';
import {
  IOTEChangeAccountCreditResponce,
  IOTEChangeAccountDebitedResponce,
  IOTEInitStep1Request,
  IOTEInitStep1Responce
} from '../../interfaces/own-transfer-execution.interface';
import { IOwnAccount } from '../../interfaces/own-transfer.interface';
import { OtdTransferHomeManagerService } from '../definition/manager/otd-transfer-home-manager.service';

@Injectable({
  providedIn: 'root',
})
export class OteTransferFormService {
  catchErrorList: IFlowError[] = [];
  accountDebitList: IOwnAccount[] = [];
  accountCreditList: IOwnAccount[] = [];
  optionsList: IDataSelect[] = [];

  layoutOwnTransfer!: ILayout;
  ownTransferForm!: FormGroup;
  profile:string = environment.profile

  constructor(
    private util: UtilService,
    private translateService: TranslateService,
    private formBuilderService: AdfFormBuilderService,
    private definitionServiceManager: OtdTransferHomeManagerService
  ) {}

  formScreenBuilder(startupParameters: IOTEInitStep1Request): IOTEInitStep1Responce {
    this.clearDataInit();
    this.formDefinition(startupParameters);
    this.accountListDebit(startupParameters);
    this.accountListCredit(startupParameters);

    return this.responceFormScreenBuilder();
  }

  private clearDataInit(): void {
    this.catchErrorList = [];
    this.accountDebitList = [];
    this.accountCreditList = [];
    this.optionsList = [];
  }

  private responceFormScreenBuilder(): IOTEInitStep1Responce {
    return {
      layoutOwnTransfer: this.layoutOwnTransfer,
      ownTransferForm: this.ownTransferForm,
      optionsList: this.optionsList,
      error: this.buildAlertForResolver() as never,
    };
  }

  private formDefinition(startupParameters: IOTEInitStep1Request) {
    const form: IOTDForm = {
      title: startupParameters?.title,
      subtitle: startupParameters?.subtitle,
    };

    this.layoutOwnTransfer = this.definitionServiceManager.builderOwnTransferLayoutStep1(form);
    this.ownTransferForm = this.formBuilderService.formDefinition(this.layoutOwnTransfer.attributes);

    if (environment.profile === EProfile.SALVADOR || EProfile.PANAMA) {
      this.injectMask('USD');
    } else {
      this.injectMask();
    }

  }

  private injectMask(selectedCurrency?: string): void {
    const currency = selectedCurrency ?? 'L';
    const mask = this.util.getAmountMask(currency);

    for (const element of this.layoutOwnTransfer.attributes) {
      if (element.controlName === AttributeFormTransferOwn.AMOUNT) {
        element.imaskOptions = mask;
        switch (this.profile) {
          case EProfile.PANAMA:
          case EProfile.SALVADOR:
          element.placeholder = `0.00`;

            break;
        case EProfile.HONDURAS:
          element.placeholder = `${currency} 0.00`;
          break;
          default:
            break;
        }
      }
    }
  }



  private accountListDebit(startupParameters: IOTEInitStep1Request): void {
    const accountsResponse = startupParameters?.accountDebitList;

    if (accountsResponse.hasOwnProperty('error')) {
      this.handleAccountsError(accountsResponse as IFlowError);
      return;
    }

    this.accountDebitList = accountsResponse as IOwnAccount[];

    const debitAccountOptions: IDataSelect = {
      controlName: AttributeFormTransferOwn.ACCOUNT_DEBITED,
      data: this.selectFormatting(this.accountDebitList),
    };

    this.optionsList.push(debitAccountOptions);
  }


  private accountListCredit(startupParameters: IOTEInitStep1Request): void {
    const accountsResponse = startupParameters?.accountCreditList;

    if (accountsResponse.hasOwnProperty('error')) {
      this.handleAccountsError(accountsResponse as IFlowError);
      return;
    }

    this.accountCreditList = accountsResponse as IOwnAccount[];

    const creditAccountOptions: IDataSelect = {
      controlName: AttributeFormTransferOwn.ACCOUNT_ACCREDIT,
      data: this.selectFormatting(this.accountCreditList),
    };

    this.optionsList.push(creditAccountOptions);
  }

  private selectFormatting(accountList: IOwnAccount[]): IPossibleValue[] {
    if (accountList && accountList.length === 0) return [];

    return accountList.map((account) => {
      const accountTemp: IPossibleValue = {
        value: account.account,
        name: `${this.nameFormatting(account?.alias, account?.account)}`,
      };
      return accountTemp;
    });
  }

  private nameFormatting(alias: string, account: string): string {
    return `${alias ?? account}`;
  }

  private handleAccountsError(errorResponse: IFlowError) {
    this.catchErrorList = [...this.catchErrorList, errorResponse];
  }

  private buildAlertForResolver(): string | undefined {
    return this.catchErrorList.reduce((txt: string, error: IFlowError) => {
      const translatedError = this.translateService.instant(error.message);
      return `${txt + translatedError}. `;
    }, '');
  }

  changeAccountDebited(account: string): IOTEChangeAccountDebitedResponce {
    const selectedAccount = this.accountDebitList.find((accountTemp) => accountTemp.account === account);

    if (!selectedAccount) return this.changeAccountDebitResponseBuilder();

    this.handleChangeDebitOptions(selectedAccount);

    this.layoutOwnTransfer.attributes.forEach((attribute) => {
      if (attribute.controlName === AttributeFormTransferOwn.ACCOUNT_DEBITED) {
        attribute.layoutSelect = this.definitionServiceManager.buildDebitedAccountSelectAttributesStep1(selectedAccount);
      } else if (attribute.controlName === AttributeFormTransferOwn.AMOUNT) {
        this.injectMask(selectedAccount?.currency);
      }
    });

    return this.changeAccountDebitResponseBuilder(selectedAccount);
  }

  private changeAccountDebitResponseBuilder(account?: IOwnAccount): IOTEChangeAccountDebitedResponce {
    return {
      accountDebitedSelected: account ?? undefined!,
      layoutOwnTransfer: this.layoutOwnTransfer,
      optionsList: this.optionsList,
    };
  }

  private handleChangeDebitOptions(account: IOwnAccount): void {
    const possibleValuesAccountsCredit: IPossibleValue[] = [];

    if (this.accountCreditList && this.accountCreditList.length === 0) {
      return;
    }

    this.accountCreditList.forEach((accountCredit) => {
      if (accountCredit.account !== account.account && accountCredit.currency === account.currency) {
        const accountCreditTemp: IPossibleValue = {
          value: accountCredit.account,
          name: ` ${this.nameFormatting(accountCredit?.alias, accountCredit?.account)}`,
        };

        possibleValuesAccountsCredit.push(accountCreditTemp);
      }
    });

    this.util.removeLayoutSelect(this.layoutOwnTransfer, AttributeFormTransferOwn.ACCOUNT_ACCREDIT);

    this.optionsList.forEach((option) => {
      if (AttributeFormTransferOwn.ACCOUNT_ACCREDIT === option.controlName) {
        option.data = this.addPlaceholder(possibleValuesAccountsCredit);
      }
    });
  }

  private addPlaceholder(newList: IPossibleValue[]): IPossibleValue[] {
    this.layoutOwnTransfer.attributes.forEach((attribute) => {
      if (newList.length > 0 && attribute.controlName === AttributeFormTransferOwn.ACCOUNT_ACCREDIT) {
        const placeholder: IPossibleValue = {
          name: attribute.placeholder,
          value: '',
        };

        newList = [placeholder, ...newList];
      }
    });

    return newList;
  }

  changeAccountAccredit(account?: string): IOTEChangeAccountCreditResponce {
    if (account) {
      let selectedAccount = this.accountCreditList.find((accountTemp) => accountTemp.account === account);

      if (!selectedAccount) return this.changeAccountCreditResponseBuilder();

      this.layoutOwnTransfer.attributes.forEach((attribute) => {
        if (attribute.controlName === AttributeFormTransferOwn.ACCOUNT_ACCREDIT) {
          attribute.layoutSelect = this.definitionServiceManager.buildCreditAccountSelectAttributesStep1(selectedAccount as never);
        }
      });

      return this.changeAccountCreditResponseBuilder(selectedAccount);
    } else {
      this.layoutOwnTransfer.attributes.forEach((attribute) => {
        if (attribute.controlName === AttributeFormTransferOwn.ACCOUNT_ACCREDIT) {
          attribute.layoutSelect = undefined;
        }
      });
      return this.changeAccountCreditResponseBuilder();
    }
  }

  private changeAccountCreditResponseBuilder(account?: IOwnAccount): IOTEChangeAccountCreditResponce {
    return {
      accountCreditSelected: account ?? undefined!,
      layoutOwnTransfer: this.layoutOwnTransfer,
      optionsList: this.optionsList,
    };
  }
}
