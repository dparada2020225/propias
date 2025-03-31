import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAddFavoriteACH } from '../../interfaces/ach-transfer.interface';
import { IAchAccount, V3IAchAccount } from '../../interfaces/ach-account-interface';
import { IUpdateAch } from '../../interfaces/update-account-ach-interface';
import {
  IACHAddAccountRequestParameters,
  IAchCrudTransactionResponse
} from '../../interfaces/crud/crud-create.interface';
import { Observable } from 'rxjs';
import { IACHSettings } from '../../interfaces/settings.interface';
import { IACHScheduleResponse, IAchTransactionRequestBody, IMassiveMessage } from '../../interfaces/ach-transaction.interface';
import { EACHTypeSchedule } from '../../enum/transfer-ach.enum';
import { UtilTransactionService } from 'src/app/service/common/util-transaction.service';
import {  ERequestTypeTransaction } from '../../../../../../enums/transaction-header.enum';
import { IACHLimitsRequestBody, IACHLimitsResponse } from '../../interfaces/ach-limits.interface';

/**
 * @author Fabian Serrano
 * @date 19/04/22
 *
 */
@Injectable({
  providedIn: 'root'
})
export class TransferACHService {
  private CRUD_OPERATIONS_SERVICE = '/v1/ach';
  private TRANSACTION_SERVICE = '/v1/massive-transferences/credit-transfer';

  constructor(
    private httpClient: HttpClient,
    private utilTransaction: UtilTransactionService
  ) { }

  /*
  //TODO: descomentar luego
  associatedAccounts(): Observable<IAchAccount[]> {
    return this.httpClient.get<IAchAccount[]>('/v1/ach');
  }
    */

    // associatedAccounts(clientNumber: string): Observable<IAchAccount[]> {
    //   return this.httpClient.get<IAchAccount[]>('/v1/ach');
    // }

  associatedAccounts(clientNumber: string): Observable<IAchAccount[]> {
    const params = new HttpParams()
      .set('clientNumber', clientNumber);

    return this.httpClient.get<IAchAccount[]>(`/v1/ach/uni/information/ach-target-accounts`, {
      params,
    });
  }

  associatedAccountsV3(clientNumber: string): Observable<V3IAchAccount[]> {
    return this.httpClient.get<V3IAchAccount[]>('/v3/ach/ACH').pipe();

  }

  achTransfer(isTokenRequired: boolean, data: IAchTransactionRequestBody, tokenValue: string | null) {
    const headers = this.utilTransaction.addHeaderByToken({
      service: this.TRANSACTION_SERVICE,
      typeTransaction: ERequestTypeTransaction.ACH_TRANSFER,
      token: tokenValue as string,
      isTokenRequired,
    });


    return this.httpClient.post<any>(this.TRANSACTION_SERVICE, data, {
      headers,
    });
  }

  addFavorite(parameters: IAddFavoriteACH) {
    return this.httpClient.post('/v1/favorites/ach', {
      number: parameters?.number,
      alias: parameters?.alias,
    });
  }

  deleteFavorite(numberAccount: string) {
    return this.httpClient.delete(`/v1/favorites/ach/${numberAccount}`);
  }

  createAccountAch(parameters: IACHAddAccountRequestParameters) {
    const { bodyRequest, token, isTokenRequired } = parameters;
    const headers = this.utilTransaction.addHeaderByToken({
      typeTransaction: ERequestTypeTransaction.ACH_TRANSFER,
      token,
      isTokenRequired,
      service: this.CRUD_OPERATIONS_SERVICE,
    });

    return this.httpClient.post<IAchCrudTransactionResponse>(this.CRUD_OPERATIONS_SERVICE, bodyRequest, {
      headers,
    });
  }

  updateAccountAch(updateAch: IUpdateAch, bank: string = '0', account: string = '') {
    return this.httpClient.put<IAchCrudTransactionResponse>(`/v1/ach/${bank}/${account}`, updateAch);
  }

  deleteAccountAch(bank: number = 0, account: string = '') {
    return this.httpClient.delete<IAchCrudTransactionResponse>(`/v1/ach/${bank}/${account}`);
  }

  achSettings() {
    return this.httpClient.get<IACHSettings[]>('/v1/transferences/ach/configuration');
  }

  getSchedule(typeSchedule: EACHTypeSchedule) {
    return this.httpClient.post<IACHScheduleResponse[]>('/v1/massive-transferences/schedules', {
      hpe: typeSchedule,
    });
  }

  commissionMessages(){
    return this.httpClient.post<IMassiveMessage[]>('/v1/massive-transferences/commission-messages', null);
  }

  transactionLimits(data: IACHLimitsRequestBody){
    return this.httpClient.post<IACHLimitsResponse>('/v1/transferences/ach-limits', {
      service: data.service,
      currency: data.currency
    });
  }
}
