import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ITM365CorrelativeResponse, ITM365TransferRequest } from '../../interfaces/transfer.interface';
import {
  ITMAchUniResponse,
  ITMAchUniTransactionRequest
} from '../../../transfer-ach-uni-multiple/interfaces/ach-uni-tm-transaction';
import { Observable } from 'rxjs';
import { ERequestTypeTransaction } from '../../../../../../enums/transaction-header.enum';
import { UtilTransactionService } from '../../../../../../service/common/util-transaction.service';

@Injectable({
  providedIn: 'root'
})
export class Tm365TransactionService {

  constructor(
    private http: HttpClient,
    private utilTransaction: UtilTransactionService,
  ) { }

  getCorrelative() {
    return this.http.get<ITM365CorrelativeResponse>('/v1/massive-transferences/generate-correlative');
  }

  fileTransfer(uploadFile: FormData) {
    const params = new HttpParams()
      .set('mnemonic', 'T365-MULTIPLE');

    return this.http.post(`/v1/file-transfer/upload-file`, uploadFile, {
      params,
    });
  }

  transfer(request: ITM365TransferRequest) {
    return this.http.post('/v1/massive-transferences/multiple-transfer', request);
  }

  executeMultipleTransfer(request: ITMAchUniTransactionRequest, isTokenRequired: boolean, tokenValue?: string): Observable<any> {
    const headers = this.utilTransaction.addHeaderByToken({
      service: '/v1/massive-transferences/uni/execute-transfer',
      typeTransaction: ERequestTypeTransaction.ACH_TRANSFER,
      token: tokenValue as string,
      isTokenRequired: false,
    });

    return this.http.post<ITMAchUniResponse>(`/v1/massive-transferences/uni/execute-transfer`, request, {
      headers,
    });
  }
}
