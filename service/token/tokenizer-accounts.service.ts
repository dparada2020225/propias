import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BankingAuthenticationService } from '@adf/security';
import { environment } from 'src/environments/environment';

/**
 * @author Susan Roldán
 * @date 18/10/2021
 *
 *  Servicio utilizado para encriptar el número de cuenta
 */

@Injectable({
  providedIn: 'root',
})
export class TokenizerAccountsService {
  constructor(private httpClient: HttpClient, private bankingService: BankingAuthenticationService) {}

  tokenizer(account) {
    if (environment.tokenize) {
      return this.bankingService.encrypt(account);
    } else {
      return account;
    }
  }
}
