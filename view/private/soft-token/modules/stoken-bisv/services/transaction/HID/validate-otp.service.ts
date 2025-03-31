import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IValidateOTP } from '../../../interfaces/stkn-bisv.interface';

@Injectable({
  providedIn: 'root'
})
export class ValidateOtpService {

  constructor(
    private http: HttpClient
  ) { }

  validateOTPManager (stokenPreLogin: boolean, req : IValidateOTP) {
    if (stokenPreLogin){
      return this.validateOTPExposed(req)
    }else{
      return this.validateOTP(req);
    }
  }

  private validateOTP(req : IValidateOTP):Observable<any>{
    return this.http.post<any>('/v1/soft-token/validate-otp', req)
  }

  private validateOTPExposed(req : IValidateOTP):Observable<any>{
    return this.http.post<any>('/v1/soft-token/passless/validate-otp', req)
  }
}
