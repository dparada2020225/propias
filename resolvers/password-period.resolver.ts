import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SecurityOptionService } from '../service/private/security-option/security-option.service';

/**
 * @author Fabian Serrano
 * @date 07/05/21
 *
 */
@Injectable({
  providedIn: 'root',
})
export class PasswordPeriodResolver implements Resolve<Observable<any>> {
  constructor(private securityOptionService: SecurityOptionService) {}

  resolve(): Observable<any> {
    return this.securityOptionService.getPasswordPeriod().pipe(catchError((error) => of(error)));
  }
}
