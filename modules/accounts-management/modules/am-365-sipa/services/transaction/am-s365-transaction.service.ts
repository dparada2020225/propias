import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  IS365AddAccountBodyRequest,
  IS365DeleteAccountBodyRequest, IS365DeleteFavorite,
  IS365UpdateAccountBodyRequest
} from '../../interfaces/s365-transaction.interface';
import { ERequestTypeTransaction } from '../../../../../../enums/transaction-header.enum';
import { UtilTransactionService } from '../../../../../../service/common/util-transaction.service';
import { TAMSipaAccountList } from '../../../../interfaces/am-account-list.interface';
import { TAMS365ListOfCountry } from '../../interfaces/s365-catalogs.interface';


@Injectable({
  providedIn: 'root'
})
export class AmS365TransactionService {
  private ACH_URL = '/v3/ach'

  constructor(
    private http: HttpClient,
    private utilTransaction: UtilTransactionService,
  ) { }

  getAccounts() {
    return this.http.get<TAMSipaAccountList>('/v3/ach/SIPA');
  }

  getListOfCountry() {
    return this.http.get<TAMS365ListOfCountry>('/v1/sec-profile/update-data/catalogs/sipa-countries');
  }

  getListOfBanks(countryCode: string) {
    const params = new HttpParams()
      .set('country', countryCode);

    return this.http.get<TAMS365ListOfCountry>('/v1/sec-profile/update-data/catalogs/sipa-banks', {
      params,
    });
  }

  getListOfProduct(countryCode: string, bankCode: string) {
    const params = new HttpParams()
      .set('country', countryCode)
      .set('bank', bankCode);

    return this.http.get<TAMS365ListOfCountry>('/v1/sec-profile/update-data/catalogs/sipa-products-banks', {
      params,
    });
  }

  addAccount(request: IS365AddAccountBodyRequest, isTokenRequired: boolean, tokenValue?: string) {
    const header = this.utilTransaction.addHeaderByToken({
      typeTransaction: ERequestTypeTransaction.ACH_TRANSFER,
      token: tokenValue,
      isTokenRequired: isTokenRequired,
      service: this.ACH_URL
    });

    return this.http.post(`${this.ACH_URL}/add/SIPA`, request, {
      headers: header,
    });
  }

  updateAccount(request: IS365UpdateAccountBodyRequest, isTokenRequired: boolean, tokenValue?: string) {
    const header = this.utilTransaction.addHeaderByToken({
      typeTransaction: ERequestTypeTransaction.ACH_TRANSFER,
      token: tokenValue,
      isTokenRequired: isTokenRequired,
      service: this.ACH_URL
    });

    return this.http.put(`${this.ACH_URL}/modify/SIPA`, request, {
      headers: header,
    });
  }

  deleteAccount(bodyRequest: IS365DeleteAccountBodyRequest, isTokenRequired: boolean, tokenValue?: string) {
    const header = this.utilTransaction.addHeaderByToken({
      typeTransaction: ERequestTypeTransaction.ACH_TRANSFER,
      token: tokenValue,
      isTokenRequired: isTokenRequired,
      service: this.ACH_URL
    });

    return this.http.post(`${this.ACH_URL}/delete/SIPA`, bodyRequest, {
      headers: header,
    });
  }

  addFavorite(parameters: IS365DeleteFavorite) {
    return this.http.put('/v3/ach/add/SIPA/favorite', parameters);
  }

  deleteFavorite(parameters: IS365DeleteFavorite) {
    return this.http.post('/v3/ach/delete/SIPA/favorite', parameters);
  }
}
