import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITMAchUniResponse, ITMAchUniTransactionRequest } from '../../interfaces/ach-uni-tm-transaction';
import {
  IBisvMassiveAchLoteDetailRawResponse,
  TBisvMassiveAchLoteDetailMappedResponse
} from '../../interfaces/lote-detail.interface';
import { map } from 'rxjs/operators';
import { UtilTransactionService } from '../../../../../../service/common/util-transaction.service';
import { ERequestTypeTransaction } from '../../../../../../enums/transaction-header.enum';

@Injectable({
  providedIn: 'root'
})
export class TmAchUniTransactionService {

constructor(
  private httpClient: HttpClient,
  private utilTransaction: UtilTransactionService,
) { }

  getTransactionDetailByLote(clientNumber: string, lote: string) {
    const params = new HttpParams()
      .set('clientNumber', clientNumber)
      .set('lot', lote);

    return this.httpClient.get<IBisvMassiveAchLoteDetailRawResponse | null>('/v1/massive-transferences/uni/ach-details', {
      params,
    }).pipe(
      map((response) => this.mappedTransactionDetailByLote(response))
    )
  }

  executeMultipleTransfer(request: ITMAchUniTransactionRequest, isTokenRequired: boolean, tokenValue?: string): Observable<any> {
    const headers = this.utilTransaction.addHeaderByToken({
      service: '/v1/massive-transferences/uni/execute-transfer',
      typeTransaction: ERequestTypeTransaction.ACH_TRANSFER,
      token: tokenValue as string,
      isTokenRequired,
    });

    return this.httpClient.post<ITMAchUniResponse>(`/v1/massive-transferences/uni/execute-transfer`, request, {
      headers,
    });
  }

  private mappedTransactionDetailByLote(response: IBisvMassiveAchLoteDetailRawResponse | null): TBisvMassiveAchLoteDetailMappedResponse {
    if (!response) return [];

    if (!response.hasOwnProperty('achDetails')) return [];

    return response.achDetails.map(register => {
      return {
        id: register.id,
        business: register.empresa,
        lote: register.lote,
        bankCode: register.banco,
        product: register.producto,
        currency: register.moneda,
        account: register.cuenta,
        amount: register.monto,
        comment: register.comentario,
        bankName: register.bancoDesc,
        productName: register.productoDesc,
        serviceType: register.serviceType,
        targetType: register.targetType,
        email: register.email
      }
    });
  }
}
