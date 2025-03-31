import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { IThirdPartyLoanAssociate } from '../interfaces/crud/crud-third-party-loans-interface';
import { IFlowError, FlowErrorBuilder } from 'src/app/models/error.interface';
import { ThirdPartyLoansService } from '../services/transaction/third-party-loans.service';

/**
 * @author Fabian Serrano
 * @date 11/08/22
 *
 */
@Injectable({
  providedIn: 'root'
})
export class ThirdPartyLoansAccountsResolver implements Resolve<Observable<IThirdPartyLoanAssociate[] | IFlowError>>{

  constructor(
    private spinner: NgxSpinnerService,
    private thirdPartyLoans: ThirdPartyLoansService
  ) { }

  resolve(): Observable<IThirdPartyLoanAssociate[] | IFlowError> {
    this.spinner.show('main-spinner');
    return new Observable((observer) => {
      this.thirdPartyLoans.getThirdPartyLoansAccount({
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
          error: (error) => {
            const errorResponse = new FlowErrorBuilder()
              .status(error?.status)
              .message(error?.error?.message ?? 'error_getting_associated_third_accounts')
              .error(error?.error)
              .build();
            observer.next(errorResponse);
          }
        });
    });
  }
}
