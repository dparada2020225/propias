import { Injectable } from '@angular/core';
import { OwnThirdPartyLoansTableKeys } from '../../../enum/own-third-party-loans-control-name.enum';
import { ITableHeader, ITableStructure, TableHeaderBuilder, TableStructuredBuilder } from '@adf/components';
import { TableThirdPartyLoansOption } from '../../../enum/table-third-party-loans.enum';

@Injectable({
  providedIn: 'root'
})
export class TpldTableOwnService {
  buildOwnLoanTableLayout(): ITableStructure {

    const tableHeaders: ITableHeader[] = [];


    const headLoanNumberOrAlias = new TableHeaderBuilder()
      .label('number_loan_alias')
      .class('account-number')
      .selected({ action: TableThirdPartyLoansOption.CONSULT })
      .key(OwnThirdPartyLoansTableKeys.IDENTIFIER)
      .build();

    const headNameLoan = new TableHeaderBuilder()
      .label('name_loan')
      .class('head-type-account')
      .key(OwnThirdPartyLoansTableKeys.NAME)
      .build();

    const headCurrency = new TableHeaderBuilder()
      .label('head_currency')
      .class('head-currency')
      .key(OwnThirdPartyLoansTableKeys.CURRENCY)
      .isActive(true)
      .build();

    const headTypeLoan = new TableHeaderBuilder()
      .label('total_debt')
      .class('head-alias')
      .key(OwnThirdPartyLoansTableKeys.TOTAL_DEBT)
      .isActive(true)
      .build();

    tableHeaders.push(headLoanNumberOrAlias);
    tableHeaders.push(headNameLoan);
    tableHeaders.push(headCurrency);
    tableHeaders.push(headTypeLoan);

    const optionToFavoriteTable: string[] = [];
    optionToFavoriteTable.push(TableThirdPartyLoansOption.PAYMENT);
    optionToFavoriteTable.push(TableThirdPartyLoansOption.ACCOUNT_STATEMENT);

    return new TableStructuredBuilder()
      .title('owns_loans')
      .head(tableHeaders)
      .options(optionToFavoriteTable)
      .build();
  }



}
