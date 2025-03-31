import { Injectable } from '@angular/core';
import {
  ICON_IN_TABLE_KEY,
  ITableHeader,
  ITableStructure,
  TableHeaderBuilder,
  TableStructuredBuilder
} from '@adf/components';
import { TableOption } from '../../../../../transfer/interface/table.enum';
import { UtilService } from '../../../../../../service/common/util.service';
import { EAMS365TableName } from '../../enum/table-control-name.enum';
import { TAMS365AccountList } from '../../interfaces/s365-account.interface';
import {
  TableThirdPartyLoansOption
} from '../../../../../loan/modules/third-party-loans/enum/table-third-party-loans.enum';

@Injectable({
  providedIn: 'root'
})
export class AmdS365TableService {

  constructor(
    private utils: UtilService,
  ) {
  }

  private buildTableHeaders() {
    const tableHeaders: ITableHeader[] = [];
    const headAccountNumber = new TableHeaderBuilder()
      .label('account')
      .key(EAMS365TableName.ACCOUNT)
      .build();
    tableHeaders.push(headAccountNumber);

    const headerName = new TableHeaderBuilder()
      .label('table.userName')
      .key(EAMS365TableName.NAME)
      .build();
    tableHeaders.push(headerName);

    const headerBankName = new TableHeaderBuilder()
      .label('bank')
      .key(EAMS365TableName.BANK)
      .build();
    tableHeaders.push(headerBankName);

    const headerCountry = new TableHeaderBuilder()
      .label('ac:s365:label_country')
      .key(EAMS365TableName.COUNTRY)
      .build();
    tableHeaders.push(headerCountry);

    return tableHeaders;
  }


  builderFavoriteAccountTableLayout(accountList: TAMS365AccountList, menuLicenses: string[], isFavoriteActive = false): ITableStructure {
    const tableHeaders = this.buildTableHeaders();

    if (isFavoriteActive) {
      const headerFavorite = new TableHeaderBuilder()
        .label('ht_favorites-bisv')
        .key(ICON_IN_TABLE_KEY)
        .class('head-favorites')
        .selected({ action: TableOption.DELETE_FAVORITE })
        .build();
      tableHeaders.push(headerFavorite);
    }

    const optionsAssociateTable: string[] = [];
    optionsAssociateTable.push(TableOption.UPDATE);

    const optionsLicenses = this.utils.getTableOption(menuLicenses, optionsAssociateTable);
    const accounts = this.mapAccountsIcon(accountList, 'sprint2-icon-favoritos active', isFavoriteActive);

    if (optionsLicenses.length <= 0) {
      optionsLicenses.push(TableThirdPartyLoansOption.NOT_ALLOWED)
    }

    return new TableStructuredBuilder()
      .head(tableHeaders)
      .options(optionsAssociateTable)
      .body(accounts)
      .title('ht_favorites-bisv')
      .manageAlertMessage({
        typeAlert: 'info',
        message: 'cam:ach_label_no_accounts_associated'
      })
      .build();
  }

  builderAssociateAccountTableLayout(accountList: TAMS365AccountList, menuLicenses: string[], isFavoriteActive = false): ITableStructure {
    const tableHeaders = this.buildTableHeaders();

    if (isFavoriteActive) {
      const headerFavorite = new TableHeaderBuilder()
        .label('ht_favorites-bisv')
        .key(ICON_IN_TABLE_KEY)
        .class('head-favorites')
        .selected({ action: TableOption.ADD_FAVORITE })
        .build();
      tableHeaders.push(headerFavorite);
    }

    const optionsAssociateTable: string[] = [];
    optionsAssociateTable.push(TableOption.UPDATE);
    optionsAssociateTable.push(TableOption.DELETE);

    const optionsLicenses = this.utils.getTableOption(menuLicenses, optionsAssociateTable);
    const accounts = this.mapAccountsIcon(accountList, 'sprint2-icon-favoritos', isFavoriteActive);

    if (optionsLicenses.length <= 0) {
      optionsLicenses.push(TableThirdPartyLoansOption.NOT_ALLOWED)
    }

    return new TableStructuredBuilder()
      .head(tableHeaders)
      .options(optionsAssociateTable)
      .body(accounts)
      .manageAlertMessage({
        typeAlert: 'info',
        message: 'cam:ach_label_no_accounts_associated'
      })
      .build();
  }

  mapAccountsIcon(accounts: TAMS365AccountList, iconValue: string, isFavoriteActive: boolean) {
    if (!isFavoriteActive) return accounts;

    return accounts.map(account => ({
      ...account,
      [ICON_IN_TABLE_KEY]: iconValue,
    }))
  }
}
