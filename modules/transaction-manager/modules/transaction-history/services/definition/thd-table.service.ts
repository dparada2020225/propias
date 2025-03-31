import { Injectable } from '@angular/core';
import { ITransactionHistory } from '../../interfaces/transaction-history.interface';
import { AdfFormatService, ITableHeader, TableHeaderBuilder, TableStructuredBuilder } from '@adf/components';
import { ETransactionHistoryTableActions, ETransactionHistoryTableKeys } from '../../enums/th-table-keys.enum';
import { UtilService } from '../../../../../../service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class ThdTableService {
  constructor(
    private adfFormat: AdfFormatService,
    private util: UtilService,
  ) { }

  buildTransactionsTableLayout(listTransactions: ITransactionHistory[]) {
    const tableHeaders: ITableHeader[] = [];

    const referenceHeader = new TableHeaderBuilder()
      .label('reference')
      .class('head-reference')
      .selected({ action: ETransactionHistoryTableActions.VIEW_DETAIL })
      .key(ETransactionHistoryTableKeys.REFERENCE)
      .build();
    tableHeaders.push(referenceHeader);

    const dateCreatedHeader = new TableHeaderBuilder()
      .label('date_created')
      .class('head-date')
      .key(ETransactionHistoryTableKeys.DATE_CREATED)
      .build();
    tableHeaders.push(dateCreatedHeader);

    const transactionHeader = new TableHeaderBuilder()
      .label('transaction')
      .class('head-transaction')
      .key(ETransactionHistoryTableKeys.TRANSACTION)
      .build();
    tableHeaders.push(transactionHeader);

    const currencyHeader = new TableHeaderBuilder()
      .label('head_currency')
      .class('head-currency')
      .key(ETransactionHistoryTableKeys.CURRENCY)
      .isActive(true)
      .build();
    tableHeaders.push(currencyHeader);

    const amountHeader = new TableHeaderBuilder()
      .label('amount')
      .class('head_amount')
      .key(ETransactionHistoryTableKeys.AMOUNT)
      .isActive(true)
      .build();
    tableHeaders.push(amountHeader);

    const userHeader = new TableHeaderBuilder()
      .label('label:th_user_created')
      .class('head_user')
      .key(ETransactionHistoryTableKeys.USER)
      .build();
    tableHeaders.push(userHeader);

    return new TableStructuredBuilder()
      .head(tableHeaders)
      .body(this.parseTransactions(listTransactions))
      .manageAlertMessage({
        typeAlert: 'info',
        message: 'error:empty_transactions'
      })
      .build();
  }

  parseTransactions(listTransactions: ITransactionHistory[]) {
    return listTransactions.map(transaction => ({
      ...transaction,
      creationDate: this.adfFormat.getFormatDateTime(transaction.creationDate).standard,
      dateTime: transaction.creationDate,
      currency: this.util.getCurrencySymbolToIso(transaction?.currency ?? ''),
    }));
  }

}
