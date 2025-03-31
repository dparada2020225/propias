import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserDataStoken } from '../../../interfaces/stkn-bisv.interface';

@Injectable({
  providedIn: 'root'
})
export class MembershipLogService {

  constructor(
    private http: HttpClient
  ) { }

  membershipManager(stokenPreLogin: boolean, req : IUserDataStoken){

    if (stokenPreLogin){
      return this.membershipExposed(req)
    }else{
      return this.membership(req);
    }

  }

  private membership(req: IUserDataStoken): Observable<any>{
    let username = { username: req.username};
    return this.http.post<any>('/v1/soft-token/membership-log', username);
  }

  private membershipExposed(req: IUserDataStoken): Observable<any>{
    let username = { username: req.username};
    return this.http.post<any>('/v1/soft-token/passless/membership-log', username);
  }

}
