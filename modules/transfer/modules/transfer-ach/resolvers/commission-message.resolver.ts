import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { FlowErrorBuilder, IFlowError } from '../../../../../models/error.interface';
import { finalize } from 'rxjs/operators';
import { TransferACHService } from '../services/transaction/transfer-ach.service';
import { UtilService } from '../../../../../service/common/util.service';

/**
 * @author Fabian Serrano
 * @date 19/04/22
 *
 */
@Injectable({
  providedIn: 'root',
})
export class CommissionMessagesResolver implements Resolve<Observable<any>> {
  constructor(
    private transfer: TransferACHService,
    private utils: UtilService,
  ) {}

  resolve(): Observable<any[] | IFlowError> {
    this.utils.showLoader();

    return new Observable((observer) => {
      this.transfer
        .commissionMessages()
        .pipe(finalize(() => observer.complete()))
        .subscribe({
          next: (settings) => {
            observer.next(settings ?? []);
          },
          error: (error) => {
            const errorResponse = new FlowErrorBuilder()
              .status(error.status)
              .message(error.error.message ?? 'error_getting_ach_settings')
              .error(error.error)
              .build();

            observer.next(errorResponse);
          },
        });
    });
  }
}
