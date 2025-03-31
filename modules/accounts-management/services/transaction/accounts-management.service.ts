import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IACHBiesGeneralParameters } from '../../../../models/ach-general-parameters.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IT365TermAndConditionResponse } from '../../interfaces/terms-condition.interface';

@Injectable({
  providedIn: 'root'
})
export class AccountsManagementService {

  constructor(
    private http: HttpClient,
  ) { }


  getACHGeneralParameters(clientNumber: string): Observable<IACHBiesGeneralParameters> {
    const params = new HttpParams()
      .set('clientNumber', clientNumber);

    return this.http.get<IACHBiesGeneralParameters>(`/v1/ach/uni/information/general-parameters`, {
      params,
    });
  }

  getTermAndConditions(clientNumber: string, service: string) {
    const params = new HttpParams()
      .set('clientNumber', clientNumber)
      .set('serviceType', service);

    return this.http.get<IT365TermAndConditionResponse>('/v1/ach/uni/information/terms-status', {
      params,
    });
  }
}
