import { Injectable } from '@angular/core';
import { IAchAccount } from '../../../../transfer-ach/interfaces/ach-account-interface';
import { ITableHeader, TableHeaderBuilder, TableStructuredBuilder } from '@adf/components';
import { ETableHeader } from '../../../models/bulk-transfer.enum';

@Injectable({
  providedIn: 'root'
})
export class BtdTableService {

  tableLayoutDefinition(accountList: IAchAccount[], title: string, isSelected: boolean = false, isActive = false) {
    const tableHeaders: ITableHeader[] = [];

    const numberAccount = new TableHeaderBuilder()
      .key(ETableHeader.ACCOUNT)
      .selected(!isSelected ? null as any : {
        action: 'select_all',
      })
      .label('no_account')
      .class('account')
      .build();
    tableHeaders.push(numberAccount);

    const nameAccount = new TableHeaderBuilder()
      .key(ETableHeader.NAME)
      .label('ach-name')
      .class('name')
      .build();
    tableHeaders.push(nameAccount);

    const typeAccount = new TableHeaderBuilder()
      .key(ETableHeader.TYPE_ACCOUNT)
      .label('type_account')
      .build();
    tableHeaders.push(typeAccount);

    const amount = new TableHeaderBuilder()
      .key(ETableHeader.AMOUNT)
      .label('amount')
      .class('amount')
      .isActive(isActive)
      .build();
    tableHeaders.push(amount);

    const financialInstitution = new TableHeaderBuilder()
      .key(ETableHeader.BANK_NAME)
      .label('financial-institution')
      .class('financialInstitution')
      .build();
    tableHeaders.push(financialInstitution);

    return new TableStructuredBuilder()
      .head(tableHeaders)
      .title(title)
      .manageAlertMessage({
        typeAlert: 'warning',
        message: 'error:empty_transactions'
      })
      .body(accountList ?? [])
      .build();
  }
}
