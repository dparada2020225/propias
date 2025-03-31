import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, forkJoin, of } from 'rxjs';
import { EProfile } from 'src/app/enums/profile.enum';
import { FlowErrorBuilder } from 'src/app/models/error.interface';
import { environment } from 'src/environments/environment';
import { StknBisvUtilsService } from '../utils/stkn-bisv-utils.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityOptionStokenService {

  constructor(
    private httpClient: HttpClient,
    private logOutSTokenService: StknBisvUtilsService

  ) { }

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

  checkProfile(costumer): Observable<any> {     
    return this.getProfileExposed(costumer).pipe(
      catchError(error => of(
        new FlowErrorBuilder()
          .error(error?.error)
          .message(error?.error?.message ?? 'error')
          .status(error?.status)
          .build()
      ))
    );
  }

  getProfileExposed(costumer): Observable<any> {
    return this.httpClient.get('/v1/sec-profile/new-security-profile/passless/check-profile', { params: { customer: costumer }, observe: 'response' });

  }
  checkProfileContact(costumer): Observable<any> {     
    return this.getCheckProfileContactExposed(costumer).pipe(
      catchError(error => of(
        new FlowErrorBuilder()
          .error(error?.error)
          .message(error?.error?.message ?? 'error')
          .status(error?.status)
          .build()
      ))
    );
}

getCheckProfileContactExposed(costumer): Observable<any> { 
  return this.httpClient.get('/v1/sec-profile/new-security-profile/passless/check-profile-contact', { params: { customer: costumer }, observe: 'response' });
}

sendAffiliationCodeExpose(phone: string, codeOperator: string, codeArea: string, email:string): Observable<any> {
  console.log('phone ', phone, 'codeOperator ', codeOperator, 'codeArea ', codeArea, 'email ', email);
  let json = { phone, codeOperator, codeArea, email };
  return this.httpClient.post('/v1/sec-profile/new-security-profile/passless/send-affiliation-code', json);
}




}
