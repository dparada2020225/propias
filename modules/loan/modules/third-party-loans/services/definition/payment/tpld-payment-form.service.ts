import {
  AdfFormatService,
  DataLayoutSelectBuilder,
  FormValidationsBuilder,
  IDataLayoutSelect,
  ILayout,
  ILayoutAttribute,
  LayoutAttributeBuilder,
  LayoutBuilder,
  LayoutType
} from '@adf/components';
import { Injectable } from '@angular/core';
import { AttributeFormThirdPartyLoansCrud } from '../../../enum/third-party-loans-control-name.enum';
import { UtilService } from '../../../../../../../service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class TpldPaymentFormService {

  constructor(
    private util: UtilService,
    private formatService: AdfFormatService,

  ) { }


  //FORM SECTION WITH SELECTS
  buildFormLayout(): ILayout {

    const attributes: ILayoutAttribute[] = [];


    const debitFrom = new FormValidationsBuilder()
      .required(true)
      .build();

    const debitFromAttribute = new LayoutAttributeBuilder()
      .label('debit-from')
      .placeholder('select-account-debit')
      .controlName(AttributeFormThirdPartyLoansCrud.NUMBER_ACCOUNT)
      .layoutType(LayoutType.SELECT)
      .formValidations(debitFrom)
      .build();
    attributes.push(debitFromAttribute);

    const choseOptionPayment = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeChoseOptionPayment = new LayoutAttributeBuilder()
      .label('select_your_payment_option')
      .placeholder('select_a_payment_option')
      .class('grid-item-x-6 option-payment')
      .controlName(AttributeFormThirdPartyLoansCrud.PAYMENT_OPTION)
      .layoutType(LayoutType.SELECT)
      .formValidations(choseOptionPayment)
      .build();
    attributes.push(attributeChoseOptionPayment);

    const attributeCounter = new LayoutAttributeBuilder()
      .class('grid-item-x-4 quotas-payment')
      .controlName(AttributeFormThirdPartyLoansCrud.QUOTAS)
      .layoutType(LayoutType.INJECTABLE)
      .build();
    attributes.push(attributeCounter);

    return new LayoutBuilder()
      .class('padding-side')
      .attributes(attributes)
      .build();
  }


  //DATA ACCOUNT SELECTED
  buildDebitedAccountSelectAttributes(account: any): IDataLayoutSelect[] {

    const accountDebitedDataSelectList: IDataLayoutSelect[] = [];

    const accountNameDataSelect = new DataLayoutSelectBuilder()
      .label('account-name')
      .value(`${account.name}`)
      .build();

    const availableDataSelect = new DataLayoutSelectBuilder()
      .label('available')
      .class('debit-account-select select-debit-account')
      .value(`${account.currency} ${this.formatService.formatAmount(account.availableAmount)}`)
      .build();

    accountDebitedDataSelectList.push(accountNameDataSelect);
    accountDebitedDataSelectList.push(availableDataSelect);

    return accountDebitedDataSelectList;
  }


}
