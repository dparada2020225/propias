import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ParameterManagementService} from '../../navegation-parameters/parameter-management.service';
import {IServicesTokenRequired} from '../../../models/token.interface';
import {tap, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenRequestSettingsService {
  constructor(
    private http: HttpClient,
    private parameterManagerService: ParameterManagementService,
  ) {
  }

  getServiceCodeSettings() {
    return this.http.post<IServicesTokenRequired>('/v1/agreement/agreement/token-service', null)
      .pipe(
        tap(response => {
          this.parameterManagerService.sendParameters({
            tokenRequestSettings: {
              services: response?.services || [],
              status: 0,
            },
          });
        }),
        catchError((error) => {
          this.parameterManagerService.sendParameters({
            tokenRequestSettings: {
              services: [],
              status: 1,
            },
          });

          return throwError(() => error);
        })
      );
  }

}
