import { Injectable } from '@angular/core';
import {
  Resolve,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UtilService } from '../../../../../service/common/util.service';
import { FlowErrorBuilder, IFlowError } from '../../../../../models/error.interface';
import { finalize } from 'rxjs/operators';
import { AmM365TransactionService } from '../services/transaction/am-m365-transaction.service';
import { AM365AccountList } from '../interfaces/associated-account.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Am365TargetAccountResolver implements Resolve<Observable<AM365AccountList | IFlowError>> {
  constructor(
    private transactionService: AmM365TransactionService,
    private utils: UtilService,
  ) {
  }
  resolve(): Observable<AM365AccountList | IFlowError> {
    this.utils.showLoader();

    return new Observable((observer) => {
      this.transactionService
        .getAssociatedAccount()
        .pipe(finalize(() => observer.complete())).subscribe({
        next: (accountListResponse) => {
          observer.next(accountListResponse ?? []);
        },
        error: (error: HttpErrorResponse) => {
          const errorResponse = new FlowErrorBuilder()
            .status(error.status)
            .message(error?.error?.message ?? 'error:st-missing-connection')
            .error(error.error)
            .build();

          observer.next(errorResponse);
        },
      });
    });
  }
}
