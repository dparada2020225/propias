import {
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
import { AttributeDonation } from '../../enum/donation-transfer-control-name.enum';
import { IDonationAccount } from '../../interfaces/donation-account.interface';
import { IDTDFormRequest } from '../../interfaces/donation-definition.interface';

@Injectable({
  providedIn: 'root',
})
export class DtdTransferFormService {

  builderDonationLayout(form: IDTDFormRequest): ILayout {
    let layoutDonationAttributes: ILayoutAttribute[] = [];

    const ILayoutFormAccount = new FormValidationsBuilder().required(true).build();

    const attributesAccountDebited = new LayoutAttributeBuilder()
      .label('debit-from')
      .placeholder('select-your-account-debit')
      .class('grid-item-x-6')
      .controlName(AttributeDonation.ACCOUNT_DEBITED)
      .layoutType(LayoutType.SELECT)
      .formValidations(ILayoutFormAccount)
      .build();

    const formAccountCreddit = new FormValidationsBuilder().required(true).build();

    const attributesAccountCredit = new LayoutAttributeBuilder()
      .label('donation-to')
      .placeholder('select-donation-account')
      .class('grid-item-x-6 test')
      .controlName(AttributeDonation.FUNDATION_ACCOUNT)
      .formValidations(formAccountCreddit)
      .layoutType(LayoutType.SELECT)
      .build();

    const formAmount = new FormValidationsBuilder().required(true).build();

    const attributesAmount = new LayoutAttributeBuilder()
      .label('amount_to_be_debited')
      .placeholder('amount_to_be_debited')
      .class('amount')
      .controlName(AttributeDonation.AMOUNT)
      .layoutType(LayoutType.INPUT)
      .formValidations(formAmount)
      .build();

    layoutDonationAttributes.push(attributesAccountDebited);
    layoutDonationAttributes.push(attributesAccountCredit);
    layoutDonationAttributes.push(attributesAmount);

    return new LayoutBuilder()
      .title(form.title)
      .subtitle(form.subtitle)
      .class('container-form padding-side donations-container-form')
      .attributes(layoutDonationAttributes)
      .build();
  }


  buildLayoutSelectFundationAccount(account: IDonationAccount) {
    const accountCreditDataSelect: IDataLayoutSelect[] = [];

    const accountCreditNameData = new DataLayoutSelectBuilder()
      .label('account-name')
      .value(account?.name ?? '')
      .build();

    accountCreditDataSelect.push(accountCreditNameData);

    return accountCreditDataSelect;
  }
}
