import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  IS365RateToApplyRequest, IS365TermsConditionInfoResponse,
  IS365TransferRequest, IS365TransferResponse,
  TS365TransferReasonList
} from '../../interfaces/transfer.interface';
import { ERequestTypeTransaction } from '../../../../../../enums/transaction-header.enum';
import { UtilTransactionService } from '../../../../../../service/common/util-transaction.service';
import { I365TransferRequest } from '../../../../interface/365-transfer.interface';

@Injectable({
  providedIn: 'root'
})
export class S365TransactionService {
  private TRANSFER_SERVICE = '/v1/ach/uni/information/transfer';

  constructor(
    private http: HttpClient,
    private utilTransaction: UtilTransactionService,
  ) { }

  transfer(bodyRequest: I365TransferRequest, isTokenRequired: boolean, tokenValue?: string) {
    const headers = this.utilTransaction.addHeaderByToken({
      service: this.TRANSFER_SERVICE,
      typeTransaction: ERequestTypeTransaction.ACH_TRANSFER,
      token: tokenValue as string,
      isTokenRequired,
    });

    return this.http.post<IS365TransferResponse>(this.TRANSFER_SERVICE, bodyRequest, {
      headers,
    });
  }

  getTransferReason() {
    return this.http.get<TS365TransferReasonList>('/v1/sec-profile/update-data/catalogs/sipa-reason');
  }

  reateToApplyTransaction(bodyRequest: IS365RateToApplyRequest) {
    console.log(bodyRequest);
    return this.http.post('/v1/modular/transferences/rate-to-apply', bodyRequest);
  }

  getTermsConditionsInfo() {
    return this.http.get<IS365TermsConditionInfoResponse>('/v1/ach/information/terms-conditions-sipa');
  }
}
