import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EEntryType, StatementsService } from 'src/app/service/shared/statements.service';
import { Observable } from 'rxjs';
import { FlowErrorBuilder, IFlowError } from '../../../../../models/error.interface';
import { finalize } from 'rxjs/operators';
import { IAccount } from '../../../../../models/account.inteface';
import { HttpErrorResponse } from '@angular/common/http';
import { FindServiceCodeService } from '../../../../../service/common/find-service-code.service';

@Injectable({
  providedIn: 'root'
})
export class B2bRequestTargetAccountsResolver implements Resolve<Observable<IAccount[] | IFlowError>> {

  constructor(
    private statements: StatementsService,
    private spinner: NgxSpinnerService,
    private findService: FindServiceCodeService
  ) { }

  resolve(_, state: RouterStateSnapshot): Observable<IAccount[] | IFlowError> {
    const requestTargetServiceCode = this.findService.getServiceCode(state.url);
    this.spinner.show("main-spinner");

    return new Observable((observer) => {
      this.statements.getAccountsWithoutProduct(requestTargetServiceCode, EEntryType.CREDIT)
        .pipe(finalize(() => observer.complete()))
        .subscribe({
          next: (response) => {
            try {
              const accountListTemp = response.filter(account => account.enabled);
              observer.next(accountListTemp);
            } catch (error) {
              observer.next([])
            }
          },
          error: (error: HttpErrorResponse) => {
            const errorResponse = new FlowErrorBuilder()
              .status(error.status)
              .message(error?.error?.message ?? 'error_getting_list_accounts_credit')
              .error(error.error)
              .build()

            observer.next(errorResponse)
          }
        })

    });
  }
}
