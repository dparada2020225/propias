import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilService } from '../../../../../service/common/util.service';
import { FlowErrorBuilder, IFlowError } from '../../../../../models/error.interface';
import { finalize } from 'rxjs/operators';
import { S365TransactionService } from '../services/transaction/s365-transaction.service';
import { TS365TransferReasonList } from '../interfaces/transfer.interface';

@Injectable({
  providedIn: 'root'
})
export class S365GetReasonResolver implements Resolve<Observable<TS365TransferReasonList | IFlowError>> {
  constructor(
    private transfer: S365TransactionService,
    private utils: UtilService,
  ) {}

  resolve(): Observable<TS365TransferReasonList | IFlowError> {
    this.utils.showLoader();
    return new Observable((observer) => {
      this.transfer
        .getTransferReason()
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
