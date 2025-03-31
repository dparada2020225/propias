import {Injectable} from '@angular/core';
import {ITableHeader, TableHeaderBuilder, TableStructuredBuilder} from '@adf/components';
import {TranslateService} from "@ngx-translate/core";
import { SPPDTableKeys } from 'src/app/modules/payroll/manager-payroll/enums/pmp-table-keys.enum';

@Injectable({
  providedIn: 'root'
})
export class PsManagerTableService {
  constructor(
    private translateService: TranslateService
  ) {
  }

  buildExcelFieldTable() {
    const structure = [
      {
        id: 1,
        column: "1",
        field: this.translateService.instant("ps:account_credit_example"),
        example: "010010000052"
      },
      {
        id: 2,
        column: "2",
        field: this.translateService.instant("ps:amount_example"),
        example: "100.00"
      },
      {
        id: 3,
        column: "3",
        field: this.translateService.instant("ps:email_example_table"),
        example: "muestra@hotmail.com"
      },
      {
        id: 4,
        column: "4",
        field: this.translateService.instant("ps:detail_example_table"),
        example: "PAGO FACTURA 12345"
      }
    ]

    const tableHeaders: ITableHeader[] = [];

    const columnHeader = new TableHeaderBuilder()
      .label('ps:label_column')
      .key(SPPDTableKeys.COLUMN)
      .build();


    const fieldHeader = new TableHeaderBuilder()
      .label('ps:label_field')
      .key(SPPDTableKeys.FIELD)
      .build();

    const exampleHeader = new TableHeaderBuilder()
      .label('ps:label_example')
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
        column: this.translateService.instant("ps:label_row"),
        field: this.translateService.instant("ps:account_credit_example"),
        limit: `${this.translateService.instant("ps:max_lenght")} 12`
      },
      {
        id: 2,
        column: "",
        field: this.translateService.instant("ps:amount_example"),
        limit: `${this.translateService.instant("ps:max_lenght")} 13`
      },
      {
        id: 3,
        column: "",
        field: this.translateService.instant("ps:email_example_table"),
        limit: `${this.translateService.instant("ps:max_lenght")} 50`
      },
      {
        id: 3,
        column: "",
        field: this.translateService.instant("ps:detail_example_table"),
        limit: `${this.translateService.instant("ps:max_lenght")} 40`
      }
    ]

    const tableHeaders: ITableHeader[] = [];

    const columnHeader = new TableHeaderBuilder()
      .label('ps:label_row_singular')
      .key(SPPDTableKeys.COLUMN)
      .build();


    const fieldHeader = new TableHeaderBuilder()
      .label('ps:label_field')
      .key(SPPDTableKeys.FIELD)
      .build();

    const exampleHeader = new TableHeaderBuilder()
      .label('ps:label_limit')
      .key(SPPDTableKeys.LIMIT)
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
