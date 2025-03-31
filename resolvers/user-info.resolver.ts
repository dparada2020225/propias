import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SecurityService } from '../service/private/security.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserInfoResolver implements Resolve<boolean> {
  constructor(
    private securityService: SecurityService
  ) { }

  resolve(): Observable<any> {
    return this.securityService.getUserInfo().pipe(catchError(error => {
      return of({ error: error.error });
    }));
  }
}
