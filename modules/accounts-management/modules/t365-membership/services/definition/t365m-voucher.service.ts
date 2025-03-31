import { Injectable } from '@angular/core';
import { AttributeReadingBuilder, DataReadingBuilder, IGroupAttributes } from '@adf/components';
import { IT365MVoucherParameters } from '../../interfaces/voucher.interface';
import { UtilService } from '../../../../../../service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class T365mVoucherService {

  constructor(
    private utils: UtilService,
  ) { }

  buildVoucherDefinition(parameters: IT365MVoucherParameters) {
    const { account, email, formValues  } = parameters;

    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const productLabel = this.utils.getLabelProduct(account.product);
    const attributeAccountType = new AttributeReadingBuilder()
      .label('type_account')
      .values([productLabel.toUpperCase()])
      .build();
    groupGrid.attributes.push(attributeAccountType);

    const attributeCurrency = new AttributeReadingBuilder()
      .label('currency')
      .values([account.currency])
      .build();
    groupGrid.attributes.push(attributeCurrency);

    const attributeStatus = new AttributeReadingBuilder()
      .label('status')
      .values([account.status.toUpperCase()])
      .build();
    groupGrid.attributes.push(attributeStatus);

    const attributeAccountNumber = new AttributeReadingBuilder()
      .label('no_account')
      .values([account.account])
      .build();
    groupGrid.attributes.push(attributeAccountNumber);

    const attributeNameAccount = new AttributeReadingBuilder()
      .label('b2b-name')
      .values([account.name])
      .build();
    groupGrid.attributes.push(attributeNameAccount);

    const attributeEmail = new AttributeReadingBuilder()
      .label('email')
      .values([email])
      .build();
    groupGrid.attributes.push(attributeEmail);

    const attributePhoneNumber = new AttributeReadingBuilder()
      .label('ac:365membership:label_number_phone')
      .values([formValues.numberPhone])
      .build();
    groupGrid.attributes.push(attributePhoneNumber);

    groupList.push(groupGrid);
    return new DataReadingBuilder()
      .groupList(groupList)
      .build();
  }
}
