import { EventEmitter, Injectable } from '@angular/core';
import { Observable, Subject, catchError, finalize, forkJoin, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EProfile } from 'src/app/enums/profile.enum';
import { environment } from 'src/environments/environment';
import { FlowErrorBuilder } from 'src/app/models/error.interface';
import { Profile } from 'src/app/models/security-option-modal';
import { StknBisvUtilsService } from 'src/app/view/private/soft-token/modules/stoken-bisv/services/utils/stkn-bisv-utils.service';

/**
 * @author Fabian Serrano
 * @date 24/03/21
 *
 * service that allows us to obtain the value of the hotp
 */
@Injectable(
    { providedIn: 'root' }
)
export class CheckProfileService {

    public errorLoggingEvent: EventEmitter<any> = new EventEmitter();

    constructor(
        private httpClient: HttpClient,
        private logOutSTokenService: StknBisvUtilsService
    ) { }

    notifyErrorToLogin(message: string) {
        this.errorLoggingEvent.emit(message);
    }

    getProfile(costumer): Observable<any> {
        if(environment.profile === EProfile.SALVADOR){
            return new Observable((observable) => {
                forkJoin([this.checkProfile(costumer), this.checkProfileContact(costumer)]).pipe(finalize(() => {observable.complete()})).subscribe({
                  next: (data) => {
                    if ((data[0].hasOwnProperty('body') && data[1].hasOwnProperty('body')) && data[0].body.registrationRequired) {
                        const objSend = { code: data[0].body.code || '',
                          decription: data[0].body.decription || '',
                          status: data[1].body.status || '',
                          registrationRequired: data[0].body.registrationRequired || '',
                          phone: data[1].body.phone || '',
                          codeOperator: data[1].body.codeOperator || '',
                          email: data[1].body.email || '',
                          lastConnectionDate: data[0].body.lastConnectionDate || '',
                          hasPendings: data[0].body.hasPendings || '',
                          managedUser: data[0].body.managedUser || '',
                          periodChangePassword: data[0].body.periodChangePassword || '',
                          profile: data[0].body.profile || '',
                          userType: data[0].body.userType || '',
                          error: data[0].body.error || '',
                          reference: data[1].body.reference || '',
                          codeError: data[1].body.codeError || '',
                          description: data[1].body.description || '',
                          incompleteProfile: data[1].body.incompleteProfile || '',
                          changePeriod: data[1].body.changePeriod || '',
                          operatorDescription: data[1].body.operatorDescription || '',
                          idClient: data[1].body.idClient || '',
                          idGen: data[1].body.idGen || '',
                          codeArea: data[1].body.codeArea || '' };
                          console.log('obj send ', objSend)
                        data.push(objSend)
                        observable.next(data);
                    }else {
                      this.logOutSTokenService.logOut();
                    }
                  },
                  error: (error) => {
                    observable.next(error);
                  }
                })});
        }else {
              return this.checkProfile(costumer);
        }

    }

    postponeRegisterProfile(data?: any): Observable<any> {
        return this.httpClient.post('/v1/sec-profile/new-security-profile/postpone-profile', data);
    }

    validateUser(): Observable<any> {
      return this.httpClient.get('/v1/sec-profile/new-security-profile/validate-user');
    }

    checkProfile(costumer): Observable<any> {
        return this.getCheckProfile(costumer).pipe(
          catchError(error => of(
            new FlowErrorBuilder()
              .error(error?.error)
              .message(error?.error?.message ?? 'error')
              .status(error?.status)
              .build()
          ))
        );
      }
    getCheckProfile(costumer): Observable<any> {
        return this.httpClient.get('/v1/sec-profile/new-security-profile/check-profile', { params: { customer: costumer }, observe: 'response' });
      }

    getCheckProfileExposed(costumer): Observable<any> {
        return this.httpClient.get('/v1/sec-profile/new-security-profile/passless/check-profile', { params: { customer: costumer }, observe: 'response' });
      }

    checkProfileContact(costumer): Observable<any> {
        return this.getCheckProfileContact(costumer).pipe(
          catchError(error => of(
            new FlowErrorBuilder()
              .error(error?.error)
              .message(error?.error?.message ?? 'error')
              .status(error?.status)
              .build()
          ))
        );
    }

    getCheckProfileContact(costumer): Observable<any> {
        return this.httpClient.get('/v1/sec-profile/new-security-profile/check-profile-contact', { params: { customer: costumer }, observe: 'response' });
    }

    getCheckProfileContactExposed(costumer): Observable<any> {
      return this.httpClient.get('/v1/sec-profile/new-security-profile/passless/check-profile-contact', { params: { customer: costumer }, observe: 'response' });
  }
}
