import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ERequestTypeTransaction } from '../../../../../../enums/transaction-header.enum';
import { IB2bRequestBody, IB2bRequestConfig, IB2bRequestResponse } from '../../interfaces/b2b-request.interface';
import { IFixedDeadlines } from '../../interfaces/fixed-deadlines.interface';
import { UtilTransactionService } from 'src/app/service/common/util-transaction.service';

@Injectable({
  providedIn: 'root'
})
export class B2bRequestService {
  constructor(
    private http: HttpClient,
    private utilTransaction: UtilTransactionService,
  ) { }

  requestExecute(isTokenRequired: boolean, requestData: IB2bRequestBody, tokenValue: string) {

    const headers = this.utilTransaction.addHeaderToken(ERequestTypeTransaction.REQUEST_BACK_TO_BACK, tokenValue);

    const headerService = isTokenRequired ? headers : {};

    return this.http.post<IB2bRequestResponse>('/v1/back-to-back/execute', requestData, {
      headers: headerService
    });
  }

  getConfig() {
    return this.http.get<IB2bRequestConfig>(`/v1/back-to-back/configuration`);
  }

  getAll() {
    return this.http.get<IFixedDeadlines[]>('/v1/back-to-back/fixed-term');
  }
}
