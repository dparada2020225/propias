import { Injectable } from '@angular/core';
import {
  ITableHeader,
  ITableStructure,
  TableHeaderBuilder,
  TableStructuredBuilder
} from '@adf/components';
import { EAchTableKeys } from '../../../enum/ach-table-keys.enum';
import { IAchAccount } from '../../../interfaces/ach-account-interface';
import { AtdUtilService } from '../../atd-util.service';
import { UtilService } from 'src/app/service/common/util.service';
import { TableOption } from '../../../../../interface/table.enum';


@Injectable({
  providedIn: 'root'
})
export class AtdTableFavoritesService {

  constructor(
    private util: UtilService,
    private achUtil: AtdUtilService,
  ) { }

  builderFavoriteAccountTableLayout(accounts: IAchAccount[], menuLicenses: string[]): ITableStructure {
    const favoriteTableHeaders: ITableHeader[] = [];

    const headCurrency = new TableHeaderBuilder()
      .label('head_currency')
      .isActive(true)
      .key(EAchTableKeys.CURRENCY)
      .build();
    favoriteTableHeaders.push(headCurrency);

    const headAlias = new TableHeaderBuilder()
      .label('alias')
      .key('alias')
      .build();
    favoriteTableHeaders.push(headAlias);

    const headAccountNumber = new TableHeaderBuilder()
      .label('account-number')
      .key(EAchTableKeys.NO_ACCOUNT)
      .selected({ action: TableOption.TRANSFER })
      .build();
    favoriteTableHeaders.push(headAccountNumber);

    const headTypeAccount = new TableHeaderBuilder()
      .label('type_account')
      .key(EAchTableKeys.TYPE_ACCOUNT_DESCRIPTION)
      .build();
    favoriteTableHeaders.push(headTypeAccount);

    const headBank = new TableHeaderBuilder()
      .label('account-bank')
      .key(EAchTableKeys.BANK_NAME)
      .build();
    favoriteTableHeaders.push(headBank);

    const optionsFavoriteTable: string[] = [];
    optionsFavoriteTable.push(TableOption.TRANSFER);
    optionsFavoriteTable.push(TableOption.DELETE_FAVORITE);

    const optionsLicenses = this.util.getTableOption(menuLicenses, optionsFavoriteTable);
    optionsLicenses.push(TableOption.TRANSFER);
    optionsLicenses.push(TableOption.DELETE_FAVORITE);

    const accountList = this.achUtil.parsedAccounts(accounts) ?? [];

    return new TableStructuredBuilder()
      .title('ht_favorites')
      .head(favoriteTableHeaders)
      .options(optionsLicenses)
      .body([...accountList].sort(this.achUtil.compareAccountsToSort))
      .build();
  }
}
