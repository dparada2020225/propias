import { Injectable } from '@angular/core';
import { concatMap } from 'rxjs';
import { AM365AccountList } from '../../interfaces/associated-account.interface';
import { HttpClient } from '@angular/common/http';
import { ERequestTypeTransaction } from '../../../../../../enums/transaction-header.enum';
import { UtilTransactionService } from '../../../../../../service/common/util-transaction.service';
import {
  IM365AddAccountBodyRequest, IM365AddFavoriteBodyRequest,
  IM365DeleteAccountBodyRequest, IM365DeleteFavoriteBodyRequest, IM365UpdateAccountBodyRequest
} from '../../interfaces/transaction-service.interface';

@Injectable({
  providedIn: 'root'
})
export class AmM365TransactionService {
  private BASE_URL = '/v3/ach/T365';
  private BASER_URL_DELETE = '/v3/ach/delete/T365';

  constructor(
    private http: HttpClient,
    private utilTransaction: UtilTransactionService,
  ) { }

  getAssociatedAccount() {
    return this.http.get<AM365AccountList>('/v3/ach/T365');
  }

  addAccount(request: IM365AddAccountBodyRequest, isTokenRequired: boolean, tokenValue: string | undefined) {
    const header = this.utilTransaction.addHeaderByToken({
      typeTransaction: ERequestTypeTransaction.ACH_TRANSFER,
      token: tokenValue,
      isTokenRequired: isTokenRequired,
      service: this.BASE_URL
    });

    return this.http.post(`/v3/ach/add/T365`, request, {
      headers: header,
    });
  }

  updateAccount(request: IM365UpdateAccountBodyRequest, isTokenRequired: boolean, tokenValue: string | undefined) {
    const header = this.utilTransaction.addHeaderByToken({
      typeTransaction: ERequestTypeTransaction.ACH_TRANSFER,
      token: tokenValue,
      isTokenRequired: isTokenRequired,
      service: this.BASER_URL_DELETE
    });

    return this.http.post(`${this.BASER_URL_DELETE}`, {
      account: request.currentAccount.account,
      properties: {
        bank: request.currentAccount.bank,
      }
    })
      .pipe(
        concatMap(() => this.http.post('/v3/ach/add/T365', {
          account: request.newAccount.account,
          name: request.newAccount.name,
          favorite: request.currentAccount.favorite,
          properties: {
            favorite: request.currentAccount.favorite,
            bank: request.newAccount.properties.bank,
            email: request.newAccount.properties.email,
          }
        }, {
          headers: header,
        })),
      )
  }

  deleteAccount(request: IM365DeleteAccountBodyRequest, isTokenRequired: boolean, tokenValue: string | undefined) {
    const header = this.utilTransaction.addHeaderByToken({
      typeTransaction: ERequestTypeTransaction.ACH_TRANSFER,
      token: tokenValue,
      isTokenRequired: isTokenRequired,
      service: this.BASER_URL_DELETE
    });

    return this.http.post(`${this.BASER_URL_DELETE}`, request, {
      headers: header,
    });
  }

  deleteFavorite(bodyRequest: IM365DeleteFavoriteBodyRequest) {
    return this.http.post('/v3/ach/delete/T365/favorite', bodyRequest);
  }

  addFavorite(bodyRequest: IM365AddFavoriteBodyRequest) {
    return this.http.put('/v3/ach/add/T365/favorite', bodyRequest);
  }
}
