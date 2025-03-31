import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { IPaymentAccount, IPaymentB2bAccountResponse } from '../interfaces/b2b-payment.interface';
import { B2bPaymentService } from '../service/transction/b2b-payment.service';
import { FlowErrorBuilder, IFlowError } from '../../../../../models/error.interface';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class B2bPaymentLoanAccountsResolver implements Resolve<Observable<IPaymentB2bAccountResponse | IFlowError>> {
  constructor(
    private paymentTransactionService: B2bPaymentService,
    private spinner: NgxSpinnerService
  ) { }

  totalBalance(accounts: IPaymentAccount[]) {
    if (accounts.length <= 0) return 0
    return accounts.reduce((balance: number, account: IPaymentAccount) => +account.balance + +balance, 0)
  }

  resolve(): Observable<IPaymentB2bAccountResponse | IFlowError> {
    this.spinner.show("main-spinner");

    return new Observable((observer) => {
      this.paymentTransactionService.getB2bList()
        .pipe(finalize(() => observer.complete()))
        .subscribe({
          next: (response) => {
            const balance = this.totalBalance(response ?? [])
            observer.next({
              accounts: response ?? [],
              totalBalance: balance
            });
          },
          error: (error: HttpErrorResponse) => {
            const errorResponse = new FlowErrorBuilder()
              .message('errorB2B:get_b2bAccounts')
              .error(error.error)
              .status(error.status)
              .build()

            observer.next(errorResponse);
          }
        })
    });
  }
}
