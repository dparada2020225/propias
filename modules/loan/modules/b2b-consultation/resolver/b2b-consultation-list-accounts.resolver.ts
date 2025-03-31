import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { IB2bConsultationAccounts } from '../interfaces/b2b-consultation-service.interface';
import { B2bConsultationTransactionService } from '../service/transaction/b2b-consultation-transaction.service';
import { FlowErrorBuilder, IFlowError } from '../../../../../models/error.interface';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilService } from '../../../../../service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class B2bConsultationListAccountsResolver implements Resolve<Observable<IB2bConsultationAccounts[] | IFlowError>> {
  constructor(
    private consultationTransaction: B2bConsultationTransactionService,
    private utils: UtilService,
  ) { }

  resolve(): Observable<IB2bConsultationAccounts[] | IFlowError> {
    this.utils.showLoader();

    return new Observable((observer) => {
      this.consultationTransaction.b2bList()
        .pipe(finalize(() => {
          observer.complete();
          this.utils.hideLoader();
        }))
        .subscribe({
          next: (listB2b) => {
            observer.next(listB2b ?? [])
          },
          error: (error: HttpErrorResponse) => {
            const customError = new FlowErrorBuilder()
              .error(error?.error)
              .message(error?.error?.message ?? 'errorB2B:get_b2bAccounts')
              .status(error?.status ?? 400)
              .build();

            observer.next(customError);
          }
        })
    });
  }
}
