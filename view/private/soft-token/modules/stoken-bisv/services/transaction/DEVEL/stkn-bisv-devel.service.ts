import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ERequestTypeTransaction } from 'src/app/enums/transaction-header.enum';
import { UtilTransactionService } from 'src/app/service/common/util-transaction.service';
import { IActivateAfiliation, IAssignStknBisv, IGenerateQRStknBisv, IGracePeriodStknBisv } from '../../../interfaces/stkn-bisv-devel.interface';

@Injectable({
  providedIn: 'root'
})
export class StknBisvDevelService {

  constructor(
    private http: HttpClient,
    private utilTransaction: UtilTransactionService

  ) { }

  /**
   * assignTokenType method to call the service
   * that creates the user in DEVEL
   * @returns
   */
  assignTokenType(useToken: boolean, token?: string): Observable<IAssignStknBisv> {

    if (useToken && token) {
      const headers = this.utilTransaction.addHeaderToken(ERequestTypeTransaction.AUTHENTICATION, token);
      return this.http.post<IAssignStknBisv>('/v1/tokens/assign-token-type', null, { headers })
    }

    return this.http.post<IAssignStknBisv>('/v1/tokens/assign-token-type', null)


  }

  generateCodeQR(clientType: string, token?: string): Observable<any> {
          const headers = this.utilTransaction.addHeaderByToken({
          typeTransaction:  ERequestTypeTransaction.AUTHENTICATION,
          token,
          isTokenRequired: true,
          service: '/v1/tokens/generate-secret',
    })

     return this.http.post<any>('/v1/tokens/generate-secret', {clientType}, {
      headers,
    });

  }

  assignTokenTypeExposed(username: string,tokenType: string, clientType: string, codeArea: string ): Observable<IAssignStknBisv> {
    //const headers = this.utilTransaction.addHeaderToken(ERequestTypeTransaction.AUTHENTICATION, token);
    return this.http.post<IAssignStknBisv>('/v1/passless/tokens/assign-token-type', { username, clientType, tokenType ,codeArea})
  }



  consultGracePeriod(): Observable<IGracePeriodStknBisv> {
    return this.http.post<IGracePeriodStknBisv>('/v1/tokens/grace-period-soft-token', null);
  }

  insertOnAfiliationLog(): Observable<IActivateAfiliation> {
    return this.http.post<IActivateAfiliation>('/v1/tokens/membership-log-soft-token', null)
  }

  stokenActivationOnAs(): Observable<any> {
    return this.http.post<any>('/v1/tokens/soft-token-activation', null)

  }

 /* generateCodeQR(clientType: string): Observable<IGenerateQRStknBisv> {
    return this.http.post<IGenerateQRStknBisv>('/v1/tokens/generate-secret', {clientType})
  }*/

  generateCodeQRExposed(username: string, clientType: string): Observable<IGenerateQRStknBisv> {
    return this.http.post<IGenerateQRStknBisv>('/v1/exposed/tokens/generate-secret', { username, clientType})
  }

  validateStatusQR(user?: string, clientType?: string): Observable<any> {

    return this.http.post<any>('/v1/tokens/off-get-status-qr', { clientType })
  }

  validateStatusQRExposed(username: string, clientType: string): Observable<any> {
    return this.http.post<any>('/v1/exposed/tokens/off-get-status-qr', {username, clientType})
  }

  firstValidateToken(token: string): Observable<any> {
    return this.http.post<any>('/v1/tokens/first-validate-token', { token })
  }

  firstValidateTokenExposed(token: string, username: string): Observable<any> {

    const request = {username, token};
    return this.http.post<any>('/v1/exposed/tokens/first-validate-token', request)
  }

  validateStokenAfiliation(): Observable<any>{
    return this.http.post<any>('/v1/tokens/validate-membership-soft-token', null)
  }

  changeDeviceStoken(tokenType: string, token: string): Observable<any>{
    const headers = this.utilTransaction.addHeaderByToken({
      typeTransaction:  ERequestTypeTransaction.AUTHENTICATION,
      token,
      isTokenRequired: true,
      service: '/v1/tokens/change-device-soft-token',
  })

  return this.http.post<any>('/v1/tokens/change-device-soft-token', {tokenType}, {
    headers,
  });

   // return this.http.post<any>('/v1/tokens/change-device-soft-token', {tokenType})
  }
  
}

