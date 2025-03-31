import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenizerAccountsService } from '../../../service/token/tokenizer-accounts.service';

@Injectable({
  providedIn: 'root'
})
export class TermDepositService {
  data: any;

  constructor(private httpClient: HttpClient,
              private tokenizerEncrypt: TokenizerAccountsService) {
  }

  /**
   * Lista la información por número de cuenta
   *
   * @param account
   */
  getDataByAccount(account: string) {
    const accountJson = { "account" : this.tokenizerEncrypt.tokenizer(account)};
    return this.httpClient.post('/v1/inquiries/account-balance/fixed-term', accountJson);
  }
}
