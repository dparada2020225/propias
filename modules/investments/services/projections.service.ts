import { Injectable } from '@angular/core';
import { TokenizerAccountsService } from '../../../service/token/tokenizer-accounts.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectionsService {
  constructor(private httpClient: HttpClient,
              private tokenizerEncrypt: TokenizerAccountsService,
  ) {
  }

  /**
   * Lista la información por número de cuenta
   *
   * @param account
   */
  getDataByAccount(account: string) {
    const accountJson = { "account": this.tokenizerEncrypt.tokenizer(account) };
    return this.httpClient.post('/v1/inquiries/account-balance/fixed-term-movements', accountJson);
  }

  buildInformationHelper(information) {
    // Usar listas en los templates para no perder el orden de los elementos

    for (const key of Object.keys(information)) {
      const section = information[key];
      if (typeof section === 'object' && !(section instanceof Array)) {
        const list: any[] = [];

        Object.keys(section).forEach(element => {
          list.push({ key: element, value: section[element] });
        });

        section.toList = list;
      }
    }
  }
}
