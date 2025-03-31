import {Injectable} from '@angular/core';
import {AdfFormatService, ITableHeader, TableHeaderBuilder, TableStructuredBuilder} from '@adf/components';
import {SPPTableKeys} from '../../../enums/pmp-table-keys.enum';
import {TranslateService} from "@ngx-translate/core";
import {Participant} from "../../../interfaces/pmp-payment-home.interface";
import {UtilService} from "../../../../../../service/common/util.service";
import {environment} from "../../../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PmpdTableService {

  constructor(
    private translateService: TranslateService,
    private adfFormat: AdfFormatService,
    private utils: UtilService
  ) { }

  buildTable(registers: Participant[]) {
    const tableHeaders: ITableHeader[] = [];

    const columnAccount = new TableHeaderBuilder()
      .label('account')
      .key(SPPTableKeys.ACCOUNT)
      .isActive(true)
      .build();

    const columnName = new TableHeaderBuilder()
      .label('ach_name_account')
      .key(SPPTableKeys.NAME)
      .build();

    const columnStatus = new TableHeaderBuilder()
      .label('state')
      .key(SPPTableKeys.STATUS)
      .isActive(true)
      .build();

    const columnEmail = new TableHeaderBuilder()
      .label('payroll:email_example')
      .key(SPPTableKeys.EMAIL)
      .class("email")
      .build();

    const columnAmount = new TableHeaderBuilder()
      .label('label.statements.amount')
      .key(SPPTableKeys.AMOUNT)
      .build();

    tableHeaders.push(columnAccount);
    tableHeaders.push(columnName);
    tableHeaders.push(columnStatus);
    tableHeaders.push(columnEmail);
    tableHeaders.push(columnAmount);


    const registerMapped = registers.map(register => {
      return {
        ...register,
        amount: `${environment.currency} ${this.adfFormat.formatAmount(register.targetAmount)}`,
        status: this.getRegisterStatus(register.statusAccount.toLowerCase()),
        class: this.getRegisterStatus(register.statusAccount.toLowerCase()).toLowerCase(),
      }
    })


    return new TableStructuredBuilder()
      .head(tableHeaders)
      .body(registerMapped)
      .manageAlertMessage({
        typeAlert: '',
        message: 'payroll:label_zero_register'
      })
      .build();
  }

  getRegisterStatus(status: string) {
    const statusMap = {
      'active': this.translateService.instant("payroll:status_account_Active"),
      'activa': this.translateService.instant("payroll:status_account_Active"),
      'inactive': this.translateService.instant("payroll:status_account_inactive"),
      'inactiva': this.translateService.instant("payroll:status_account_inactive"),
      'error': this.translateService.instant("payroll:status_account_error"),
      'blocked': this.translateService.instant("payroll:status_account_blocked"),
      'bloqueada': this.translateService.instant("payroll:status_account_blocked"),
      'cancelled': this.translateService.instant("payroll:status_account_cancelled"),
      'cancelada': this.translateService.instant("payroll:status_account_cancelled"),
    }

    return statusMap[status] || this.translateService.instant("payroll:status_account_error");
  }
}
