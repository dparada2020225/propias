import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenizerAccountsService } from '../../token/tokenizer-accounts.service';

/**
 * @author Eder Santos
 * @date 03/04/2012
 *
 *  Servicios utilizados por las pantallas de consulta de saldos
 */
@Injectable({
  providedIn: 'root',
})
export class AccountBalanceService {
  data: any;

  constructor(private httpClient: HttpClient, private tokenizerEncrypt: TokenizerAccountsService) {}

  /**
   * Recupera el saldo de la cuenta
   *
   * @param account Numero de cuenta
   */
  getAccountBalance(account: any): Observable<any> {
    const accountJson = { account: this.tokenizerEncrypt.tokenizer(account) };
    return this.httpClient.post('/v1/inquiries/account-balance', accountJson);
  }

  getDetailReservation(account: any, type: any): Observable<any> {
    const bodyJson = {
      account: this.tokenizerEncrypt.tokenizer(account),
      type: type,
    };
    return this.httpClient.post('/v1/inquiries/clearing', bodyJson);
  }
}
