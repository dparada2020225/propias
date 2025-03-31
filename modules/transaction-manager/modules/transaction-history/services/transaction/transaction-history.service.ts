import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITHBodyRequest, ITransactionHistory } from '../../interfaces/transaction-history.interface';

@Injectable({
  providedIn: 'root'
})
export class TransactionHistoryService {

  constructor(
    private http: HttpClient
  ) { }

  getTransactions(request: ITHBodyRequest) {
    return this.http.post<ITransactionHistory[]>('/v1/ach/history', request);
  }
}
