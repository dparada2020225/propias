import {Injectable} from '@angular/core';
import {ITableHeader, TableHeaderBuilder, TableStructuredBuilder} from '@adf/components';
import {TranslateService} from "@ngx-translate/core";
import { SPPMTableKeys } from '../../interfaces/sp-manually.interface';

@Injectable({
  providedIn: 'root'
})
export class PsTableService {
  constructor(
    private translateService: TranslateService
  ) {
  }

  tableLoadManuallyHeaders() {
    return [
      {
        name: SPPMTableKeys.IS_CHECKED,
        label: '',
        icon: 'sprint2-icon-trash',
        action: 'action:delete'
      },
      {
        name: SPPMTableKeys.ACCOUNT,
        label: 'account',
        icon: '',
        action: ''
      },
      {
        name: SPPMTableKeys.NAME,
        label: 'label.home.name',
        icon: '',
        action: ''
      },
      {
        name: SPPMTableKeys.AMOUNT_PARSED,
        label: 'label.statements.amount',
        icon: '',
        action: ''
      },
      {
        name: SPPMTableKeys.DETAIL,
        label: 'payroll:email_example',
        icon: '',
        action: ''
      }
    ]
  }

  buildExcelFieldTable() {
    const structure = [
      {
        id: 1,
        column: "1",
        field: this.translateService.instant("payroll:account_credit_example"),
        example: "01-001-000005-2"
      },
      {
        id: 2,
        column: "2",
        field: this.translateService.instant("payroll:amount_example"),
        example: "1.01"
      },
      {
        id: 3,
        column: "3",
        field: this.translateService.instant("payroll:email_example_table"),
        example: "muestra@hotmail.com"
      }
    ]

    const tableHeaders: ITableHeader[] = [];

    const columnHeader = new TableHeaderBuilder()
      .label('payroll:label_column')
      .key(SPPDTableKeys.COLUMN)
      .build();


    const fieldHeader = new TableHeaderBuilder()
      .label('payroll:label_field')
      .key(SPPDTableKeys.FIELD)
      .build();

    const exampleHeader = new TableHeaderBuilder()
      .label('payroll:label_example')
      .key(SPPDTableKeys.EXAMPLE)
      .build();

    tableHeaders.push(columnHeader);
    tableHeaders.push(fieldHeader);
    tableHeaders.push(exampleHeader);

    return new TableStructuredBuilder()
      .head(tableHeaders)
      .body(structure)
      .build();
  }

  buildCsvFieldTable() {
    const strucutre = [
      {
        id: 1,
        column: this.translateService.instant("payroll:label_row"),
        field: this.translateService.instant("payroll:account_credit_example"),
        limit: `${this.translateService.instant("payroll:max_lenght")} 12`
      },
      {
        id: 2,
        column: "",
        field: this.translateService.instant("payroll:amount_example"),
        limit: `${this.translateService.instant("payroll:max_lenght")} 13`
      },
      {
        id: 3,
        column: "",
        field: this.translateService.instant("payroll:email_example_table"),
        limit: `${this.translateService.instant("payroll:max_lenght")} 50`
      }
    ]

    const tableHeaders: ITableHeader[] = [];

    const columnHeader = new TableHeaderBuilder()
      .label('payroll:label_row')
      .key(SPPDTableKeys.COLUMN)
      .build();


    const fieldHeader = new TableHeaderBuilder()
      .label('payroll:label_field')
      .key(SPPDTableKeys.FIELD)
      .build();

    const exampleHeader = new TableHeaderBuilder()
      .label('payroll:label_limit')
      .key(SPPDTableKeys.LIMIT)
      .isActive(true)
      .build();

    tableHeaders.push(columnHeader);
    tableHeaders.push(fieldHeader);
    tableHeaders.push(exampleHeader);

    return new TableStructuredBuilder()
      .head(tableHeaders)
      .body(strucutre)
      .build();
  }
}
