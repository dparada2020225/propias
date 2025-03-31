import { Injectable } from '@angular/core';
import { UtilService } from '../../../../../../service/common/util.service';
import { TranslateService } from '@ngx-translate/core';
import {
  ICON_IN_TABLE_KEY,
  ITableHeader,
  ITableStructure,
  TableHeaderBuilder,
  TableStructuredBuilder
} from '@adf/components';
import { TableOption } from '../../../../../transfer/interface/table.enum';
import { AM365AccountList } from '../../interfaces/associated-account.interface';
import { AM365TableControlName } from '../../enum/table-control-name.enum';
import {
  TableThirdPartyLoansOption
} from '../../../../../loan/modules/third-party-loans/enum/table-third-party-loans.enum';

@Injectable({
  providedIn: 'root'
})
export class AmdM365TableService {
  constructor(
    private util: UtilService,
    private translate: TranslateService,
  ) { }

  builderFavoriteAccountTableLayout(accounts: AM365AccountList, menuLicenses: string[]): ITableStructure {
    const tableHeaders = this.buildTableHeaders();

    const headerFavorite365 = new TableHeaderBuilder()
      .label('ht_favorites-bisv')
      .key(ICON_IN_TABLE_KEY)
      .class('head-favorites')
      .selected({ action: TableOption.DELETE_FAVORITE })
      .build();
    tableHeaders.push(headerFavorite365);

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

  builderAssociateAccountTableLayout(accountList: AM365AccountList, menuLicenses: string[]): ITableStructure {
    const tableHeaders = this.buildTableHeaders();

    const headerAssociated365 = new TableHeaderBuilder()
      .label('ht_favorites-bisv')
      .key(ICON_IN_TABLE_KEY)
      .class('head-favorites')
      .selected({ action: TableOption.ADD_FAVORITE })
      .build();
    tableHeaders.push(headerAssociated365);

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
      .options(optionsAssociateTable)
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
      .label('ac:m365_label_phone_number')
      .selected({ action: TableOption.READ })
      .key(AM365TableControlName.NUMBER_PHONE)
      .build();
    tableHeaders.push(headAccountNumber);

    const headerName = new TableHeaderBuilder()
      .label('ac:m365_label_name_beneficiary')
      .key(AM365TableControlName.NAME)
      .build();
    tableHeaders.push(headerName);

    const headerBankName = new TableHeaderBuilder()
      .label('bank')
      .key(AM365TableControlName.BANK)
      .build();
    tableHeaders.push(headerBankName);

    const headerStatus = new TableHeaderBuilder()
      .label('status')
      .class('status')
      .key(AM365TableControlName.STATUS)
      .build();
    tableHeaders.push(headerStatus);

    return tableHeaders;
  }

  mapAccountsIcon(accounts: AM365AccountList, iconValue: string) {
    return accounts.map(account => ({
      ...account,
      statusParsed: this.parsedStatus(account.status),
      class: account.status.toLowerCase(),
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
