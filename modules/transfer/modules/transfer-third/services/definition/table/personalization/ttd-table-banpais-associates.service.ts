import { ITableHeader, ITableStructure, TableStructuredBuilder } from '@adf/components';
import { Injectable } from '@angular/core';
import { UtilService } from 'src/app/service/common/util.service';
import { TableOption } from '../../../../../../interface/table.enum';
import { ThirdTransferTableKeys } from '../../../../enums/third-transfer-table-keys.enum';
import { ITableAttributeHeader } from 'src/app/models/build.interface';
import { TtdBaseTableService } from '../base/ttd-base-table.service';

@Injectable({
  providedIn: 'root'
})
export class TtdTableAssociatesService {

  constructor(
    private util: UtilService,
    private base: TtdBaseTableService
  ) { }

  buildThirdTableLayout(menuOptionsLicenses: string[]): ITableStructure {

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
      class: 'head-account',
      selected: transactionOption,
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

    tableHeaders.push(this.base.buiderTableHeader(headCurrency));
    tableHeaders.push(this.base.buiderTableHeader(headAccountNumber));
    tableHeaders.push(this.base.buiderTableHeader(headTypeAccount));
    tableHeaders.push(this.base.buiderTableHeader(headAlias));

    const optionsToThirdTable: string[] = [];
    optionsToThirdTable.push(TableOption.TRANSFER);
    optionsToThirdTable.push(TableOption.UPDATE);
    optionsToThirdTable.push(TableOption.DELETE);

    const options = this.util.getTableOption(menuOptionsLicenses, optionsToThirdTable);
    options.push(TableOption.TRANSFER);


    return new TableStructuredBuilder()
      .head(tableHeaders)
      .title('third_parties')
      .options(options)
      .build();
  }


}
