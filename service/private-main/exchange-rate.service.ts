import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

/**
 * @author Susan Roldán
 * @date 23/06/2021
 *
 *  Servicios utilizados para recuperar las tasas de cambio
 */
@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

  constructor(private httpClient: HttpClient) {
  }

  getExchangeRate() {
    return this.httpClient.get('/v1/exchanges/rates');
  }
}
