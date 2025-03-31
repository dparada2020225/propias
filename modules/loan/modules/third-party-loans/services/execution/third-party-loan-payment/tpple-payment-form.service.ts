import { AdfFormBuilderService, IDataSelect, ILayout, IPossibleValue } from '@adf/components';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IAccount } from '../../../../../../../models/account.inteface';
import { IFlowError } from '../../../../../../../models/error.interface';
import { UtilWorkFlowService } from '../../../../../../../service/common/util-work-flow.service';
import { UtilService } from '../../../../../../../service/common/util.service';
import paymentMethodJson from '../../../data/payment-method.json';
import { OwnThirdPartyLoansTypeProduct } from '../../../enum/own-third-party-loans-control-name.enum';
import { AttributeFormThirdPartyLoansCrud } from '../../../enum/third-party-loans-control-name.enum';
import {
  ITPLPEReturnValues,
  ITPLPESourceAccountSelectedChangeResponse,
  ITPLPEStartupParameters
} from '../../../interfaces/tplpe-form.interface';
import { TpldPaymentManagerService } from '../../definition/payment/tpld-payment-manager.service';

@Injectable({
  providedIn: 'root'
})
export class TpplePaymentFormService {
  private selectForm!: FormGroup;
  private selectFormLayout!: ILayout;
  private partialAmountForm!: FormGroup;
  private selectOptionList: IDataSelect[] = [];
  private errorSourceAccount: string | null = null;
  private sourceAccounts: IAccount[] = [];

  constructor(
    private thirdPartyPaymentDefinitionManager: TpldPaymentManagerService,
    private adfFormBuilder: AdfFormBuilderService,
    private utils: UtilService,
    private utilWorkFlow: UtilWorkFlowService,
  ) {
  }

  formScreenBuilder(startupParameters: ITPLPEStartupParameters) {
    this.clear();

    this.buildSelectForm();
    this.buildPartialAmountForm();
    this.buildSourceAccountSelectOptions(startupParameters);
    this.buildPaymentMethodSelectOptions();

    return this.responseFormScreenBuilder();
  }

  changeAccountDebited(accountNumber: string) {
    const accountSelected = this.sourceAccounts.find((account) => account.account === accountNumber);

    if (!accountSelected) {
      this.utils.removeLayoutSelect(this.selectFormLayout, AttributeFormThirdPartyLoansCrud.NUMBER_ACCOUNT);
      return;
    }

    this.selectFormLayout.attributes.forEach((attribute) => {
      if (attribute.controlName === AttributeFormThirdPartyLoansCrud.NUMBER_ACCOUNT) {
        attribute.layoutSelect = this.utilWorkFlow.buildAccountResumeAttributeForSelectAccounts(accountSelected);
      }
    });

    return this.changeSourceAccountResponse(accountSelected);
  }

  private changeSourceAccountResponse(sourceAccount?: IAccount): ITPLPESourceAccountSelectedChangeResponse {
    return {
      sourceAccount: sourceAccount ?? null,
    };
  }

  private clear() {
    this.selectOptionList = [];
  }

  private responseFormScreenBuilder() {
    return {
      selectForm: this.selectForm,
      partialAmountForm: this.partialAmountForm,
      options: this.selectOptionList,
      selectFormLayout: this.selectFormLayout,
    } as ITPLPEReturnValues;
  }

  private buildSelectForm() {
    this.selectFormLayout = this.thirdPartyPaymentDefinitionManager.buildFormLayout();
    this.selectForm = this.adfFormBuilder.formDefinition(this.selectFormLayout.attributes);
  }

  private buildPartialAmountForm() {
    this.partialAmountForm = new FormGroup({
      inputAmount: new FormControl('', {
        validators: [Validators.required]
      })
    });
  }

  private buildSourceAccountSelectOptions(startupParameters: ITPLPEStartupParameters) {
    const { sourceAccounts, currentLoanToPayment } = startupParameters ?? {};

    if ((sourceAccounts as IFlowError)?.hasOwnProperty('error')) {
      this.errorSourceAccount = (sourceAccounts as IFlowError).message;
      return;
    }

    const accountResponse: IAccount[] = sourceAccounts as IAccount[];
    this.sourceAccounts = accountResponse;

    const filterByProduct = this.filterSourceAccount(accountResponse, 'product', OwnThirdPartyLoansTypeProduct.PRODUCT, false);
    const filterByCurrency = this.filterSourceAccount(filterByProduct, 'currency', `${currentLoanToPayment?.currencyCode}`, true);

    const sourceAccountOptions: IPossibleValue[] = filterByCurrency.map((account) => ({
      name: this.validateNameForSourceAccountOptions(account),
      value: account?.account,
    }));

    const option: IDataSelect = {
      controlName: AttributeFormThirdPartyLoansCrud.NUMBER_ACCOUNT,
      data: sourceAccountOptions,
    }

    this.selectOptionList = [...this.selectOptionList, {...option }];
  }

  private buildPaymentMethodSelectOptions() {
    this.selectOptionList = [...this.selectOptionList, {...paymentMethodJson }];
  }

  private validateNameForSourceAccountOptions(value: IAccount) {
    return (value?.alias ?? '').length > 0 ? value?.alias : value?.name;
  }

  private filterSourceAccount(sourceAccounts: IAccount[], keyToFilter: string, valueToMatch: string | number, isEqual: boolean) {
    if (!keyToFilter || !valueToMatch) {
      return sourceAccounts;
    }

    if (isEqual) {
      return sourceAccounts.filter((account) => account[keyToFilter] === valueToMatch);
    }

    return sourceAccounts.filter((account) => account[keyToFilter] !== valueToMatch);
  }


}
