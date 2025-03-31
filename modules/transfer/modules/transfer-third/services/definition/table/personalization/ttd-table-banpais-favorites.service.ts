import { ITableHeader, ITableStructure, TableStructuredBuilder } from '@adf/components';
import { Injectable } from '@angular/core';
import { UtilService } from 'src/app/service/common/util.service';
import { TableOption } from '../../../../../../interface/table.enum';
import { ThirdTransferTableKeys } from '../../../../enums/third-transfer-table-keys.enum';
import { TtdBaseTableService } from '../base/ttd-base-table.service';
import { ITableAttributeHeader } from 'src/app/models/build.interface';

@Injectable({
  providedIn: 'root'
})
export class TtdTableFavoritesService {

  constructor(
    private util: UtilService,
    private base: TtdBaseTableService
  ) { }

  buildFavoriteTableLayout(menuOptionsLicenses: string[]): ITableStructure {

    const tableHeaders: ITableHeader[] = [];

    const headCurrency: ITableAttributeHeader = {
      label: 'head_currency',
      class: 'head-currency',
      key: ThirdTransferTableKeys.CURRENCY,
      isActive: true,
    };


    const transactionOption = { action: TableOption.TRANSFER };

    const headAccountNumber: ITableAttributeHeader = {
      label: 'account-number',
      class: 'account-number',
      key: ThirdTransferTableKeys.ACCOUNT,
      selected: transactionOption,
    };


    const headTypeAccountFavorites: ITableAttributeHeader = {
      label: 'root-account-type',
      class: 'head-type-account',
      key: ThirdTransferTableKeys.TYPE_ACCOUNT,
    };

    const headAlias: ITableAttributeHeader = {
      label: 'alias',
      class: 'head-alias',
      key: ThirdTransferTableKeys.ALIAS,
    }

    tableHeaders.push(this.base.buiderTableHeader(headCurrency));
    tableHeaders.push(this.base.buiderTableHeader(headAccountNumber));
    tableHeaders.push(this.base.buiderTableHeader(headTypeAccountFavorites));
    tableHeaders.push(this.base.buiderTableHeader(headAlias));

    const optionToFavoriteTable: string[] = [];
    optionToFavoriteTable.push(TableOption.TRANSFER);
    optionToFavoriteTable.push(TableOption.DELETE_FAVORITE);

    const options = this.util.getTableOption(menuOptionsLicenses, optionToFavoriteTable);
    options.push(TableOption.TRANSFER);
    options.push(TableOption.DELETE_FAVORITE);

    return new TableStructuredBuilder()
      .title('ht_favorites')
      .head(tableHeaders)
      .options(options)
      .build();
  }

}
