import {Injectable} from '@angular/core';
import {
  AdfFormatService,
  AttributeReadingBuilder,
  DataReadingBuilder,
  IDataReading,
  IGroupAttributes
} from '@adf/components';
import {ICADDetailTransactionParameters} from '../../interfaces/consult-ach-definition.interface';
import {ICOTransactionCreditDetail} from '../../interfaces/navigate-parameters.interface';
import { UtilService } from '../../../../../../service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class CadDetailTransactionService {

  constructor(
    private util: UtilService,
    private format: AdfFormatService,
  ) { }

  buildDetailTransactionLayout(parameters: ICADDetailTransactionParameters, transactionCreditDetail?: ICOTransactionCreditDetail): IDataReading {
    const { detailTransaction, reference } = parameters ?? {};

    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-custom',
      attributes: []
    };


    const attributeReference = new AttributeReadingBuilder()
      .label('reference')
      .values([`${reference}`])
      .class('col-12 col-xl-6 list-to-column')
      .build();

    groupGrid.attributes.push(attributeReference);

    const date = this.format.getFormatDateTime(transactionCreditDetail?.creationDate as string);

    const attributeDate = new AttributeReadingBuilder()
      .label('date_time')
      .values([`${date.fullFormat}`])
      .class('col-12 col-xl-6 list-to-column')
      .build();
    groupGrid.attributes.push(attributeDate);

    const attributeAmountDebited = new AttributeReadingBuilder()
      .label('account-debited')
      .values([`${transactionCreditDetail?.debitAccount}`])
      .class('col-12 col-xl-6 list-to-column')
      .build();
    groupGrid.attributes.push(attributeAmountDebited);

    const attributeUser = new AttributeReadingBuilder()
      .label('user')
      .values([transactionCreditDetail?.user as string])
      .class('col-12 col-xl-6 list-to-column')
      .build();
    groupGrid.attributes.push(attributeUser);

    const attributeTypeTransaction = new AttributeReadingBuilder()
      .label('transaction_type')
      .values([detailTransaction?.transfer || ''])
      .class('col-12 col-xl-6 list-to-column')
      .build();

    groupGrid.attributes.push(attributeTypeTransaction);

    const attributeCurrency = new AttributeReadingBuilder()
      .label('currency')
      .values([this.util.getCurrencySymbolToIso(detailTransaction?.currency || '')])
      .class('col-12 col-xl-6 list-to-column')
      .build();

    groupGrid.attributes.push(attributeCurrency);


    groupList.push(groupGrid);

    return new DataReadingBuilder()
      .title('consult_operations_other_banks')
      .subtitle('transaction_detail')
      .class('padding-side')
      .groupList(groupList)
      .build();
  }
}
