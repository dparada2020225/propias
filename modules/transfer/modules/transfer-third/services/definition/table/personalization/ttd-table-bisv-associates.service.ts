import {ICON_IN_TABLE_KEY, ITableHeader, ITableStructure, TableStructuredBuilder} from '@adf/components';
import {Injectable} from '@angular/core';
import {ITableAttributeHeader} from 'src/app/models/build.interface';
import {UtilService} from 'src/app/service/common/util.service';
import {TableOption} from '../../../../../../interface/table.enum';
import {ThirdTransferTableKeys} from '../../../../enums/third-transfer-table-keys.enum';
import {TtdBaseTableService} from '../base/ttd-base-table.service';

@Injectable({
  providedIn: 'root',
})
export class TtdTableBisvAssociatesService {
  constructor(private util: UtilService, private base: TtdBaseTableService) {
  }

  buildThirdTableLayout(menuOptionsLicenses: string[]): ITableStructure {
    const tableHeaders: ITableHeader[] = [];

    const headCurrency: ITableAttributeHeader = {
      label: 'head_currency',
      class: 'head-currency',
      key: ThirdTransferTableKeys.CURRENCY,
      isActive: true,
    };


    const headAccountNumber: ITableAttributeHeader = {
      label: 'account-number-bisv',
      class: 'head-account',
      isActive: true,
      key: ThirdTransferTableKeys.ACCOUNT,
    };

    const headTypeAccount: ITableAttributeHeader = {
      label: 'root-account-type',
      class: 'head-type-account',
      key: ThirdTransferTableKeys.TYPE_ACCOUNT,
    };

    const headAlias: ITableAttributeHeader = {
      label: 'alias',
      class: 'head-alias',
      key: ThirdTransferTableKeys.ALIAS,
    };

    const changeFavorite = {action: TableOption.ADD_FAVORITE};

    const headFavorites: ITableAttributeHeader = {
      label: 'ht_favorites-bisv',
      class: 'head-favorites',
      key: ICON_IN_TABLE_KEY,
      selected: changeFavorite,
    };

    tableHeaders.push(this.base.buiderTableHeader(headCurrency));
    tableHeaders.push(this.base.buiderTableHeader(headAccountNumber));
    tableHeaders.push(this.base.buiderTableHeader(headTypeAccount));
    tableHeaders.push(this.base.buiderTableHeader(headAlias));
    tableHeaders.push(this.base.buiderTableHeader(headFavorites));

    const optionsToThirdTable: string[] = [];
    optionsToThirdTable.push(TableOption.TRANSFER);
    optionsToThirdTable.push(TableOption.UPDATE);
    optionsToThirdTable.push(TableOption.DELETE);

    const options = this.util.getTableOption(menuOptionsLicenses, optionsToThirdTable);
    options.unshift(TableOption.TRANSFER);

    return new TableStructuredBuilder()
      .head(tableHeaders)
      .options(options)
      .manageAlertMessage({
        message: 'no-account-ttr',
        typeAlert: '',
      })
      .build();
  }
}
