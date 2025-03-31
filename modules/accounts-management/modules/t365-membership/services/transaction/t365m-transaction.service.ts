import { Injectable } from '@angular/core';
import { concatMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IS365AffiliationAccountList } from '../../interfaces/affiliation.interface';
import {
  IM365AffiliateBodyRequest,
  IM365DisaffiliateBodyRequest, IM365UpdateAffiliationBodyRequest
} from '../../interfaces/transaction-service.interface';
import { ERequestTypeTransaction } from '../../../../../../enums/transaction-header.enum';
import { UtilTransactionService } from '../../../../../../service/common/util-transaction.service';

@Injectable({
  providedIn: 'root'
})
export class T365mTransactionService {
  private TRANSFER_SERVICE = '/v3/ach/M365';


  constructor(
    private http: HttpClient,
    private utilTransaction: UtilTransactionService,

  ) { }

  getAffiliation() {
    return this.http.get<IS365AffiliationAccountList>('/v3/ach/M365');
  }

  affiliate(bodyRequest: IM365AffiliateBodyRequest, isTokenRequired: boolean, tokenValue?: string) {
    const headers = this.utilTransaction.addHeaderByToken({
      service: this.TRANSFER_SERVICE,
      typeTransaction: ERequestTypeTransaction.ACH_TRANSFER,
      token: tokenValue as string,
      isTokenRequired,
    });

    return this.http.post(this.TRANSFER_SERVICE, bodyRequest, {
      headers,
    });

  }

  disaffiliate(bodyRequest: IM365DisaffiliateBodyRequest) {
    return this.http.post('/v3/ach/delete/M365', bodyRequest);
  }

  update(bodyRequest: IM365UpdateAffiliationBodyRequest) {
    const { oldAccount, ...affiliation} = bodyRequest;
    return this.disaffiliate({ account: bodyRequest.oldAccount }).pipe(
      concatMap(() => this.affiliate(affiliation, false)),
    )
  }
}
