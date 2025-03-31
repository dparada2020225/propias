import { Injectable } from '@angular/core';
import {
  ITMLookUpACHTransferenceAtomicRequest,
  ITMLookUpACHTransferenceResponse,
  ITMLookUpACHUniIncomingTransferenceResponse,
  ITMLookUpUniTransactionDetailRequest
} from '../../interfaces/transfer.interface';
import { ETMACHTypeTransaction } from '../../enum/form-control-name.enum';
import { Observable, of } from 'rxjs';
import {  map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { IUniTransactionDetailResponse } from '../../interfaces/transfer-mapped.interface';
import {
  ILookUpUniTransactionLoteDetailRawResponse,
  ITMLookUpUniMultipleRawResponse,
} from '../../interfaces/tm-uni-multiple.interface';
import { IACHBiesGeneralParameters } from '../../../../../../models/ach-general-parameters.interface';
import { TmAchMappedUtilsService } from '../utils/tm-ach-mapped-utils.service';
import { ITMAtomicACHUniIncomingTransactionDetail } from '../../interfaces/tm-atomic-transaction-detail.interface';
import { ETMLookUpAchTypeService } from '../../enum/catalog.enum';
import { ItmAch365ServiceResponse, ITransferAch365DetailResponse } from '../../interfaces/t365-response.interface';
import { EACHServiceMapped } from '../../../../../transfer/enum/ach-transaction.enum';
import { IConsulAch365MultipleResponse } from '../../interfaces/t365-multiple-resposne.interface';

@Injectable({
  providedIn: 'root'
})
export class TmAchTransactionService {

  constructor(
    private http: HttpClient,
    private mappedUtilService: TmAchMappedUtilsService,
  ) { }

  getAchRegisterForAtomicTransfer(parameters: ITMLookUpACHTransferenceAtomicRequest): Observable<any> {
    const { typeTransaction } = parameters;

    const responseMapped = {
      [ETMACHTypeTransaction.UNI]: () => this.getUniTransactionList(parameters),
      [ETMACHTypeTransaction.NORMAL_365]: () => this.getListOfM365Transactions(parameters),
      [ETMACHTypeTransaction.MOVIL_365]: () => this.getListOf365MovilTransactions(parameters),
      [ETMACHTypeTransaction.SIPA]: () => this.getListOfS365Transactions(parameters),
    }


    const response = responseMapped[typeTransaction];
    if (!response) return of([]);

    return response();
  }

  private getListOfM365Transactions(parameters: ITMLookUpACHTransferenceAtomicRequest) {
    const { typeService } = parameters;

    const typeServiceToSearch = this.mappedUtilService.mappedTypeOfService(typeService);
    return this.getListOfTransaction365(parameters).pipe(
      map((response) => {
        const mappedTransactions = this.mappedUtilService.mappedTransfer365Response(response);
        return mappedTransactions.filter(txn => txn.serviceRaw === EACHServiceMapped.NORMAL_365)
          .filter(trx => trx.operationRaw === typeServiceToSearch);
      }),
    );
  }

  private getListOfS365Transactions(parameters: ITMLookUpACHTransferenceAtomicRequest) {
    const { typeService } = parameters;

    const typeServiceToSearch = this.mappedUtilService.mappedTypeOfService(typeService);
    return this.getListOfTransaction365(parameters).pipe(
      map((response) => {
        const mappedTransactions = this.mappedUtilService.mappedTransfer365Response(response);
        return mappedTransactions.filter(txn => txn.serviceRaw === ETMACHTypeTransaction.TRANSFER_SIPA)
          .filter(trx => trx.operationRaw === typeServiceToSearch);
      }),
    );
  }

  private getListOf365MovilTransactions(parameters: ITMLookUpACHTransferenceAtomicRequest) {
    const { typeService } = parameters;

    const typeServiceToSearch = this.mappedUtilService.mappedTypeOfService(typeService);
    return this.getListOfTransaction365(parameters).pipe(
      map((response) => {
        const mappedTransactions = this.mappedUtilService.mappedTransfer365Response(response);
        return mappedTransactions.filter(txn => txn.serviceRaw === EACHServiceMapped.MOVIL_365)
          .filter(trx => trx.operationRaw === typeServiceToSearch);
      }),
    );
  }

  private getListOf365SipaTransactions(parameters: ITMLookUpACHTransferenceAtomicRequest) {}

  private getListOfTransaction365(parameters: ITMLookUpACHTransferenceAtomicRequest) {
    const { initialDate, finalDate, clientCode } = parameters;
    const init = this.mappedUtilService.parseDateToService(initialDate);
    const final = this.mappedUtilService.parseDateToService(finalDate);

    return this.http.post<ItmAch365ServiceResponse>('/v1/ach/information/ach-inquiry-transfer', {
      customer: clientCode,
      startDate: init,
      endDate: final,
    });
  }

  getTransactionDetailFor365Transfer(id: string, transferenceType: string) {
    return this.http.post<ITransferAch365DetailResponse>('/v1/ach/information/ach-inquiry-transfer-detail', {
      transferenceNumber: id,
      transferenceType,
    }).pipe(
      map((response) => this.mappedUtilService.mappedTransferDetail365Response(response))
    )
  }

  getUniOutgoingTransactionDetail(request: ITMLookUpUniTransactionDetailRequest) {
    return this.http.post<IUniTransactionDetailResponse>('/v1/ach/uni/query/getOutgoingTransactionDetail', {
      noTransferencia: request.transactionId,
      tipoTransferencia: request?.service ?? '',
    });
  }

  getUniIncomingTransactionDetail(request: ITMLookUpUniTransactionDetailRequest) {
    return this.http.post<ITMAtomicACHUniIncomingTransactionDetail>('/v1/ach/uni/query/getIncomingTransaction', {
      noTransferencia: request.transactionId,
    });
  }

  getAchRegisterForMultipleTransfer(parameters: ITMLookUpACHTransferenceAtomicRequest) {
    const { clientCode, initialDate, finalDate } = parameters;
    const dateInit = this.mappedUtilService.buildDateToBodyRequest(initialDate);
    const dateEnd = this.mappedUtilService.buildDateToBodyRequest(finalDate);

    return this.http.post<ITMLookUpUniMultipleRawResponse | null>('/v1/ach/uni/query/getMultiOutgoingTransaction', {
      numeroCliente: clientCode,
      fechaIni: dateInit,
      fechaFin: dateEnd,
    }).pipe(map((response) => this.mappedUtilService.mappedMultipleUniLoteResponse(response)));
  }

  getAchRegisterForMultiple365Transfer(parameters: ITMLookUpACHTransferenceAtomicRequest) {
    const { initialDate, finalDate, clientCode } = parameters;
    const init = this.mappedUtilService.parseDateToService(initialDate);
    const final = this.mappedUtilService.parseDateToService(finalDate);

    return this.http.post<IConsulAch365MultipleResponse>('/v1/ach/information/ach-inquiry-transfer-lot', {
      customer: clientCode,
      startDate: init,
      endDate: final,
    }).pipe(
      map((response) => this.mappedUtilService.mappedMultiple365LoteResponse(response))
    )
  }

  getLoteDetail(id: string, parameters: IACHBiesGeneralParameters) {
    return this.http.post<ILookUpUniTransactionLoteDetailRawResponse | null>('/v1/ach/uni/query/getOutgoingTransactionByLot', {
      lote: id,
    }).pipe(map((response) => this.mappedUtilService.mappedUniTransactionLoteDetailResponse(response, parameters)))
  }

  getLoteDetailForTransferMultiple365() {

  }

  getSignatoryByTransaction(cif: string, id: string, service = 'ach-transf') {
    return this.http.post('/v1/signature-tracking/signatures', {
      numberClient: cif,
      transactionNumber: id,
      // transactionNumber: "ZxAwHsEhqURx",
      serviceName: service,
    });
  }

  private getUniTransactionList(parameters: ITMLookUpACHTransferenceAtomicRequest) {
    const { typeService } = parameters;

    if (typeService === ETMLookUpAchTypeService.OUTGOING) return this.getUniOutgoingTransaction(parameters);

    return this.getUniIncomingTransaction(parameters);
  }

  private getUniIncomingTransaction(parameters: ITMLookUpACHTransferenceAtomicRequest) {
    const { clientCode, initialDate, finalDate } = parameters;
    const dateInit = this.mappedUtilService.buildDateToBodyRequest(initialDate);
    const dateEnd = this.mappedUtilService.buildDateToBodyRequest(finalDate);

    return this.http.post<ITMLookUpACHUniIncomingTransferenceResponse | null>('/v1/ach/uni/query/getIndividualIncomingTransaction', {
      numeroCliente: clientCode,
      fechaIni: dateInit,
      fechaFin: dateEnd,
    }).pipe(map((response) => this.mappedUtilService.mappedIncomingUniTransactionResponse(response)));
  }

  private getUniOutgoingTransaction(parameters: ITMLookUpACHTransferenceAtomicRequest) {
    const { clientCode, initialDate, finalDate } = parameters;
    const dateInit = this.mappedUtilService.buildDateToBodyRequest(initialDate);
    const dateEnd = this.mappedUtilService.buildDateToBodyRequest(finalDate);

    return this.http.post<ITMLookUpACHTransferenceResponse | null>('/v1/ach/uni/query/getIndividualOutgoingTransaction', {
      numeroCliente: clientCode,
      fechaIni: dateInit,
      fechaFin: dateEnd,
    }).pipe(map((response) => this.mappedUtilService.mappedUniOutGoingTransactionResponse(response)));
  }
}
