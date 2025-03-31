import { StorageService } from '@adf/security';
import { Injectable } from '@angular/core';
import { Resolve} from '@angular/router';
import { Observable, catchError, of, throwError } from 'rxjs';
import { Profile, UserInformation } from 'src/app/models/security-option-modal';
import { SecurityOptionService } from 'src/app/service/private/security-option/security-option.service';
import { SecurityOptionStokenService } from '../services/transaction/security-option-stoken.service';

@Injectable({
  providedIn: 'root',
})
export class SecurityOptionStokenResolver implements Resolve<boolean> {
  profile!: Profile;
  info!: UserInformation;

  constructor(
    private securityOptionStokenService: SecurityOptionStokenService,
    private securityOptionService: SecurityOptionService,
    private storageService: StorageService
  ) {
  }

  resolve(): Observable<any> {
    this.profile = this.securityOptionService.getProfile;
    if (Object.keys(this.profile).length === 0) {
      this.info = JSON.parse(this.storageService.getItem('userInformation'));
      return this.securityOptionStokenService.getProfile(this.info.customerCode).pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    } else {
      return of('Error SecurityOptionResolver ');
    }
  }
}
