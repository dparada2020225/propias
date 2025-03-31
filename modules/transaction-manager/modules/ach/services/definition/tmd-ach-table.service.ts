import { Injectable } from '@angular/core';
import { ITableHeader, TableHeaderBuilder, TableStructuredBuilder } from '@adf/components';
import {
  ETransactionHistoryTableActions,
} from '../../../transaction-history/enums/th-table-keys.enum';
import {
  ETMConsultACH365LoteTableKeys,
  ETMConsultACHAtomicTransferenceTableKeys,
  ETMConsultACHLoteTableKeys,
  ETMConsultACHMultiple365TableKeys,
  ETMConsultACHMultipleTransferenceTableKeys,
  ETMConsultACHSignatoryTableKeys
} from '../../enum/table-control.enum';
import {
  TConsultMultipleACHListRegisters,
} from '../../interfaces/tm-ach-register.interface';
import {
  TTMConsultACHMultiple365List
} from '../../interfaces/tm-multiple-365.interface';
import { IAchLookUpTableParameters } from '../../interfaces/table.interface';
import { ILookUpUniTransactionInLoteRegisterMapped } from '../../interfaces/tm-uni-multiple.interface';
import { ILookUpMultiple365RegisterInLote } from '../../interfaces/t365-multiple-resposne.interface';

@Injectable({
  providedIn: 'root'
})
export class TmdAchTableService {

  constructor() { }

  buildTableLayoutForAtomicTransference(parameters: IAchLookUpTableParameters) {
    const { listTransactions, typeService } = parameters;
    const tableHeaders: ITableHeader[] = [];

    const headerDate = new TableHeaderBuilder()
      .label('date')
      .key(ETMConsultACHAtomicTransferenceTableKeys.DATE)
      .build();
    tableHeaders.push(headerDate);

    const headerTypeTransaction = new TableHeaderBuilder()
      .label('tm:ach:type_label')
      .key(ETMConsultACHAtomicTransferenceTableKeys.OPERATION)
      .build();
    tableHeaders.push(headerTypeTransaction);

    const headerService = new TableHeaderBuilder()
      .label('label:service')
      .key(ETMConsultACHAtomicTransferenceTableKeys.SERVICE)
      .build();
    tableHeaders.push(headerService);

    const headerId = new TableHeaderBuilder()
      .label('tm:ach:no_transference')
      .key(ETMConsultACHAtomicTransferenceTableKeys.ID)
      .selected({ action: ETransactionHistoryTableActions.VIEW_DETAIL })
      .build();
    tableHeaders.push(headerId);

    const headerAccount = new TableHeaderBuilder()
      .label('tm:ach:account_bi')
      .key(ETMConsultACHAtomicTransferenceTableKeys.ACCOUNT)
      .build();
    tableHeaders.push(headerAccount);

    if (typeService !== 'RECEIVE') {
      const headerName = new TableHeaderBuilder()
        .label('accountName')
        .class('head_user')
        .key(ETMConsultACHAtomicTransferenceTableKeys.NAME)
        .build();
      tableHeaders.push(headerName);

    }

    const headerCurrency = new TableHeaderBuilder()
      .label('currency')
      .key(ETMConsultACHAtomicTransferenceTableKeys.CURRENCY)
      .isActive(true)
      .build();
    tableHeaders.push(headerCurrency);

    const headerAmount = new TableHeaderBuilder()
      .label('amount')
      .key(ETMConsultACHAtomicTransferenceTableKeys.AMOUNT)
      .isActive(true)
      .build();
    tableHeaders.push(headerAmount);

    const headerStatus = new TableHeaderBuilder()
      .label('status')
      .key(ETMConsultACHAtomicTransferenceTableKeys.STATUS)
      .build();
    tableHeaders.push(headerStatus);

    return new TableStructuredBuilder()
      .head(tableHeaders)
      .body(listTransactions)
      .manageAlertMessage({
        typeAlert: 'info',
        message: 'tm:ach:not_found_consult2'
      })
      .build();
  }

  buildTableLayoutForLoteRegisters(listTransactions: Array<ILookUpUniTransactionInLoteRegisterMapped>) {
    const tableHeaders: ITableHeader[] = [];

    const headerId = new TableHeaderBuilder()
      .label('tm:ach:label_transference')
      .key(ETMConsultACHLoteTableKeys.ID)
      .selected({ action: ETransactionHistoryTableActions.VIEW_DETAIL })
      .build();
    tableHeaders.push(headerId);

    const headerBankName = new TableHeaderBuilder()
      .label('bank')
      .key(ETMConsultACHLoteTableKeys.BANK_NAME)
      .build();
    tableHeaders.push(headerBankName);

    const headerProduct = new TableHeaderBuilder()
      .label('product')
      .key(ETMConsultACHLoteTableKeys.PRODUCT)
      .build();
    tableHeaders.push(headerProduct);

    const headerCurrency = new TableHeaderBuilder()
      .label('currency')
      .key(ETMConsultACHLoteTableKeys.CURRENCY)
      .isActive(true)
      .build();
    tableHeaders.push(headerCurrency);

    const headerAccount = new TableHeaderBuilder()
      .label('tm365:label_account')
      .key(ETMConsultACHLoteTableKeys.ACCOUNT)
      .build();
    tableHeaders.push(headerAccount);

    const headerAmount = new TableHeaderBuilder()
      .label('amount')
      .key(ETMConsultACHLoteTableKeys.AMOUNT)
      .isActive(true)
      .build();
    tableHeaders.push(headerAmount);

    const headerComment = new TableHeaderBuilder()
      .label('comment')
      .key(ETMConsultACHLoteTableKeys.COMMENT)
      .build();
    tableHeaders.push(headerComment);

    return new TableStructuredBuilder()
      .head(tableHeaders)
      .body(listTransactions)
      .manageAlertMessage({
        typeAlert: 'info',
        message: 'tm:ach:not_found_consult2'
      })
      .build();
  }

  buildTableLayoutForLote365Multiple(listTransactions: Array<ILookUpMultiple365RegisterInLote>) {
    const tableHeaders: ITableHeader[] = [];

    const headerId = new TableHeaderBuilder()
      .label('tm:ach:label_transference')
      .key(ETMConsultACH365LoteTableKeys.ID)
      .selected({ action: ETransactionHistoryTableActions.VIEW_DETAIL })
      .build();
    tableHeaders.push(headerId);

    const headerBankName = new TableHeaderBuilder()
      .label('bank')
      .key(ETMConsultACH365LoteTableKeys.BANK_NAME)
      .build();
    tableHeaders.push(headerBankName);

    const headerProduct = new TableHeaderBuilder()
      .label('product')
      .key(ETMConsultACH365LoteTableKeys.PRODUCT)
      .build();
    tableHeaders.push(headerProduct);

    const headerCurrency = new TableHeaderBuilder()
      .label('currency')
      .key(ETMConsultACH365LoteTableKeys.CURRENCY)
      .isActive(true)
      .build();
    tableHeaders.push(headerCurrency);

    const headerAccount = new TableHeaderBuilder()
      .label('account-number')
      .key(ETMConsultACH365LoteTableKeys.ACCOUNT)
      .build();
    tableHeaders.push(headerAccount);

    const headerTargetAccountName = new TableHeaderBuilder()
      .label('detination_account')
      .key(ETMConsultACH365LoteTableKeys.TARGET_ACCOUNT_NAME)
      .build();
    tableHeaders.push(headerTargetAccountName);

    const headerTypeClient = new TableHeaderBuilder()
      .label('tm365:label_type_person')
      .key(ETMConsultACH365LoteTableKeys.TYPE_CLIENT)
      .build();
    tableHeaders.push(headerTypeClient);

    const headerAmount = new TableHeaderBuilder()
      .label('amount')
      .key(ETMConsultACH365LoteTableKeys.AMOUNT)
      .isActive(true)
      .build();
    tableHeaders.push(headerAmount);

    const headerEmail = new TableHeaderBuilder()
      .label('tm365:label_email')
      .key(ETMConsultACH365LoteTableKeys.EMAIL)
      .build();
    tableHeaders.push(headerEmail);

    const headerComment = new TableHeaderBuilder()
      .label('comment')
      .key(ETMConsultACH365LoteTableKeys.COMMENT)
      .build();
    tableHeaders.push(headerComment);

    return new TableStructuredBuilder()
      .head(tableHeaders)
      .body(listTransactions)
      .manageAlertMessage({
        typeAlert: 'info',
        message: 'tm:ach:not_found_consult2'
      })
      .build();
  }

  buildTableLayoutForMultipleTransference(listTransactions: TConsultMultipleACHListRegisters) {
    const tableHeaders: ITableHeader[] = [];

    const headerDate = new TableHeaderBuilder()
      .label('date')
      .key(ETMConsultACHMultipleTransferenceTableKeys.DATE)
      .build();
    tableHeaders.push(headerDate);

    const headerTypeTransaction = new TableHeaderBuilder()
      .label('tm:ach:label_lote2')
      .key(ETMConsultACHMultipleTransferenceTableKeys.LOTE)
      .selected({ action: ETransactionHistoryTableActions.VIEW_DETAIL })
      .build();
    tableHeaders.push(headerTypeTransaction);

    const headerService = new TableHeaderBuilder()
      .label('amount')
      .key(ETMConsultACHMultipleTransferenceTableKeys.AMOUNT)
      .isActive(true)
      .build();
    tableHeaders.push(headerService);

    const headerId = new TableHeaderBuilder()
      .label('status')
      .key(ETMConsultACHMultipleTransferenceTableKeys.STATUS)
      .build();
    tableHeaders.push(headerId);

    return new TableStructuredBuilder()
      .head(tableHeaders)
      .body(listTransactions)
      .manageAlertMessage({
        typeAlert: 'info',
        message: 'tm:ach:not_found_consult2'
      })
      .build();
  }

  buildTableLayoutForMultiple365Transference(listTransactions: TTMConsultACHMultiple365List) {
    const tableHeaders: ITableHeader[] = [];

    const headerDate = new TableHeaderBuilder()
      .label('date')
      .key(ETMConsultACHMultiple365TableKeys.DATE)
      .build();
    tableHeaders.push(headerDate);

    const headerTypeTransaction = new TableHeaderBuilder()
      .label('tm:ach:type_label')
      .key(ETMConsultACHMultiple365TableKeys.OPERATION)
      .build();
    tableHeaders.push(headerTypeTransaction);

    const headerLote = new TableHeaderBuilder()
      .label('tm:ach:label_lote2')
      .key(ETMConsultACHMultiple365TableKeys.LOTE)
      .selected({ action: ETransactionHistoryTableActions.VIEW_DETAIL })
      .build();
    tableHeaders.push(headerLote);

    const headerAccount = new TableHeaderBuilder()
      .label('tm:ach:account_bi')
      .key(ETMConsultACHMultiple365TableKeys.ACCOUNT)
      .build();
    tableHeaders.push(headerAccount);

    const headerName = new TableHeaderBuilder()
      .label('accountName')
      .class('head_user')
      .key(ETMConsultACHMultiple365TableKeys.NAME)
      .build();
    tableHeaders.push(headerName);

    const headerCurrency = new TableHeaderBuilder()
      .label('currency')
      .key(ETMConsultACHMultiple365TableKeys.CURRENCY)
      .isActive(true)
      .build();
    tableHeaders.push(headerCurrency);

    const headerAmount = new TableHeaderBuilder()
      .label('amount')
      .key(ETMConsultACHMultiple365TableKeys.AMOUNT)
      .isActive(true)
      .build();
    tableHeaders.push(headerAmount);

    const headerStatus = new TableHeaderBuilder()
      .label('status')
      .key(ETMConsultACHMultiple365TableKeys.STATUS)
      .build();
    tableHeaders.push(headerStatus);

    return new TableStructuredBuilder()
      .head(tableHeaders)
      .body(listTransactions)
      .manageAlertMessage({
        typeAlert: 'info',
        message: 'tm:ach:not_found_consult2'
      })
      .build();
  }

  buildTableLayoutForMultiple365ProofModal(listTransactions: Array<ILookUpMultiple365RegisterInLote>) {
    const tableHeaders: ITableHeader[] = [];

    const headerBankName = new TableHeaderBuilder()
      .label('bank')
      .key(ETMConsultACH365LoteTableKeys.BANK_NAME)
      .build();
    tableHeaders.push(headerBankName);

    const headerProduct = new TableHeaderBuilder()
      .label('product')
      .key(ETMConsultACH365LoteTableKeys.PRODUCT)
      .build();
    tableHeaders.push(headerProduct);

    const headerCurrency = new TableHeaderBuilder()
      .label('currency')
      .key(ETMConsultACH365LoteTableKeys.CURRENCY)
      .isActive(true)
      .build();
    tableHeaders.push(headerCurrency);

    const headerAccount = new TableHeaderBuilder()
      .label('account-number')
      .key(ETMConsultACH365LoteTableKeys.ACCOUNT)
      .build();
    tableHeaders.push(headerAccount);

    const headerAmount = new TableHeaderBuilder()
      .label('amount')
      .key(ETMConsultACH365LoteTableKeys.AMOUNT)
      .isActive(true)
      .build();
    tableHeaders.push(headerAmount);

    const headerComment = new TableHeaderBuilder()
      .label('comment')
      .key(ETMConsultACH365LoteTableKeys.COMMENT)
      .build();
    tableHeaders.push(headerComment);

    return new TableStructuredBuilder()
      .head(tableHeaders)
      .body(listTransactions)
      .manageAlertMessage({
        typeAlert: 'info',
        message: 'tm:ach:not_found_consult2'
      })
      .build();
  }

  buildTableForSignatureTransaction(listSignatories: any) {
    const tableHeaders: ITableHeader[] = [];

    const headerUser = new TableHeaderBuilder()
      .label('user')
      .key(ETMConsultACHSignatoryTableKeys.USERNAME)
      .build();
    tableHeaders.push(headerUser);

    const headerTypeSignatory = new TableHeaderBuilder()
      .label('tm:ach:label_type_signature')
      .key(ETMConsultACHSignatoryTableKeys.SIGNATURE_TYPE)
      .build();
    tableHeaders.push(headerTypeSignatory);

    const headerDate = new TableHeaderBuilder()
      .label('date')
      .key(ETMConsultACHSignatoryTableKeys.DATE)
      .build();
    tableHeaders.push(headerDate);

    const headerHour = new TableHeaderBuilder()
      .label('hour')
      .key(ETMConsultACHSignatoryTableKeys.HOUR)
      .build();
    tableHeaders.push(headerHour);

    return new TableStructuredBuilder()
      .head(tableHeaders)
      .body(listSignatories)
      .manageAlertMessage({
        typeAlert: 'info',
        message: 'tm:ach:not_found_consult2'
      })
      .build();
  }
}
