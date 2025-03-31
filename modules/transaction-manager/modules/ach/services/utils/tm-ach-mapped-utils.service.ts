import { Injectable } from '@angular/core';
import {
  ITMLookUpACHTransferenceResponse,
  ITMLookUpACHUniIncomingTransferenceResponse
} from '../../interfaces/transfer.interface';
import { ITMLookUpAchRegisterMapped } from '../../interfaces/transfer-mapped.interface';
import {
  ILookUpUniTransactionInLoteRegisterMapped,
  ILookUpUniTransactionLoteDetailRawResponse, ILookUpUniTransactionLoteDetailResponseMapped,
  ITMLookUpUniMultipleRawResponse, IUniMultipleListRegisters,
  TLookUpAchMultipleListResponse
} from '../../interfaces/tm-uni-multiple.interface';
import { IACHBiesGeneralParameters } from '../../../../../../models/ach-general-parameters.interface';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from '../../../../../../service/common/util.service';
import { TranslateService } from '@ngx-translate/core';
import { ItmAch365ServiceResponse, ITransferAch365DetailResponse } from '../../interfaces/t365-response.interface';
import { EACHServiceMapped } from '../../../../../transfer/enum/ach-transaction.enum';
import {
  I365MultipleTransactionRegister,
  IConsulAch365MultipleResponse
} from '../../interfaces/t365-multiple-resposne.interface';
import { AdfFormatService } from '@adf/components';

@Injectable({
  providedIn: 'root'
})
export class TmAchMappedUtilsService {

  constructor(
    private utils: UtilService,
    private translate: TranslateService,
    private adfFormat: AdfFormatService,
  ) { }

  mappedTransfer365Response(response: ItmAch365ServiceResponse | null) {
    if (!response) return [];

    return response.operation.transactions.map(transaction => {
      return {
        dateParsed: this.mappedDate(transaction.date),
        date: transaction.date,
        hour: transaction.hour,
        id: transaction.transactionNumber,
        operation: this.mappedService(transaction.type),
        operationRaw: transaction.type,
        service: this.mappedOperation(transaction.transactionType),
        serviceRaw: transaction.transactionType,
        account: transaction.account,
        name: transaction.name,
        currency: transaction.currency,
        amount: String(this.utils.formatAmount(transaction.amount)),
        status: this.mappedStatus(transaction.status),
      }
    });
  }

  mappedTransferDetail365Response(response: ITransferAch365DetailResponse | null) {
    if (!response) return {
      id: '',
      bankName: '',
      targetAccount: '',
      comment: '',
      error: '',
      date: '',
      targetAccountName: '',
      targetProductName: '',
      transactionId: '',
    };

    const [ transaction ] = response.detail

    return {
      id: transaction.authorization,
      bankName: transaction.bank,
      targetAccount: transaction.targetAccount,
      comment: transaction.comment,
      error: transaction.errorDescription,
      date: transaction.date,
      targetAccountName: transaction.targetName,
      targetProductName: transaction.type,
      transactionId: transaction.transactionId,
    }
  }

  mappedUniOutGoingTransactionResponse(registers: ITMLookUpACHTransferenceResponse | null): Array<ITMLookUpAchRegisterMapped> {
    if (!registers) return [];

    return registers.achConsultItemList.map(register => {
      return {
        dateParsed: register.fecha,
        hour: register.hora,
        id: register.transferencia,
        operation: this.mappedService(register.tipoTrx),
        service: register.tipoTransferencia,
        account: register.cuenta,
        name: register.nombre,
        currency: register.moneda,
        amount: String(this.utils.formatAmount(register.monto)),
        status: this.mappedStatus(register.estado),
      }
    });
  }

  mappedIncomingUniTransactionResponse(registers: ITMLookUpACHUniIncomingTransferenceResponse | null): Array<ITMLookUpAchRegisterMapped> {
    if (!registers) return [];

    return registers.items.map(register => {
      return {
        dateParsed: register.fecha,
        hour: register.hora,
        id: register.transferencia,
        operation: this.mappedService(register.tipoTrx),
        service: register.tipoTransferencia,
        account: register.cuenta,
        name: '',
        currency: register.moneda,
        amount: String(register.monto),
        status: this.mappedStatus(register.estado),
      }
    });
  }

  mappedMultipleUniLoteResponse(registers: ITMLookUpUniMultipleRawResponse | null): TLookUpAchMultipleListResponse {
    if (!registers) return [];

    return registers.achLoteItemList.map((register) => {
      return {
        date: register.fecha,
        hour: register.hora,
        lote: register.lote,
        account: register.cuenta,
        name: register.nombre,
        total: String(this.utils.formatAmount(register.total)),
        status: this.mappedStatus(register.estado),
        dateParsed: register.fecha,
        transactions: []
      }
    });
  }

  mappedUniTransactionLoteDetailResponse(response: ILookUpUniTransactionLoteDetailRawResponse | null, parameters: IACHBiesGeneralParameters): ILookUpUniTransactionLoteDetailResponseMapped {
    if (!response) {
      return {
        date: '',
        hour: '',
        lote: '',
        account: '',
        name: '',
        total: 0,
        status: '',
        transactions: [],
      }
    }

    return {
      date: response.fecha,
      hour: response.hora,
      lote: response.lote,
      account: response.cuenta,
      name: response.nombre,
      total: response.total,
      status: response.estado,
      transactions: this.mappedRegisterInLoteForUniMultipleTransaction(response.transacciones, parameters),
    }
  }

  buildDateToBodyRequest(date: NgbDate) {
    const year = date.year;
    const day = date.day;
    const month = date.month - 1;

    const currentDate = new Date(Date.UTC(year, month, day, 0, 0, 0));
    return currentDate.toISOString().replace('.000', '');
  }

  parseDateToService(date: NgbDate) {
    const { day, month, year } = date;
    return `${day.toString().padStart(2, '0')}${month.toString().padStart(2, '0')}${year}`
  }

  foundBankName(bankId: string, parameters: IACHBiesGeneralParameters) {
    const bankName = parameters.banks.find(bank => {
      return bank.routes.find(route => Number(route.code) === Number(bankId))
    });

    return bankName ? bankName.description : bankId;
  }

  mappedService(service: string) {
    const serviceMapped = {
      'E': this.translate.instant('co-enviada'),
      'R': this.translate.instant('co-recibida'),
    }

    const serviceFound = serviceMapped[service];

    return serviceFound ?? service;
  }

  mappedStatus(status: string) {
    const statusMapped = {
      'FAILED': this.translate.instant('co-fallida'),
      'SUCCESS': this.translate.instant('ach:label_success_status'),
      'PENDING': this.translate.instant('co-pendiente'),
      'REC': this.translate.instant('co-rejected'),
      'OPE': this.translate.instant('co-operated'),
      'ERR': this.translate.instant('co-err'),
      'PRO': this.translate.instant('co-pro'),
      'PEN': this.translate.instant('co-pen'),
      'REVERSED': this.translate.instant('co-reversed'),
    }

    const statusFound = statusMapped[status];

    return statusFound ?? status;
  }

  mappedTypeOfService(service: string) {
    const statusMapped = {
      'SEND': 'E',
      'RECEIVE': 'R',
    }

    const statusFound = statusMapped[service];

    return statusFound ?? service;
  }

  mappedOperation(operation: string) {
    const serviceMapped = {
      [EACHServiceMapped.MOVIL_365]: this.translate.instant('m365:label_txn'),
      [EACHServiceMapped.NORMAL_365]: this.translate.instant('t365:label_txn'),
      [EACHServiceMapped.SIPA]: this.translate.instant('s365:label_txn'),
    }

    const serviceFound = serviceMapped[operation];

    return serviceFound ?? operation;
  }
  private mappedTypeClient(client: string) {
    const mapped = {
      'J': this.translate.instant('label_client_type_j'),
      'N': this.translate.instant('label_client_type_n'),
    }

    return mapped[client] ?? client;
  }

  private mappedDate(date: string) {
    const day = date.slice(0, 2);
    const month = date.slice(2, 4);
    const year = date.slice(4, 8);

    return `${day}/${month}/${year}`
  }

  private mappedRegisterInLoteForUniMultipleTransaction(list: IUniMultipleListRegisters, parameters: IACHBiesGeneralParameters): Array<ILookUpUniTransactionInLoteRegisterMapped> {
    return list.map(register => {
      return {
        id: register.transaccion,
        type: register.tipo,
        bank: register.banco,
        product: register.producto,
        currency: register.moneda,
        account: register.cuenta,
        name: register.nombre,
        amount: String(this.utils.formatAmount(register.monto)),
        comment: register.comentario,
        statusDescription: register.descripcionEstado,
        idTransference: register.id,
        bankName: this.foundBankName(register.banco, parameters),
      }
    })
  }

  mappedMultiple365LoteResponse(registers: IConsulAch365MultipleResponse | null) {
    if (!registers) return [];

    if (!registers.hasOwnProperty('batch')) return [];


    return registers.batch.map((register) => {
      return {
        date: register.date,
        dateParsed: this.adfFormat.getFormatDateTime(`${register.date}${register.time}`).standard,
        hour: register.time,
        lote: Number(register.lotNumber),
        bankName: register.bankCode,
        account: register.accountOrigin,
        accountName: register.accountHolderName,
        typeOperation: this.mappedService('E'),
        currency: register.currency,
        product: register.process,
        total: String(this.utils.formatAmount(register.amount)),
        amount: String(this.utils.formatAmount(register.amount)),
        status: register.status,
        productName: register.process,
        email: register.email,
        registers: this.mappedRegisterInLote365Multiple(register?.detail?.transactions ?? []),
      }
    });
  }

  private mappedRegisterInLote365Multiple(registers: Array<I365MultipleTransactionRegister>) {
    return registers.map(transaction => {
      return {
        id: transaction.transactionNumber,
        operation: this.mappedService(transaction.transactionType),
        operationRaw: transaction.transactionType,
        comment: transaction.commission,
        bankName: transaction.bankCode,
        email: transaction.email,
        product: transaction.productCode,
        account: transaction.accountNumber,
        name: transaction.beneficiaryAccountNumber,
        currency: transaction.mandateNumber,
        amount: String(this.utils.formatAmount(transaction.amount)),
        status: transaction.transactionStatus,
        typeClientParsed: this.mappedTypeClient(transaction.period).toUpperCase(),
      }
    })
  }
}
