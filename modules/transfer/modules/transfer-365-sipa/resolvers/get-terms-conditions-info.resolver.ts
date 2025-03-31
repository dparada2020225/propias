import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { S365TransactionService } from '../services/transaction/s365-transaction.service';
import { UtilService } from '../../../../../service/common/util.service';
import { IS365TermsConditionInfoResponse } from '../interfaces/transfer.interface';
import { FlowErrorBuilder, IFlowError } from '../../../../../models/error.interface';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GetTermsConditionsInfoResolver implements Resolve<Observable<IS365TermsConditionInfoResponse | IFlowError>> {
  constructor(
    private transfer: S365TransactionService,
    private utils: UtilService,
  ) {}

  resolve(): Observable<IS365TermsConditionInfoResponse | IFlowError> {
    this.utils.showLoader();
    return new Observable((observer) => {
      this.transfer
        .getTermsConditionsInfo()
        .pipe(finalize(() => observer.complete()))
        .subscribe({
          next: (reason) => {
            observer.next(reason ?? []);
          },
          error: (error) => {
            const errorResponse = new FlowErrorBuilder()
              .status(error?.status ?? 400)
              .message(error?.error?.message ?? 'error:st-missing-connection')
              .error(error?.error)
              .build();

            observer.next(errorResponse);
          },
        });
    });
  }
}
