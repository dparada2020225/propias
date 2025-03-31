import { AdfFormatService, ITableHeader, TableHeaderBuilder, TableStructuredBuilder } from '@adf/components';
import {Injectable} from '@angular/core';
import {
  ICACHTableParameters,
  TACHDebitsTable,
  TCACHCreditsTable
} from '../../interfaces/consult-ach-definition.interface';
import {ConsultACHTableKeys} from '../../interfaces/consult-ach-form.interface';
import {CACH_TYPE_MOVEMENTS} from "../../const/cach-common.enum";
import { UtilService } from '../../../../../../service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class CadTableService {

  constructor(
    private adfFormat: AdfFormatService,
    private util: UtilService
  ) { }

  buildTableDefinition(parameters: ICACHTableParameters) {
    const tableHeaders: ITableHeader[] = [];

    const headDate = new TableHeaderBuilder()
      .label('date')
      .class('head-date')
      .key(ConsultACHTableKeys.DATE)
      .selected(parameters?.typeOperation=== CACH_TYPE_MOVEMENTS.DEBIT ? null as any : { action: 'goToDetail' })
      .build();
    tableHeaders.push(headDate);

    const headSender = new TableHeaderBuilder()
      .label('beneficiary_sender')
      .class('head-sender')
      .key(ConsultACHTableKeys.BENEFICIARY)
      .build();
    tableHeaders.push(headSender);

    const headOperation = new TableHeaderBuilder()
      .label('operation')
      .class('head-operation')
      .key(ConsultACHTableKeys.OPERATION)
      .build();
    tableHeaders.push(headOperation);

    const headTypeOperation = new TableHeaderBuilder()
      .label('operation_type')
      .class('head-type_operation')
      .key(ConsultACHTableKeys.TYPE_OPERATION)
      .build();
    tableHeaders.push(headTypeOperation);

    const headDestinationBank = new TableHeaderBuilder()
      .label('destination_bank_transmitter')
      .class('head-destinationBank')
      .key(ConsultACHTableKeys.DESTINATION_BANK)
      .build();
    tableHeaders.push(headDestinationBank);

    const headStatus = new TableHeaderBuilder()
      .label('status_type')
      .class('head-status')
      .key(ConsultACHTableKeys.STATUS)
      .build();
    tableHeaders.push(headStatus);

    const headCurrency = new TableHeaderBuilder()
      .label('currency')
      .class('head-currency')
      .key(ConsultACHTableKeys.CURRENCY)
      .isActive(true)
      .build();
    tableHeaders.push(headCurrency);

    const headAmount = new TableHeaderBuilder()
      .label('amount')
      .class('head-mount')
      .key(ConsultACHTableKeys.AMOUNT)
      .isActive(true)
      .build();
    tableHeaders.push(headAmount);

    return new TableStructuredBuilder()
      .head(tableHeaders)
      .body(this.parsedAccounts(parameters))
      .manageAlertMessage({
        typeAlert: 'warning',
        message: 'ach-consult:empty_consult_details',
      })
      .build();
  }


  parsedAccounts(parameters: ICACHTableParameters) {
    const { operations, typeOperation } = parameters;

    if (typeOperation === CACH_TYPE_MOVEMENTS.DEBIT) {
      return this.parseDebitOperations(operations as TACHDebitsTable);
    }

    return this.parseCreditOperations(operations as TCACHCreditsTable);
  }

  private parseCreditOperations(operations: TCACHCreditsTable) {
    return operations.map(detail => ({
      ...detail,
      datetime: this.adfFormat.getFormatDateTime(detail?.creationDate).standard,
      amount: this.adfFormat.formatAmount(detail?.amount),
      beneficiary: detail?.senderBeneficiary,
      typeOperation: detail?.transfer,
      bank: detail?.issuingDestination,
      currency: this.util.getCurrencySymbolToIso(detail?.currency)
    }));
  }

  private parseDebitOperations(operations: TACHDebitsTable) {
    return operations.map(operation => ({
      ...operation,
      datetime: operation?.date,
      amount: this.adfFormat.formatAmount(operation?.amount),
      beneficiary: operation?.beneficiary,
      typeOperation: operation?.operationType,
      bank: operation?.receivingBank,
      currency: this.util.getCurrencySymbolToIso(operation?.currency)
    }));
  }
}

