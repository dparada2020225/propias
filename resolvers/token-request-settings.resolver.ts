import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TokenRequestSettingsService } from '../service/private/token/token-request-settings.service';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TokenRequestSettingsResolver implements Resolve<Observable<any>> {

  constructor(
    private tokenRequestSettings: TokenRequestSettingsService,
  ) {
  }

  resolve(): Observable<any> {
    return this.tokenRequestSettings.getServiceCodeSettings()
      .pipe(catchError(error => {
        return of({ error: error.error });
      }));

  }
}
