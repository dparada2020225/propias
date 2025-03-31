import { Injectable } from '@angular/core';
import {
  AttributeReadingBuilder,
  DataReadingBuilder,
  IGroupAttributes
} from '@adf/components';
import { I365VoucherConfirmationLayoutParameters } from '../../interfaces/voucher-definition.interface';
import { UtilService } from '../../../../../../service/common/util.service';
import { Product } from '../../../../../../enums/product.enum';

@Injectable({
  providedIn: 'root'
})
export class T365dVoucherService {

  constructor(
    private utils: UtilService,
  ) { }

  buildVoucherConfirmationLayout(parameters: I365VoucherConfirmationLayoutParameters) {
    const { formValues, sourceAccountSelected, targetAccountSelected, bankSelected } = parameters;
    const { amount, comment } = formValues;

    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };


    const sourceAccountProductAcronym = this.utils.getProductAcronym(sourceAccountSelected.product);
    const sourceAccountData = `${sourceAccountProductAcronym} - ${sourceAccountSelected.account}`;

    const attributeSourceAccount = new AttributeReadingBuilder()
      .label('ach:bisv:label_source_account')
      .values([sourceAccountData])
      .build();
    groupGrid.attributes.push(attributeSourceAccount);

    const attributeSourceAccountName = new AttributeReadingBuilder()
      .label('accountName')
      .values([sourceAccountSelected.name])
      .build();
    groupGrid.attributes.push(attributeSourceAccountName);

    const attributeAmount = new AttributeReadingBuilder()
      .label('amount')
      .values([`${sourceAccountSelected.currency} ${this.utils.formatAmount(amount)}`])
      .build();
    groupGrid.attributes.push(attributeAmount);

    const attributeBankName = new AttributeReadingBuilder()
      .label('ach:bisv:label_bank')
      .values([bankSelected.description])
      .build();
    groupGrid.attributes.push(attributeBankName);

    const attributeTargetAccount = new AttributeReadingBuilder()
      .label('account_credit_name')
      .values([targetAccountSelected.account])
      .build();
    groupGrid.attributes.push(attributeTargetAccount);

    const productName = this.utils.getLabelProduct(Number(Product[targetAccountSelected.type])).toUpperCase();
    const attributeTargetAccountProduct = new AttributeReadingBuilder()
      .label('ach:bisv:label_type_account')
      .values([productName])
      .build();
    groupGrid.attributes.push(attributeTargetAccountProduct);

    const attributeComment = new AttributeReadingBuilder()
      .label('comment')
      .values([comment])
      .build();
    groupGrid.attributes.push(attributeComment);


    groupList.push(groupGrid);
    return new DataReadingBuilder()
      .groupList(groupList)
      .build();
  }
}
