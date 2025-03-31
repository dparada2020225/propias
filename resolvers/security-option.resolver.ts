import { StorageService } from '@adf/security';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Profile, UserInformation } from '../models/security-option-modal';
import { CheckProfileService } from '../service/general/check-profile.service';
import { SecurityOptionService } from '../service/private/security-option/security-option.service';


/**
 * @author Fabian Serrano
 * @date 07/05/21
 *
 */
@Injectable({
    providedIn: 'root'
})
export class SecurityOptionResolver implements Resolve<Observable<any>>{

    profile!: Profile;
    info!: UserInformation;

    constructor(
        private checkProfileService: CheckProfileService,
        private securityOptionService: SecurityOptionService,
        private storageService: StorageService
    ) { }

    resolve(): Observable<any> {

        this.profile = this.securityOptionService.getProfile;

        if (Object.keys(this.profile).length === 0) {
            this.info = JSON.parse(this.storageService.getItem('userInformation'));

            return this.checkProfileService.getProfile(this.info.customerCode)
                .pipe(
                    catchError(error => {
                     return of(error)})
                );
        } else {
            return of('Error SecurityOptionResolver ');
        }
    }
}