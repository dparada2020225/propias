import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { EEntryType, StatementsService } from '../../../../../service/shared/statements.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { IAccount } from '../../../../../models/account.inteface';
import { FlowErrorBuilder, IFlowError } from '../../../../../models/error.interface';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { EB2bRequestService } from '../../b2b-request/enum/b2b-request-service.enum';

@Injectable({
  providedIn: 'root'
})
export class B2bPaymentSourceAccountsResolver implements Resolve<Observable<IAccount[] | IFlowError>> {

  constructor(
    private statements: StatementsService,
    private spinner: NgxSpinnerService,
  ) { }

  resolve(_, state: RouterStateSnapshot): Observable<IAccount[] | IFlowError> {
    this.spinner.show("main-spinner");

    return new Observable((observer) => {
      this.statements.getAccountsWithoutProduct(EB2bRequestService.REQUEST, EEntryType.DEBIT)
        .pipe(finalize(() => observer.complete()))
        .subscribe({
          next: (accountListResponse) => {
            try {
              const accountListTemp = accountListResponse.filter(account => account.enabled);
              observer.next(accountListTemp);
            } catch (error) {
              observer.next([])
            }
          },
          error: (error: HttpErrorResponse) => {
            const errorResponse = new FlowErrorBuilder()
              .status(error.status)
              .message(error?.error?.message ?? 'error_getting_list_accounts_debit')
              .error(error.error)
              .build()

            observer.next(errorResponse)
          }
        })

    });
  }
}
