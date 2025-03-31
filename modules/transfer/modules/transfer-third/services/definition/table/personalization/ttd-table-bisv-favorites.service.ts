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
export class TtdTableBisvFavoritesService {
  constructor(private util: UtilService, private base: TtdBaseTableService) {
  }

  buildFavoriteTableLayout(menuOptionsLicenses: string[]): ITableStructure {
    const tableHeaders: ITableHeader[] = [];

    const headCurrency: ITableAttributeHeader = {
      label: 'head_currency',
      class: 'head-currency',
      key: ThirdTransferTableKeys.CURRENCY,
      isActive: true,
    };


    const headAccountNumber: ITableAttributeHeader = {
      label: 'account-number-bisv',
      class: 'account-number',
      key: ThirdTransferTableKeys.ACCOUNT,
      isActive: true,
    };

    const headTypeAccountFavorites: ITableAttributeHeader = {
      label: 'root-account-type-bisv',
      class: 'head-type-account',
      key: ThirdTransferTableKeys.TYPE_ACCOUNT,
    };

    const headAlias: ITableAttributeHeader = {
      label: 'alias',
      class: 'head-alias',
      key: ThirdTransferTableKeys.ALIAS,
    };

    const changeFavorite = {action: TableOption.DELETE_FAVORITE};

    const headFavorites: ITableAttributeHeader = {
      label: 'ht_favorites-bisv',
      class: 'head-favorites',
      key: ICON_IN_TABLE_KEY,
      selected: changeFavorite,
    };

    tableHeaders.push(this.base.buiderTableHeader(headCurrency));
    tableHeaders.push(this.base.buiderTableHeader(headAccountNumber));
    tableHeaders.push(this.base.buiderTableHeader(headTypeAccountFavorites));
    tableHeaders.push(this.base.buiderTableHeader(headAlias));
    tableHeaders.push(this.base.buiderTableHeader(headFavorites));

    const optionToFavoriteTable: string[] = [];
    optionToFavoriteTable.push(TableOption.TRANSFER);
    optionToFavoriteTable.push(TableOption.UPDATE);
    optionToFavoriteTable.push(TableOption.DELETE);

    const options = this.util.getTableOption(menuOptionsLicenses, optionToFavoriteTable);
    options.unshift(TableOption.TRANSFER);

    return new TableStructuredBuilder()
      .title('ht_favorites-bisv')
      .head(tableHeaders)
      .options(options)
      .manageAlertMessage({
        message: 'no-favorites',
        typeAlert: '',
      })
      .build();
  }
}
