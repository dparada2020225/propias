import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRequestSearchUser } from '../../../interfaces/stkn-bisv.interface';

@Injectable({
  providedIn: 'root'
})
export class SearchUserService {

  constructor(
    private http : HttpClient
  ) { }


  userStatus(userID: string, stokePreLogin: boolean){
    if(!stokePreLogin){
      return this.getUserStatus(userID);
    } else {
      return this.getUserStatusExposed(userID);
    }

  }

  getUserStatusExposed(userID: string): Observable<any>{
    let request: IRequestSearchUser = { externalId : userID};
    return this.http.post<any>('/v1/soft-token/passless/search-user', request);
  }

  getUserStatus(userID: string): Observable<any>{
    let request: IRequestSearchUser = { externalId : userID};
    return this.http.post<any>('/v1/soft-token/search-user', request);
  }

}
