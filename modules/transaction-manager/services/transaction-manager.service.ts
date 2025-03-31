import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ITransactionManagerAccountDetail } from '../interfaces/transaction-manger.interface';
import { FlowErrorBuilder, IFlowError } from '../../../models/error.interface';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransactionManagerService {

  constructor(
    private http: HttpClient,
  ) { }

  getAccountDetail(account: string) {
    return this.http.post<ITransactionManagerAccountDetail>(`/v1/thirdparties/general-info`, {
      account
    });
  }


  getSourceAccount(sourceNumberAccount: string): Observable<IFlowError | any> {
    return this.getAccountDetail(sourceNumberAccount)
      .pipe(
        catchError(error => of(
          new FlowErrorBuilder()
            .error(error?.error)
            .message(error?.error?.message ?? 'error:getting_source_accounts')
            .status(error?.status)
            .build()
        ))
      );
  }
}
