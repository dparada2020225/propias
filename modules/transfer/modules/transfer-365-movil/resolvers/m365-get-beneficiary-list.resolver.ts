import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable  } from 'rxjs';
import { UtilService } from '../../../../../service/common/util.service';
import { FlowErrorBuilder, IFlowError } from '../../../../../models/error.interface';
import { finalize } from 'rxjs/operators';
import { M365TransactionService } from '../services/transaction/m365-transaction.service';
import { IM365BeneficiaryRegisteredList } from '../interfaces/transaction.interface';
import { M365StorageService } from '../services/execution/m365-storage.service';

@Injectable({
  providedIn: 'root'
})
export class M365GetBeneficiaryListResolver implements Resolve<Observable<IM365BeneficiaryRegisteredList | IFlowError>> {
  constructor(
    private transfer: M365TransactionService,
    private utils: UtilService,
    private m365StorageService: M365StorageService,
  ) {}

  resolve(): Observable<IM365BeneficiaryRegisteredList | IFlowError> {
    this.utils.showLoader();

    if (this.m365StorageService.getBeneficiaryRegisteredList.length > 0) {
      return new Observable((observer) => observer.next(this.m365StorageService.getBeneficiaryRegisteredList));
    }

    return new Observable((observer) => {
      this.transfer
        .getBeneficiaryList()
        .pipe(finalize(() => observer.complete()))
        .subscribe({
          next: (settings) => {
            this.m365StorageService.setBeneficiaryRegisteredList(settings);
            observer.next(settings ?? []);
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
