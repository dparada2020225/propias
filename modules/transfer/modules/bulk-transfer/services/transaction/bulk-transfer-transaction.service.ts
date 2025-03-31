import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBulkTransactionRequestBody } from '../../models/bul-transaction.interface';
import {
  IPreRequestBulkTRequest,
  IPreResponseBulkT,
  IResponseLote
} from '../../models/bulk-transfer.interface';
import {
  IBTDetailBodyRequest,
  IBTSaveTransactionRequest,
  IBTSaveTransactionResponse
} from '../../interfaces/bt-transaction.interface';
import { IBTNotification } from '../../interfaces/bt-notification.interface';
import { ERequestTypeTransaction } from '../../../../../../enums/transaction-header.enum';
import { UtilTransactionService } from 'src/app/service/common/util-transaction.service';

/**
 * @author Fabian Serrano
 * @date 19/04/22
 *
 */
@Injectable({
  providedIn: 'root'
})
export class BulkTransactionService {
  private PRE_TRANSFER_SERVICE_URL = '/v1/massive-transferences/pre-transfer';

  constructor(
    private http: HttpClient,
    private utilTransaction: UtilTransactionService,
  ) { }

  preTransfer(isTokenRequired: boolean, data: IPreRequestBulkTRequest, tokenValue: string){
    const header = this.utilTransaction.addHeaderByToken({
      typeTransaction: ERequestTypeTransaction.ACH_TRANSFER,
      token: tokenValue,
      isTokenRequired: isTokenRequired,
      service: this.PRE_TRANSFER_SERVICE_URL
    })


    return this.http.post<IPreResponseBulkT>(this.PRE_TRANSFER_SERVICE_URL, data, {
      headers: header
    });
  }

  codLote(){
    return this.http.post<IResponseLote>('/v1/massive-transferences/ach-correlative', null);
  }

  bulkGeneralInformation(){
    return this.http.get('/v1/transferences/ach/configuration/general');
  }

  bulkTransfer( data: IBulkTransactionRequestBody): Observable<any>{
    return this.http.post<any>('/v1/massive-transferences/transfer', data);
  }


  saveTransaction(body: IBTSaveTransactionRequest) {
    return this.http.post<IBTSaveTransactionResponse>('/v1/massive-transferences/transactions/save', body);
  }


  bulkTransactionDetail(body: IBTDetailBodyRequest) {
    return this.http.post<IBTSaveTransactionRequest>('/v1/massive-transferences/transactions', body);
  }

  notification(body: IBTNotification) {
    return this.http.post('/v1/massive-transferences/send-mail-management', body);
  }


}
