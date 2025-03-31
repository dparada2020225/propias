import { Injectable } from '@angular/core';
import { IAccount } from '../../../../../../../models/account.inteface';
import { AdfFormatService, AttributeReadingBuilder, DataReadingBuilder, IGroupAttributes } from '@adf/components';
import { UtilService } from 'src/app/service/common/util.service';
import { IHeadingFile } from '../../../models/bulk-transfer.interface';

@Injectable({
  providedIn: 'root'
})
export class BtdConfirmService {

  constructor(
    private adfFormat: AdfFormatService,
    private util: UtilService,
  ) { }

  buildTransferLayoutVoucherSample(userAccount: IAccount , headingFile: IHeadingFile, title: string = 'transfers_other_banks', subtitle: string = 'upload_files') {
    const groupList: IGroupAttributes[] = [];

    const mainGroup: IGroupAttributes = {
      view: 'v-grid',
      attributes: []
    };

    const attributeAccountDebit = new AttributeReadingBuilder()
      .label('account_to_be_debited')
      .values([`${headingFile?.sourceAccount}`])
      .build();
    mainGroup.attributes.push(attributeAccountDebit);

    const attributeNameAccount = new AttributeReadingBuilder()
      .label('name_or_alias')
      .values([userAccount?.name])
      .build();
    mainGroup.attributes.push(attributeNameAccount);

    const attributeQuantityCredits = new AttributeReadingBuilder()
      .label('amount_credits')
      .values([`${headingFile?.credits}`])
      .build();
    mainGroup.attributes.push(attributeQuantityCredits);

    const attributeAmountCredits = new AttributeReadingBuilder()
      .label('amount_credit')
      .values([`${this.adfFormat.formatAmount(headingFile?.totalAmount)}`])
      .build();
    mainGroup.attributes.push(attributeAmountCredits);


    const attributeCurrency = new AttributeReadingBuilder()
      .label('currency')
      .values([this.util.getLabelCurrency(userAccount?.currency ?? 'UNDEFINED')])
      .build();
    mainGroup.attributes.push(attributeCurrency);

    groupList.push(mainGroup);

    return new DataReadingBuilder()
      .title(title)
      .subtitle(subtitle)
      .class('padding-side')
      .groupList(groupList)
      .build();

  }
}
