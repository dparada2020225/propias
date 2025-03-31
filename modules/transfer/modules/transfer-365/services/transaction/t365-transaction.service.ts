import { Injectable } from '@angular/core';
import { ERequestTypeTransaction } from '../../../../../../enums/transaction-header.enum';
import { UtilTransactionService } from '../../../../../../service/common/util-transaction.service';
import { I365TransferRequest } from '../../../../interface/365-transfer.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class T365TransactionService {
  private TRANSFER_SERVICE = '/v1/ach/uni/information/transfer';

  constructor(
    private utilTransaction: UtilTransactionService,
    private http: HttpClient,
  ) { }


  transaction365(isTokenRequired: boolean, data: I365TransferRequest, tokenValue: string | null) {
    const headers = this.utilTransaction.addHeaderByToken({
      service: this.TRANSFER_SERVICE,
      typeTransaction: ERequestTypeTransaction.ACH_TRANSFER,
      token: tokenValue as string,
      isTokenRequired,
    });

    return this.http.post<any>(this.TRANSFER_SERVICE, data, {
      headers,
    });
  }
}
