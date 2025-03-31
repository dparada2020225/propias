import { ITableHeader, ITableStructure, TableHeaderBuilder, TableStructuredBuilder } from '@adf/components';
import { Injectable } from '@angular/core';
import { UtilService } from 'src/app/service/common/util.service';
import { TableThirdPartyLoansOption } from '../../../enum/table-third-party-loans.enum';
import { ThirdPartyLoansTableKeys } from '../../../enum/third-party-loans-control-name.enum';

@Injectable({
  providedIn: 'root'
})
export class TpldTableThirdService {

  constructor(
    private util: UtilService,
  ){}

  buildThirdLoanTableLayout(menuOptionsLicenses: string[]): ITableStructure {

    const tableHeaders: ITableHeader[] = [];


    const headLoanNumberOrAlias = new TableHeaderBuilder()
      .label('number_loan_alias')
      .class('account-number')
      .selected({ action: TableThirdPartyLoansOption.CONSULT })
      .key(ThirdPartyLoansTableKeys.IDENTIFIER)
      .build();

    const headNameLoan = new TableHeaderBuilder()
      .label('name_loan')
      .class('head-type-account')
      .key(ThirdPartyLoansTableKeys.NAME)
      .build();

    const headCurrency = new TableHeaderBuilder()
      .label('head_currency')
      .class('head-currency')
      .key(ThirdPartyLoansTableKeys.CURRENCY_CODE)
      .isActive(true)
      .build();

    const headTypeLoan = new TableHeaderBuilder()
      .label('type_of_loan')
      .class('head-alias')
      .isActive(true)
      .key(ThirdPartyLoansTableKeys.TYPE)
      .isActive(true)
      .build();

    tableHeaders.push(headLoanNumberOrAlias);
    tableHeaders.push(headNameLoan);
    tableHeaders.push(headCurrency);
    tableHeaders.push(headTypeLoan);

    const optionTPLTable: string[] = [];
    optionTPLTable.push(TableThirdPartyLoansOption.PAYMENT);
    optionTPLTable.push(TableThirdPartyLoansOption.UPDATE);
    optionTPLTable.push(TableThirdPartyLoansOption.DELETE);

    const options = this.util.getTableOption(menuOptionsLicenses, optionTPLTable);
    if(options.length <= 0){
      options.push(TableThirdPartyLoansOption.NOT_ALLOWED)
    }

    return new TableStructuredBuilder()
      .title('loans_third_parties')
      .head(tableHeaders)
      .options(options)
      .build();
  }
}
