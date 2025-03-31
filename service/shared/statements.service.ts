import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { IAccount } from '../../models/account.inteface';
import { TokenizerAccountsService } from '../token/tokenizer-accounts.service';

export enum EEntryType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT'
}
// tra-ctater


/**
 * @author Sebastian Chicoma S.
 *
 *  Servicios utilizados por las pantallas de estados de cuenta
 */
@Injectable({
  providedIn: 'root'
})
export class StatementsService {

  private mnemonics: Map<string, Array<any>> = new Map();

  data: any;

  constructor(private httpClient: HttpClient,
    private tokenizerEncrypt: TokenizerAccountsService) {
  }

  /**
   * Descarga de documento en formato PDF
   *
   * @param data Filtros
   */
  downloadPdf(data?: any) {
    window.open('assets/pdf-test.pdf', '_blank');
  }

  /**
   * Lista la información, en base a filtros, que serán mostradas en la pantalla de estado de cuenta
   *
   * @param data Filtros
   */
  getData(data: any) {
    console.log(data)
    return this.httpClient.post('/v1/inquiries/account-statement', data);
  }

  /**
   * Obtiene la información de un transacción en base a un número de referencia
   *
   * @param reference Número de referencia
   */
  getDetailForNotes(account: string, date: string, reference: string, currency: string, agency: string, sequence: string): Observable<any> {
    const bodyJson = {
      "account": this.tokenizerEncrypt.tokenizer(account),
      "date": date,
      "reference": reference,
      "currency": currency,
      "agency": agency,
      "sequence": sequence
    };
    return this.httpClient.post('/v1/inquiries/note', bodyJson);
  }

  getDetailForDeposits(account: string, date: string, time: string, reference: string, sequence: string): Observable<any> {
    const bodyJson = {
      "account": this.tokenizerEncrypt.tokenizer(account),
      "date": date,
      "time": time,
      "reference": reference,
      "sequence": sequence
    };
    return this.httpClient.post('/v1/inquiries/deposit-detail', bodyJson);
  }

  /**
   * Servicio para listar cuentas
   *
   * @param service Pantalla actual
   * @param entryType CREDIT o DEBIT
   * @param product Cuentas de monetarias (1) o Ahorros (2)
   */
  getAccounts(service: string, entryType: string, product: string) {
    return this.httpClient.get('/v1/agreement/agreement/accounts', {
      params: { service, entryType, product }
    });
  }

  /**
  * Servicio para listar cuentas sin envio producto
  *
  * @param service EServiceType
  * @param entryType EEntryType
  */
  getAccountsWithoutProduct(service: string, entryType: EEntryType): Observable<IAccount[]> {
    return this.httpClient.get<IAccount[]>('/v1/agreement/agreement/accounts-service', {
      params: { service, entryType }
    });
  }

  getMenmonics(mnemonic: string): Observable<any> {
    return new Observable(observer => {

      if (this.mnemonics.has(mnemonic)) {
        observer.next(this.mnemonics.get(mnemonic) || []);
        observer.complete();
      } else {
        this.httpClient.get('/v1/agreement/agreement/mnemonics', { params: { mnemonic } })
          .pipe(first())
          .subscribe({
            next: (result: any) => {
              this.mnemonics.set(mnemonic, result);
              observer.next(result || []);
              observer.complete();
            },
            error: (error: HttpErrorResponse) => {
              observer.error(error);
            }
          })
      }
    });

  }
}
