import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { StatementsService, EEntryType } from 'src/app/service/shared/statements.service';
import { FlowErrorBuilder } from '../../../../../models/error.interface';
import { FindServiceCodeService } from '../../../../../service/common/find-service-code.service';


@Injectable({
  providedIn: 'root'
})
export class DebitLoansNumbers implements Resolve<Observable<any>> {

  constructor(
    private statements: StatementsService,
    private spinner: NgxSpinnerService,
    private findService: FindServiceCodeService
  ) { }

  resolve(_, state: RouterStateSnapshot): Observable<any> {
    const thirdPartyLoanDebitServiceCode = this.findService.getServiceCode(state.url);
    this.spinner.show("main-spinner");

    return new Observable((observer) => {
      this.statements.getAccountsWithoutProduct(thirdPartyLoanDebitServiceCode, EEntryType.DEBIT)
        .pipe(finalize(() => observer.complete()))
        .subscribe({
          next: (accountListResponse) => {
            try {
              const accountListTemp = accountListResponse.filter(account => account.enabled);
              observer.next(accountListTemp);
            } catch (e) {
              observer.next([]);
            }
          },
          error: (error) => {
            const errorResponse = new FlowErrorBuilder()
              .status(error?.status ?? 500)
              .message(error?.error?.message ?? 'error_get_listAccount')
              .error(error?.error ?? 'invalid error')
              .build();

            observer.next(errorResponse);
          }
        })
    });
  }
}
