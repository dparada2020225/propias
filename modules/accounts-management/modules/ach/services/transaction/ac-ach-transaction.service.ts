import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { IAchAccount, IV3AchAccounts, V3IAchAccount } from '../../../../../transfer/modules/transfer-ach/interfaces/ach-account-interface';
import { HttpClient } from '@angular/common/http';
import {
  IAMACHAddAccountRequest,
  IAMACHDeleteAccountRequest,
  IAMACHUpdateAccountRequest
} from '../../interfaces/transaction.interface';

@Injectable({
  providedIn: 'root'
})
export class AcAchTransactionService {

  constructor(
    private httpClient: HttpClient,
  ) { }


  associatedAccounts(): Observable<V3IAchAccount[]> {
    return this.httpClient.get<V3IAchAccount[]>('/v3/ach/ACH').pipe();
  }

  addAccount(request: IAMACHAddAccountRequest) {
    return this.httpClient.post('/v3/ach/add/ACH', request);
  }

  updateAccount(request: IAMACHUpdateAccountRequest) {
    const url = '/v3/ach/modify/ACH';
    return this.httpClient.put(url, request.request);
  }

  deleteAccount(request: IAMACHDeleteAccountRequest) {
    const url = '/v3/ach/delete/ACH';
    const properties = {
      bank: Number(request.bankCode)
    };
    const deleteRequest = {
      account: request.accountNumber,
      properties
    };
    return this.httpClient.post(url, deleteRequest );
  }

  deleteFavorite(account: string) {
    const deleteRequest = {
      account
    };
    const url = '/v3/ach/delete/ACH/favorite';
    return this.httpClient.post(url, deleteRequest);
  }

  addFavorite(item: V3IAchAccount) {
    const properties = {
      bank: Number(item.bank)
    };
    const request = {
      account: item.account,
      alias: item.alias,
      properties
    };
    const url = '/v3/ach/add/ACH/favorite';
    return this.httpClient.put(url, request);
  }

}
