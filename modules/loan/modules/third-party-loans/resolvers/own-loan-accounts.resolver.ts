import { Injectable } from '@angular/core';
import { Resolve, } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilService } from '../../../../../service/common/util.service';
import { OwnLoansService } from '../services/transaction/own-loans.service';
import { IOwnLoansPagination } from '../interfaces/crud/crud-third-party-loans-interface';
import { FlowErrorBuilder, IFlowError } from '../../../../../models/error.interface';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OwnLoanAccountsResolver implements Resolve<Observable<IOwnLoansPagination[] | IFlowError>> {
  constructor(
    private utils: UtilService,
    private ownLoansService: OwnLoansService
  ) { }

  resolve(): Observable<IOwnLoansPagination[] | IFlowError> {
    this.utils.showLoader();
    return new Observable((observer) => {
      this.ownLoansService.getOwnsLoans({
        loanToLocate: '',
        currency: '',
        action: '+',
        advancedFilter: '',
      }).pipe(finalize(() => observer.complete()))
        .subscribe({
          next: (associatedThirdAccounts) => {
            const associatedThirdAccountsTemp = associatedThirdAccounts ?? [];
            observer.next(associatedThirdAccountsTemp);
          },
          error: (error: HttpErrorResponse) => {
            const errorResponse = new FlowErrorBuilder()
              .status(error?.status)
              .message(error?.error?.message ?? 'error_getting_associated_third_accounts')
              .error(error?.error)
              .build();

            observer.next(errorResponse);
          },
        });
    });
  }

}
