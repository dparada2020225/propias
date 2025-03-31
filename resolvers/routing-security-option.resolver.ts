import { StorageService } from '@adf/security';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserInformation } from '../models/security-option-modal';
import { CheckProfileService } from '../service/general/check-profile.service';

/**
 * @author Fabian Serrano
 * @date 07/05/21
 *
 */
@Injectable({
  providedIn: 'root',
})
export class RoutingSecurityOptionResolver implements Resolve<Observable<any>> {
  info!: UserInformation;

  constructor(private checkProfileService: CheckProfileService, private storageService: StorageService) {}

  resolve(): Observable<any> {
    let customerCode = '';

    this.info = JSON.parse(this.storageService.getItem('userInformation'));
    if (this.info) {
      customerCode = this.info.customerCode;
    }

    return this.checkProfileService.getProfile(customerCode).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }
}
