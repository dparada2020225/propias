import {AdfFormBuilderService, IDataSelect, ILayout, IPossibleValue} from '@adf/components';
import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

import {IAccount} from 'src/app/models/account.inteface';
import {IFlowError} from 'src/app/models/error.interface';
import {UtilService} from 'src/app/service/common/util.service';
import {UtilWorkFlowService} from '../../../../../../service/common/util-work-flow.service';
import {IThirdTransfersAccounts} from '../../../../interface/transfer-data-interface';
import {AttributeThirdFormTransfer} from '../../enums/third-transfer-control-name.enum';
import {ITTDForm} from '../../interfaces/third-transfer-definition.interface';
import {
  ITTEChangeAccountDebitResponce,
  ITTEInitStep1Request,
  ITTEInitStep1Responce,
} from '../../interfaces/third-transfer-execution.interface';
import {ThirdTransferDefinitionService} from '../definition/third-transfer-definition.service';
import {TtdTransferManagerService} from '../definition/transaction/manager/ttd-transfer-manager.service';

@Injectable({
  providedIn: 'root',
})
export class TteTransferFormService {
  catchErrorList: IFlowError[] = [];
  accountDebitedList: IAccount[] = [];
  accountCreditList: IThirdTransfersAccounts[] = [];
  optionList: IDataSelect[] = [];
  accountCredit!: IThirdTransfersAccounts;
  thirdTransferLayout!: ILayout;
  thirdTransferForm!: FormGroup;
  isModify: boolean | undefined = false;

  constructor(
    private util: UtilService,
    private translateService: TranslateService,
    private thirdTransferManager: TtdTransferManagerService,
    private thirdTransferDefinition: ThirdTransferDefinitionService,
    private thirdFormBuilder: AdfFormBuilderService,
    private utilWorkFlow: UtilWorkFlowService
  ) {
  }

  formScreenBuilder(startupParameters: ITTEInitStep1Request): ITTEInitStep1Responce {
    this.clearDataInit();
    this.formDefinition(startupParameters);
    this.accountListCredit(startupParameters);

    this.isModify = startupParameters?.isModifyMode;

    if (startupParameters?.isModifyMode) {
      this.accountListDebited(startupParameters);
    } else {
      this.accountDebitFilter(startupParameters);
    }

    return this.responceFormScreenBuilder();
  }

  private clearDataInit(): void {
    this.catchErrorList = [];
    this.accountDebitedList = [];
    this.optionList = [];
  }

  private responceFormScreenBuilder(): ITTEInitStep1Responce {
    return {
      thirdTransferLayout: this.thirdTransferLayout,
      thirdTransferForm: this.thirdTransferForm,
      optionList: this.optionList,
      error: this.buildAlertForResolver() as never,
    };
  }

  private formDefinition(startupParameters: ITTEInitStep1Request): void {
    const form: ITTDForm = {
      title: startupParameters?.title,
      subtitle: startupParameters?.subtitle,
      isModifyMode: startupParameters?.isModifyMode ?? false,
      accountAccreditSelected: startupParameters?.accountCredit,
    };

    this.accountCredit = startupParameters?.accountCredit;

    this.thirdTransferLayout = this.thirdTransferManager.buildTransferFormStep1(form);
    this.thirdTransferForm = this.thirdFormBuilder.formDefinition(this.thirdTransferLayout.attributes);
    this.injectMask();
  }

  private injectMask() {
    const currency = this.accountCredit?.currency ?? 'L';
    const currencyMask = this.util.getAmountMask(currency);

    for (const element of this.thirdTransferLayout.attributes) {
      if (element.controlName === AttributeThirdFormTransfer.AMOUNT) {
        element.imaskOptions = currencyMask;
        element.placeholder = `${currency} 0.00`;
      }
    }
  }

  private accountDebitFilter(startupParameters: ITTEInitStep1Request): void {
    const accountsResponse = startupParameters?.accountDebitedList;

    if (accountsResponse.hasOwnProperty('error')) {
      this.handleAccountsError(accountsResponse as IFlowError);
      return;
    }
    const accountsDebitedTemp = (startupParameters?.accountDebitedList as IAccount[]) ?? [];

    accountsDebitedTemp.forEach((account) => {
      if (this.accountCredit?.currency === account?.currency) {
        this.accountDebitedList.push(account);
      }
    });

    const creditAccountOptions: IDataSelect = {
      controlName: AttributeThirdFormTransfer.ACCOUNT_DEBITED,
      data: this.selectFormatting(this.accountDebitedList),
    };

    this.optionList.push(creditAccountOptions);
  }

  private accountListCredit(startupParameters: ITTEInitStep1Request) {
    const accountResponse = startupParameters?.accountCreditList ?? [];

    if (accountResponse.hasOwnProperty('error')) {
      this.handleAccountsError(accountResponse as IFlowError);
      return;
    }

    this.accountCreditList = accountResponse as IThirdTransfersAccounts[];

    const creditAccountOptions: IDataSelect = {
      controlName: AttributeThirdFormTransfer.ACCOUNT_ACCREDIT,
      data: this.selectFormatting(this.accountCreditList as any),
    };

    this.optionList.push(creditAccountOptions);
  }

  private accountListDebited(startupParameters: ITTEInitStep1Request) {
    const accountResponse = startupParameters?.accountDebitedList ?? [];

    if (accountResponse.hasOwnProperty('error')) {
      this.handleAccountsError(accountResponse as IFlowError);
      return;
    }

    this.accountDebitedList = accountResponse as IAccount[];

    const debitAccountOptions: IDataSelect = {
      controlName: AttributeThirdFormTransfer.ACCOUNT_DEBITED,
      data: this.selectFormatting(this.accountDebitedList),
    };

    this.optionList.push(debitAccountOptions);
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

  changeAccountDebited(accountNumber: string): ITTEChangeAccountDebitResponce {
    const accountSelected = this.accountDebitedList.find((account) => account.account === accountNumber);

    if (!accountSelected) {
      return this.changeAccountDebitedResponse();
    }

    this.thirdTransferLayout.attributes.forEach((attribute) => {
      if (attribute.controlName === AttributeThirdFormTransfer.ACCOUNT_DEBITED) {
        attribute.layoutSelect = this.utilWorkFlow.buildAccountResumeAttributeForSelectAccounts(accountSelected);
      }
    });

    return this.changeAccountDebitedResponse(accountSelected);
  }

  handleChangeDebitOptions(account: IThirdTransfersAccounts) {
    const possibleValuesAccountsCredit: IPossibleValue[] = [];

    if (this.accountDebitedList.length === 0) {
      return;
    }

    this.accountDebitedList.forEach((accountToCredit) => {
      if (accountToCredit.account !== account.account && accountToCredit.currency === account.currency) {
        const accountCreditTemp: IPossibleValue = {
          value: accountToCredit.account,
          name: ` ${this.nameFormatting(accountToCredit?.name, accountToCredit?.account)}`,
        };

        possibleValuesAccountsCredit.push(accountCreditTemp);
      }
    });

    this.thirdTransferForm.get(AttributeThirdFormTransfer.ACCOUNT_DEBITED)?.reset('');
    this.thirdTransferForm.get(AttributeThirdFormTransfer.ACCOUNT_DEBITED)?.markAsTouched();

    this.util.removeLayoutSelect(this.thirdTransferLayout, AttributeThirdFormTransfer.ACCOUNT_DEBITED);

    this.optionList.forEach((option) => {
      if (AttributeThirdFormTransfer.ACCOUNT_DEBITED === option.controlName) {
        option.data = this.addPlaceholder(possibleValuesAccountsCredit);
      }
    });
  }

  changeAccountAccredit(accountNumber: string) {
    const accountSelected = this.accountCreditList.find((account) => account.account === accountNumber);

    if (!accountSelected) {
      return this.changeAccountAccreditResponse();
    }

    if (this.isModify) {
      this.handleChangeDebitOptions(accountSelected);
    }

    const product = accountSelected?.type ? Number(accountSelected?.type ?? 0) : Number(accountSelected?.product ?? 0);

    this.thirdTransferLayout.attributes.forEach((attribute) => {
      if (attribute.controlName === AttributeThirdFormTransfer.ACCOUNT_ACCREDIT_CURRENCY) {
        attribute.placeholder = this.util.getLabelCurrency(accountSelected?.currency ?? 'UNDEFINED');
      }

      if (attribute.controlName === AttributeThirdFormTransfer.ACCOUNT_ACCREDIT_TYPE) {
        attribute.placeholder = this.util.getLabelProduct(product);
      }

      if (attribute.controlName === AttributeThirdFormTransfer.ACCOUNT_ACCREDIT_ALIAS) {
        attribute.placeholder = accountSelected?.alias;
      }
    });

    return this.changeAccountAccreditResponse(accountSelected);
  }

  private addPlaceholder(newList: IPossibleValue[]): IPossibleValue[] {
    this.thirdTransferLayout.attributes.forEach((attribute) => {
      if (newList.length > 0 && attribute.controlName === AttributeThirdFormTransfer.ACCOUNT_DEBITED) {
        const placeholder: IPossibleValue = {
          name: attribute.placeholder,
          value: '',
        };

        newList = [placeholder, ...newList];
      }
    });

    return newList;
  }

  private changeAccountDebitedResponse(accountSelected?: IAccount): ITTEChangeAccountDebitResponce {
    return {
      thirdTransferLayout: this.thirdTransferLayout,
      accountDebited: accountSelected ?? undefined,
    };
  }

  private changeAccountAccreditResponse(accountSelected?: IThirdTransfersAccounts) {
    return {
      thirdTransferLayout: this.thirdTransferLayout,
      accountAccredit: accountSelected ?? undefined,
    };
  }
}
