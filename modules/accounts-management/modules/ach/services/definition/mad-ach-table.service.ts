import { Injectable } from '@angular/core';
import { V3IAchAccount } from '../../../../../transfer/modules/transfer-ach/interfaces/ach-account-interface';
import {
  ICON_IN_TABLE_KEY,
  ITableHeader,
  ITableStructure,
  TableHeaderBuilder,
  TableStructuredBuilder
} from '@adf/components';
import { TableOption } from '../../../../../transfer/interface/table.enum';
import { UtilService } from '../../../../../../service/common/util.service';
import { AMAchTableControlName } from '../../enum/table-control-name.enum';
import { TranslateService } from '@ngx-translate/core';
import {
  TableThirdPartyLoansOption
} from '../../../../../loan/modules/third-party-loans/enum/table-third-party-loans.enum';

@Injectable({
  providedIn: 'root'
})
export class MadAchTableService {

  constructor(
    private util: UtilService,
    private translate: TranslateService,
  ) { }

  builderFavoriteAccountTableLayout(accounts: V3IAchAccount[], menuLicenses: string[]): ITableStructure {
    const tableHeaders = this.buildTableHeaders();

    const headerFavorite = new TableHeaderBuilder()
      .label('ht_favorites-bisv')
      .key(ICON_IN_TABLE_KEY)
      .class('head-favorites')
      .selected({ action: TableOption.DELETE_FAVORITE })
      .build();
    tableHeaders.push(headerFavorite);

    const optionsAssociateTable: string[] = [];
    optionsAssociateTable.push(TableOption.UPDATE);

    const optionsLicenses = this.util.getTableOption(menuLicenses, optionsAssociateTable);
    const accountList = this.mapAccountsIcon(accounts, 'sprint2-icon-favoritos active');

    if (optionsLicenses.length <= 0) {
      optionsLicenses.push(TableThirdPartyLoansOption.NOT_ALLOWED)
    }


    return new TableStructuredBuilder()
      .title('ht_favorites-bisv')
      .head(tableHeaders)
      .options(optionsLicenses)
      .body(accountList)
      .manageAlertMessage({
        typeAlert: 'info',
        message: 'cam:ach_label_no_accounts_favorites'
      })
      .build();
  }

  builderAssociateAccountTableLayout(accountList: V3IAchAccount[], menuLicenses: string[]): ITableStructure {
    const tableHeaders = this.buildTableHeaders();

    const headerFavorite = new TableHeaderBuilder()
      .label('ht_favorites-bisv')
      .key(ICON_IN_TABLE_KEY)
      .class('head-favorites')
      .selected({ action: TableOption.ADD_FAVORITE })
      .build();
    tableHeaders.push(headerFavorite);

    const optionsAssociateTable: string[] = [];
    optionsAssociateTable.push(TableOption.UPDATE);
    optionsAssociateTable.push(TableOption.DELETE);

    const optionsLicenses = this.util.getTableOption(menuLicenses, optionsAssociateTable);
    const accounts = this.mapAccountsIcon(accountList, 'sprint2-icon-favoritos');

    if (optionsLicenses.length <= 0) {
      optionsLicenses.push(TableThirdPartyLoansOption.NOT_ALLOWED)
    }


    return new TableStructuredBuilder()
      .head(tableHeaders)
      .options(optionsLicenses)
      .body(accounts)
      .manageAlertMessage({
        typeAlert: 'info',
        message: 'cam:ach_label_no_accounts_associated'
      })
      .build();
  }

  private buildTableHeaders() {
    const tableHeaders: ITableHeader[] = [];
    const headAccountNumber = new TableHeaderBuilder()
      .label('account-number')
      .selected({ action: TableOption.READ })
      .key(AMAchTableControlName.ACCOUNT)
      .build();
    tableHeaders.push(headAccountNumber);

    const headerName = new TableHeaderBuilder()
      .label('table.userName')
      .key(AMAchTableControlName.NAME)
      .build();
    tableHeaders.push(headerName);

    const headerBankName = new TableHeaderBuilder()
      .label('bank')
      .key(AMAchTableControlName.BANK)
      .build();
    tableHeaders.push(headerBankName);

    const headerStatus = new TableHeaderBuilder()
      .label('status')
      .class('status')
      .key(AMAchTableControlName.STATUS)
      .build();
    tableHeaders.push(headerStatus);

    return tableHeaders;
  }

  mapAccountsIcon(accounts: V3IAchAccount[], iconValue: string) {
    return accounts.map(account => ({
      ...account,
      statusParsed: this.parsedStatus(account?.status ?? ''),
      class: (account?.status ?? '').toLowerCase(),
      [ICON_IN_TABLE_KEY]: iconValue
    }));
  }
  private parsedStatus(status: string) {
    const statusMapped = {
      a: this.translate.instant('ac:label_account_active'),
      i: this.translate.instant('ac:label_account_inactive'),
    }

    return (statusMapped[status.toLowerCase()] ?? status).toUpperCase();
  }
}
