import { Injectable } from '@angular/core';
import { IBulkTransferVoucherDefinitionParameters } from '../../../interfaces/btd-voucher.interface';
import { AdfFormatService, AttributeReadingBuilder, DataReadingBuilder, IGroupAttributes } from '@adf/components';
import { UtilService } from 'src/app/service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class BtdVoucherService {

  constructor(
    private adfFormat: AdfFormatService,
    private util: UtilService,
  ) { }

  buildTransferLayoutVoucherConfirmation(parameters: IBulkTransferVoucherDefinitionParameters) {
    const { currentFile, reference, datetime, sourceAccount }  = parameters ?? {};
    const { heading } = currentFile ?? {};

    const groupList: IGroupAttributes[] = [];

    const mainGroup: IGroupAttributes = {
      view: 'v-custom',
      attributes: []
    };
    const attributeReference = new AttributeReadingBuilder()
      .label('reference')
      .values([reference ?? 'UNDEFINED'])
      .build();
    mainGroup.attributes.push(attributeReference);


    const attributeDate = new AttributeReadingBuilder()
      .label('date_and_time')
      .values([this.adfFormat.getFormatDateTime(datetime).fullFormat])
      .build();
    mainGroup.attributes.push(attributeDate);

    const attributeAccountDebit = new AttributeReadingBuilder()
      .label('account-debited')
      .values([sourceAccount?.account])
      .build();
    mainGroup.attributes.push(attributeAccountDebit);



    const attributeNameAccount = new AttributeReadingBuilder()
      .label('name_or_alias')
      .values([sourceAccount?.name ?? 'UNDEFINED'])
      .build();
    mainGroup.attributes.push(attributeNameAccount);

    const attributeQuantityCredits = new AttributeReadingBuilder()
      .label('amount_credits')
      .values([`${heading?.credits ?? 'UNDEFINED'}`])
      .build();
    mainGroup.attributes.push(attributeQuantityCredits);

    const attributeAmountCredits = new AttributeReadingBuilder()
      .label('amount_credit')
      .values([`${this.adfFormat.formatAmount(heading?.totalAmount)}`])
      .build();
    mainGroup.attributes.push(attributeAmountCredits);

    const attributeCurrency = new AttributeReadingBuilder()
      .label('currency')
      .values([this.util.getLabelCurrency(sourceAccount?.currency ?? 'UNDEFINED')])
      .build();
    mainGroup.attributes.push(attributeCurrency);
    groupList.push(mainGroup);

    return new DataReadingBuilder()
      .title(parameters?.tittle || 'transfers_other_banks')
      .subtitle(parameters?.subtitle || 'upload_files')
      .class('padding-side')
      .groupList(groupList)
      .build();
  }
}
