import { Injectable } from '@angular/core';
import {
  ICurrentLimitsResponse,
  ISpCurrentLimitsRequestBody,
  ISpSetLimitsRequestBody
} from '../../interfaces/sp-limits.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SpLimitsTransactionService {

  constructor(
    private http: HttpClient
  ) { }

  getCurrentLimits(requestBody: ISpCurrentLimitsRequestBody) {
    return this.http.post<ICurrentLimitsResponse[]>('/v1/sec-profile/new-security-profile/transactional-limits/consult', requestBody);
  }

  setLimits(requestBody: ISpSetLimitsRequestBody) {
    return this.http.post('/v1/sec-profile/new-security-profile/transactional-limits/add-limits', requestBody);
  }
}
