import {Injectable} from '@angular/core';
import {IFlowError} from "../../../../../../models/error.interface";
import {IAccount} from "../../../../../../models/account.inteface";
import {IThirdTransfersAccounts} from "../../../../interface/transfer-data-interface";
import {AdfFormBuilderService, IDataSelect, ILayout, IPossibleValue} from "@adf/components";
import {FormGroup} from "@angular/forms";
import {UtilService} from "../../../../../../service/common/util.service";
import {TranslateService} from "@ngx-translate/core";
import {TtdTransferManagerService} from "../definition/transaction/manager/ttd-transfer-manager.service";
import {
  ITTEChangeAccountDebitResponce,
  ITTEInitStep1Request,
  ITTEInitStep1Responce
} from "../../interfaces/third-transfer-execution.interface";
import {ITTDForm} from "../../interfaces/third-transfer-definition.interface";
import {AttributeThirdFormTransfer} from "../../enums/third-transfer-control-name.enum";
import {UtilWorkFlowService} from "../../../../../../service/common/util-work-flow.service";

@Injectable({
  providedIn: 'root'
})
export class TteTransferFormBisvService {

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
    private thirdFormBuilder: AdfFormBuilderService,
    private utilWorkFlow: UtilWorkFlowService
  ) {
  }

  formScreenBuilderBisv(startupParameters: ITTEInitStep1Request): ITTEInitStep1Responce {
    this.clearDataInit();
    this.formDefinition(startupParameters);
    this.accountListCredit(startupParameters);
    this.accountListDebited(startupParameters);

    return this.responceFormScreenBuilder();
  }

  private clearDataInit(): void {
    this.catchErrorList = [];
    this.accountDebitedList = [];
    this.optionList = [];
    this.accountCreditList = []
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

    this.thirdTransferLayout = this.thirdTransferManager.buildTransferFormStep1(form);
    this.thirdTransferForm = this.thirdFormBuilder.formDefinition(this.thirdTransferLayout.attributes);
    this.injectMask();
  }

  private injectMask() {
    const currencyMask = this.util.getAmountMask('USD');

    for (const element of this.thirdTransferLayout.attributes) {
      if (element.controlName === AttributeThirdFormTransfer.AMOUNT) {
        element.imaskOptions = currencyMask;
        element.placeholder = `0.00`;
      }
    }
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

    const accountsDebitedTemp = (accountResponse as IAccount[]) ?? [];

    accountsDebitedTemp.forEach((account) => {
      if ("USD" === account?.currency) {
        this.accountDebitedList.push(account);
      }
    });

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

    return this.changeAccountDebitedResponse(accountSelected);
  }

  private changeAccountDebitedResponse(accountSelected?: IAccount): ITTEChangeAccountDebitResponce {
    return {
      thirdTransferLayout: this.thirdTransferLayout,
      accountDebited: accountSelected ?? undefined,
    };
  }

  changeAccountAccredit(accountNumber: string) {
    const accountSelected = this.accountCreditList.find((account) => account.account === accountNumber);

    if (!accountSelected) {
      return this.changeAccountAccreditResponse();
    }


    return this.changeAccountAccreditResponse(accountSelected);
  }

  private changeAccountAccreditResponse(accountSelected?: IThirdTransfersAccounts) {
    return {
      thirdTransferLayout: this.thirdTransferLayout,
      accountAccredit: accountSelected ?? undefined,
    };
  }

}
