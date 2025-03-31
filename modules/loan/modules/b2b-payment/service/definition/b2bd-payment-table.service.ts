import { Injectable } from '@angular/core';
import { IPaymentAccount } from '../../interfaces/b2b-payment.interface';
import { AdfFormatService, ITableHeader, TableHeaderBuilder, TableStructuredBuilder } from '@adf/components';
import { B2bPaymentKeys, PaymentTableType } from '../../enum/b2b-payment-control-name.enum';

@Injectable({
  providedIn: 'root'
})
export class B2bdPaymentTableService {

  constructor(
    private adfFormatService: AdfFormatService,
  ) { }


  tableLayout(accounts: IPaymentAccount[], currency: string) {
    const tableHeaders: ITableHeader[] = [];

    const headAccount = new TableHeaderBuilder()
      .label('b2b-no')
      .class('head_b2b_account')
      .key(B2bPaymentKeys.B2BID)
      .selected({ action: PaymentTableType.PAY })
      .build();
    tableHeaders.push(headAccount);

    const headName = new TableHeaderBuilder()
      .label('title.b2b_name')
      .class('head-b2b_name')
      .key(B2bPaymentKeys.NAME)
      .build();
    tableHeaders.push(headName);

    const headTotalDebt = new TableHeaderBuilder()
      .label('b2b_total_debt')
      .class('head-total_debt')
      .isActive(true)
      .key(B2bPaymentKeys.BALANCE)
      .build();
    tableHeaders.push(headTotalDebt);

    const headExpirationDate = new TableHeaderBuilder()
      .label('expiration_date')
      .class('head-expiration_date')
      .key(B2bPaymentKeys.DUE_DATE)
      .build();
    tableHeaders.push(headExpirationDate);

    const optionsToPaymentTable: string[] = [];
    optionsToPaymentTable.push(PaymentTableType.PAY);

    return new TableStructuredBuilder()
      .head(tableHeaders)
      .title('dollars')
      .body(accounts.map((account) => this.parserAccountToTable(account, currency)))
      .manageAlertMessage({
        typeAlert: 'warning',
        message: 'errorB2b:b2bAccountEmptyList'
      })
      .options(optionsToPaymentTable)
      .build();
  }

  private parserAccountToTable(account: IPaymentAccount, currency: string) {
    return {
      ...account,
      balance: [currency, this.adfFormatService.formatAmount(account?.balance)],
      dueDate: this.adfFormatService.getFormatDateTime(account.dueDate).standard
    };
  }
}
