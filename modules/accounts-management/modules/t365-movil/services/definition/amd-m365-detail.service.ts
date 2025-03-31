import { Injectable } from '@angular/core';
import { AttributeReadingBuilder, DataReadingBuilder, IGroupAttributes } from '@adf/components';
import { IAM365VoucherParameters } from '../../interfaces/voucher.interface';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AmdM365DetailService {

  constructor(
    private translate: TranslateService,
  ) { }

  buildVoucherConfirmationLayout(parameters: IAM365VoucherParameters) {
    const { account  } = parameters;
    const {
      bankName,
      email,
      name,
      numberPhone,
      status,
    } = account;

    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const attributeBankName = new AttributeReadingBuilder()
      .label('account_credit_bank')
      .values([bankName])
      .build();
    groupGrid.attributes.push(attributeBankName);

    const attributeNumberPhone = new AttributeReadingBuilder()
      .label('m365:label_number_phone')
      .values([numberPhone])
      .build();
    groupGrid.attributes.push(attributeNumberPhone);

    const attributeName = new AttributeReadingBuilder()
      .label('ac:365_label_beneficiary_name')
      .values([name])
      .build();
    groupGrid.attributes.push(attributeName);

    if (status) {
      const statusRaw = `label_statu_${status.toUpperCase()}`
      const statusLabel = this.translate.instant(statusRaw).toUpperCase();

      const attributeStatus = new AttributeReadingBuilder()
        .label('status')
        .values([statusLabel])
        .build();
      groupGrid.attributes.push(attributeStatus);
    }

    if (email) {
      const attributeEmail = new AttributeReadingBuilder()
        .label('notify_toEmail')
        .values([email])
        .build();
      groupGrid.attributes.push(attributeEmail);
    }


    groupList.push(groupGrid);
    return new DataReadingBuilder()
      .groupList(groupList)
      .build();
  }
}
