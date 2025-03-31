import { Injectable } from '@angular/core';
import { ITableHeader, ITableStructure, TableHeaderBuilder, TableStructuredBuilder } from '@adf/components';
import { EAchTableKeys } from '../../../enum/ach-table-keys.enum';
import { IAchAccount } from '../../../interfaces/ach-account-interface';
import { TranslateService } from '@ngx-translate/core';
import { AtdUtilService } from '../../atd-util.service';
import { UtilService } from '../../../../../../../service/common/util.service';
import { TableOption } from '../../../../../interface/table.enum';


@Injectable({
  providedIn: 'root'
})
export class AtdTableAssociatesService {

  constructor(
    private util: UtilService,
    private translateService: TranslateService,
    private achUtil: AtdUtilService,
  ) { }

  builderAssociateAccountTableLayout(accountList: IAchAccount[], menuLicenses: string[]): ITableStructure {
    const associatedTableHeaders: ITableHeader[] = [];

    const headCurrency = new TableHeaderBuilder()
      .label('head_currency')
      .class('head-currency')
      .key('currencyCode')
      .build();
    associatedTableHeaders.push(headCurrency);

    const headAlias = new TableHeaderBuilder()
      .label('alias')
      .class('head-alias')
      .key('alias')
      .build();
    associatedTableHeaders.push(headAlias);

    const headAccountNumber = new TableHeaderBuilder()
      .label('account-number')
      .selected({ action: TableOption.TRANSFER })
      .class('head-account')
      .key('account')
      .build();
    associatedTableHeaders.push(headAccountNumber);

    const headTypeAccount = new TableHeaderBuilder()
      .label('type_account')
      .class('head-type-account')
      .key(EAchTableKeys.TYPE_ACCOUNT_DESCRIPTION)
      .build();
    associatedTableHeaders.push(headTypeAccount);

    const headBank = new TableHeaderBuilder()
      .label('account-bank')
      .key(EAchTableKeys.BANK_NAME)
      .build();
    associatedTableHeaders.push(headBank);

    const optionsAssociateTable: string[] = [];
    optionsAssociateTable.push(TableOption.UPDATE);
    optionsAssociateTable.push(TableOption.DELETE);
    optionsAssociateTable.push(TableOption.TRANSFER);

    const optionsLicenses = this.util.getTableOption(menuLicenses, optionsAssociateTable);
    optionsLicenses.unshift(TableOption.TRANSFER);

    const accounts = this.achUtil.parsedAccounts(accountList);

    return new TableStructuredBuilder()
      .title('label:table_ach_associated_accounts')
      .head(associatedTableHeaders)
      .options(optionsLicenses)
      .body([...accounts].sort(this.achUtil.compareAccountsToSort))
      .build();
  }
}
