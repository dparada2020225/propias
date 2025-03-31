import { Injectable } from '@angular/core';
import { TokenizerAccountsService } from '../../../../../../service/token/tokenizer-accounts.service';
import { HttpClient } from '@angular/common/http';
import { IB2bConsultationAccounts } from '../../interfaces/b2b-consultation-service.interface';
import { IB2bConsultationDetail } from '../../interfaces/b2b-consultation.interface';

@Injectable({
  providedIn: 'root'
})
export class B2bConsultationTransactionService {
  constructor(private httpClient: HttpClient,
              private tokenizerAccount: TokenizerAccountsService) { }

  b2bList() {
    return this.httpClient.get<IB2bConsultationAccounts[]>('/v1/back-to-back');
  }

  b2bDetail(b2bID: string) {
    return this.httpClient.post<IB2bConsultationDetail>('/v1/back-to-back/detail', { account: this.tokenizerAccount.tokenizer(b2bID) } );
  }
}
