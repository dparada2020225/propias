import {Injectable} from '@angular/core';
import {AdfFormatService, ITableHeader, TableHeaderBuilder, TableStructuredBuilder} from '@adf/components';
import {TranslateService} from "@ngx-translate/core";
import { UtilService } from 'src/app/service/common/util.service';
import { PSDetailTrack, PSParticipant } from '../../interfaces/ps-payment-home.interface';
import { environment } from 'src/environments/environment';
import { SPTableKeys, SPTableTrackKeys } from '../../enums/ps-table-keys.enum';

@Injectable({
  providedIn: 'root'
})
export class SPPTableService {

  constructor(
    private translateService: TranslateService,
    private adfFormat: AdfFormatService,
    private utils: UtilService
  ) { }

  buildTable(registers: PSParticipant[]) {
    const tableHeaders: ITableHeader[] = [];

    const columnAccount = new TableHeaderBuilder()
      .label('account')
      .key(SPTableKeys.ACCOUNT)
      .build();

    const columnName = new TableHeaderBuilder()
      .label('ach_name_account')
      .key(SPTableKeys.NAME)
      .build();

    const columnStatus = new TableHeaderBuilder()
      .label('state')
      .key(SPTableKeys.STATUS)
      .class("status")
      .build();

    const columnEmail = new TableHeaderBuilder()
      .label('ps:email_example')
      .key(SPTableKeys.EMAIL)
      .class("email")
      .build();

      const columnDetail = new TableHeaderBuilder()
      .label('ps:detail_example')
      .key(SPTableKeys.DETAIL)
      .class("description")
      .build();

    const columnAmount = new TableHeaderBuilder()
      .label('label.statements.amount')
      .key(SPTableKeys.AMOUNT)
      .build();

    tableHeaders.push(columnAccount);
    tableHeaders.push(columnName);
    tableHeaders.push(columnStatus);
    tableHeaders.push(columnEmail);
    tableHeaders.push(columnDetail);
    tableHeaders.push(columnAmount);


    const registerMapped = registers.map(register => {
      return {
        ...register,
        amount: `${environment.currency} ${this.adfFormat.formatAmount(register.montoDestino)}`,
        status: this.getRegisterStatus(register.estadoCuenta.toLowerCase()),
        class: this.getRegisterStatus(register.estadoCuenta.toLowerCase()).toLowerCase(),
      }
    })


    return new TableStructuredBuilder()
      .head(tableHeaders)
      .body(registerMapped)
      .manageAlertMessage({
        typeAlert: '',
        message: 'ps:label_zero_register'
      })
      .build();
  }

  
  buildTableTrack(registers: PSDetailTrack[]) {
    const tableHeaders: ITableHeader[] = [];

    const columnAccount = new TableHeaderBuilder()
      .label('account')
      .key(SPTableTrackKeys.ACCOUNT)
      .build();

    const columnName = new TableHeaderBuilder()
      .label('ach_name_account')
      .key(SPTableTrackKeys.NAME)
      .build();

    const columnStatus = new TableHeaderBuilder()
      .label('state')
      .key(SPTableTrackKeys.STATUS)
      .class("status")
      .build();

    const columnEmail = new TableHeaderBuilder()
      .label('ps:email_example')
      .key(SPTableTrackKeys.EMAIL)
      .class("email")
      .build();

      const columnDetail = new TableHeaderBuilder()
      .label('ps:detail_example')
      .key(SPTableTrackKeys.DETAIL)
      .class("description")
      .build();

    const columnAmount = new TableHeaderBuilder()
      .label('label.statements.amount')
      .key(SPTableTrackKeys.AMOUNT)
      .build();

    tableHeaders.push(columnAccount);
    tableHeaders.push(columnName);
    tableHeaders.push(columnStatus);
    tableHeaders.push(columnEmail);
    tableHeaders.push(columnDetail);
    tableHeaders.push(columnAmount);


    const registerMapped = registers.map(register => {
      return {
        ...register,
       // amount: `${environment.currency} ${this.adfFormat.formatAmount(register.monto)}`,
        status: this.getRegisterStatus(register.statusCuenta.toLowerCase()),
        class: this.getRegisterStatus(register.statusCuenta.toLowerCase()).toLowerCase(),
      }
    })


    return new TableStructuredBuilder()
      .head(tableHeaders)
      .body(registerMapped)
      .manageAlertMessage({
        typeAlert: '',
        message: 'ps:label_zero_register'
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
