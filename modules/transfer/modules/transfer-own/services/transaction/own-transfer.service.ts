import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IExecuteOwnTransfer } from '../../interfaces/own-transfer.interface';
import { IResponseOwnTransfers } from '../../interfaces/own-transfer-respoce.interface';
import { UtilTransactionService } from '../../../../../../service/common/util-transaction.service';
import { IBodyRequest } from '../../../../../../models/token.interface';
import { ERequestTypeTransaction } from '../../../../../../enums/transaction-header.enum';

/**
 * @author Fabian Serrano
 * @date 19/04/22
 *
 */
@Injectable({
  providedIn: 'root',
})
export class OwnTransferService {
  private OWN_SERVICE = '/v1/transferences/own'

  constructor(
    private http: HttpClient,
    private utilTransaction: UtilTransactionService,
  ) {}

  ownTransfer(parameters: IBodyRequest<IExecuteOwnTransfer>): Observable<IResponseOwnTransfers> {
    const { isTokenRequired, token, bodyRequest } = parameters;
    const headers = this.utilTransaction.addHeaderByToken({
      typeTransaction: ERequestTypeTransaction.AUTHENTICATION,
      token,
      isTokenRequired,
      service: this.OWN_SERVICE,
    });

    return this.http.post<IResponseOwnTransfers>(this.OWN_SERVICE, bodyRequest, {
      headers,
    });
  }
}
