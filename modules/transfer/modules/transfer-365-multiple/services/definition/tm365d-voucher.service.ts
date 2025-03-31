import { Injectable } from '@angular/core';
import {
  AttributeReadingBuilder,
  DataReadingBuilder,
  IGroupAttributes,
  ITableHeader,
  ITableStructure, TableHeaderBuilder, TableStructuredBuilder
} from '@adf/components';
import { ITM365VoucherParameters } from '../../interfaces/voucher-definition.interface';
import { ITM365AchAccount, ITM365TableDefinitionParameters, ITM365TableKeys } from '../../interfaces/table.interface';
import { UtilService } from '../../../../../../service/common/util.service';
import { TranslateService } from '@ngx-translate/core';
import { ITM365FileLoadedList } from '../../interfaces/load-file.interface';

@Injectable({
  providedIn: 'root'
})
export class Tm365dVoucherService {

  constructor(
    private utils: UtilService,
    private translate: TranslateService,
  ) {
  }

  buildVoucherConfirmationLayout(parameters: ITM365VoucherParameters) {
    const { sourceAccount} = parameters;

    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const attributeSourceAccount = new AttributeReadingBuilder()
      .label('ach:bisv:label_source_account')
      .values([sourceAccount.account])
      .build();
    groupGrid.attributes.push(attributeSourceAccount);

    const attributeSourceAccountName = new AttributeReadingBuilder()
      .label('accountName')
      .values([sourceAccount.name])
      .build();
    groupGrid.attributes.push(attributeSourceAccountName);

    groupList.push(groupGrid);
    return new DataReadingBuilder()
      .groupList(groupList)
      .build();
  }

  buildTableLayout(parameters: ITM365TableDefinitionParameters): ITableStructure {
    const { accounts } = parameters;
    const tm365TableHeaders: ITableHeader[] = [];

    const headerBankName = new TableHeaderBuilder()
      .label('ach:bisv:label_bank')
      .key(ITM365TableKeys.BANK)
      .build();
    tm365TableHeaders.push(headerBankName);

    const headerProductName = new TableHeaderBuilder()
      .label('product')
      .key(ITM365TableKeys.PRODUCT)
      .build();
    tm365TableHeaders.push(headerProductName);

    const headerCurrency = new TableHeaderBuilder()
      .label('currency')
      .key(ITM365TableKeys.CURRENCY)
      .isActive(true)
      .build();
    tm365TableHeaders.push(headerCurrency);

    const headerAccount = new TableHeaderBuilder()
      .label('account-number')
      .key(ITM365TableKeys.ACCOUNT)
      .build();
    tm365TableHeaders.push(headerAccount);

    const headerTypePerson = new TableHeaderBuilder()
      .label('tm365:label_type_person')
      .key(ITM365TableKeys.TYPE_PERSON)
      .build();
    tm365TableHeaders.push(headerTypePerson);

    const headerAmount = new TableHeaderBuilder()
      .label('amount')
      .key(ITM365TableKeys.AMOUNT)
      .isActive(true)
      .build();
    tm365TableHeaders.push(headerAmount);

    const headerEmail = new TableHeaderBuilder()
      .label('tm365:label_email')
      .key(ITM365TableKeys.EMAIL)
      .build();
    tm365TableHeaders.push(headerEmail);

    const headerComment = new TableHeaderBuilder()
      .label('comment')
      .key(ITM365TableKeys.COMMENT)
      .build();
    tm365TableHeaders.push(headerComment);


    return new TableStructuredBuilder()
      .head(tm365TableHeaders)
      .body(accounts)
      .build();
  }


}
