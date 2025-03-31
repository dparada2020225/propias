import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ITTRUpdateAccountRequest} from '../../interfaces/crud/update-third-interface';
import {IAddFavoriteThird} from '../../interfaces/third-crud.interface';
import {
  ICrateAccountThirdTransferResponse,
  IGetThirdTransferResponse, IThirdTransferNotifyRequest,
  ITransferThird
} from '../../interfaces/third-transfer-service';
import {IThirdTransfer, IThirdTransfersAccounts} from '../../../../interface/transfer-data-interface';
import {ERequestTypeTransaction} from '../../../../../../enums/transaction-header.enum';
import {UtilTransactionService} from 'src/app/service/common/util-transaction.service';
import {ITTRAddAccountRequest} from '../../interfaces/crud/add-third-interface';
import {ITTRDeleteAccountRequest} from "../../interfaces/crud/delete-third-interface";
import {BankingAuthenticationService} from "@adf/security";

/**
 * @author Fabian Serrano
 * @date 19/04/22
 *
 */
@Injectable({
  providedIn: 'root'
})
export class TransferThirdService {
  private CRUD_OPERATIONS_SERVICE = '/v1/thirdparties';
  private TRANSACTION_SERVICE = '/v1/transferences/third';

  constructor(
    private utilTransaction: UtilTransactionService,
    private httpClient: HttpClient,
    private bankingService: BankingAuthenticationService,
  ) {
  }

  associateAccount(parameters: ITTRAddAccountRequest) {
    const {bodyRequest, token, isTokenRequired} = parameters;
    const headers = this.utilTransaction.addHeaderByToken({
      typeTransaction: ERequestTypeTransaction.AUTHENTICATION,
      token,
      isTokenRequired,
      service: this.CRUD_OPERATIONS_SERVICE,
    });

    return this.httpClient.post<ICrateAccountThirdTransferResponse>(this.CRUD_OPERATIONS_SERVICE, bodyRequest, {
      headers,
    });
  }

  update(parameters: ITTRUpdateAccountRequest): Observable<any> {
    const {bodyRequest, token, isTokenRequired} = parameters;

    const headers = this.utilTransaction.addHeaderByToken({
      typeTransaction: ERequestTypeTransaction.AUTHENTICATION,
      token,
      isTokenRequired,
      service: this.CRUD_OPERATIONS_SERVICE,
    });

    return this.httpClient.put(this.CRUD_OPERATIONS_SERVICE, bodyRequest, {
      observe: 'response', headers
    });
  }

  delete(parameters: ITTRDeleteAccountRequest): Observable<any> {
    const {numberAccount, token, isTokenRequired} = parameters;

    const headers = this.utilTransaction.addHeaderByToken({
      typeTransaction: ERequestTypeTransaction.AUTHENTICATION,
      token,
      isTokenRequired,
      service: this.CRUD_OPERATIONS_SERVICE,
    });
    return this.httpClient.post(`/v1/thirdparties/delete`, {
        account: numberAccount
      },
      {
        observe: 'response',
        headers
      }
    );
  }

  deleteFavorite(account: string): Observable<any> {
    return this.httpClient.post(`/v1/favorites/thirdparties/delete`, {
      account
    });
  }

  addFavorite(account: IAddFavoriteThird): Observable<any> {
    return this.httpClient.post(`/v1/favorites/thirdparties`, {number: account?.number, alias: account?.alias});
  }

  getThird(account: string) {
    return this.httpClient.post<IGetThirdTransferResponse>(`/v1/thirdparties/general-info`, {
      account
    });
  }

  getTransferThird(isTokenRequired: boolean, data: IThirdTransfer, tokenValue: string): Observable<ITransferThird> {
    const headers = this.utilTransaction.addHeaderByToken({
      typeTransaction: ERequestTypeTransaction.THIRD_PARTY_TRANSFER,
      token: tokenValue,
      isTokenRequired,
      service: this.TRANSACTION_SERVICE,
    });

    return this.httpClient.post<ITransferThird>(this.TRANSACTION_SERVICE, data,
      {
        headers,
      }
    );
  }

  getAssociatedThirdAccounts(): Observable<IThirdTransfersAccounts[]> {
    return this.httpClient.get<IThirdTransfersAccounts[]>(this.CRUD_OPERATIONS_SERVICE);
  }

  getTransferThirdFavoriteAccount(): Observable<IThirdTransfersAccounts[]> {
    return this.httpClient.get<IThirdTransfersAccounts[]>('/v1/favorites/thirdparties');
  }

  notify(bodyRequest: IThirdTransferNotifyRequest) {
    return this.httpClient.post<any>('/v1/transferences/notifications', bodyRequest);
  }
}
