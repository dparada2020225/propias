import { Injectable } from '@angular/core';
import { IOwnLoansPagination } from '../../interfaces/crud/crud-third-party-loans-interface';
import { HttpClient } from '@angular/common/http';
import { ITPLAccountsBodyRequest } from '../../interfaces/third-party-loans.interface';

@Injectable({
  providedIn: 'root'
})
export class OwnLoansService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  getOwnsLoans(parameters: ITPLAccountsBodyRequest){
    return this.httpClient.post<IOwnLoansPagination[]>('/v1/thirdparties/loan-payment/pagination/own', parameters);
  }
}
