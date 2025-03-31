import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilService } from '../../../../../service/common/util.service';
import { FlowErrorBuilder, IFlowError } from '../../../../../models/error.interface';
import { finalize } from 'rxjs/operators';
import { T365mTransactionService } from '../services/transaction/t365m-transaction.service';
import { IS365AffiliationAccountList } from '../interfaces/affiliation.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetAffiliationResolver implements Resolve<Observable<IS365AffiliationAccountList | IFlowError>> {
  constructor(
    private transactionService: T365mTransactionService,
    private utils: UtilService,
  ) {
  }
  resolve(): Observable<IS365AffiliationAccountList | IFlowError> {
    this.utils.showLoader();

    return new Observable((observer) => {
      this.transactionService
        .getAffiliation()
        .pipe(finalize(() => observer.complete())).subscribe({
        next: (accountListResponse) => {
          observer.next(accountListResponse);
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
