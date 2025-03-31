import { Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { EEntryType, StatementsService } from '../../../../../service/shared/statements.service';
import { IAccount } from '../../../../../models/account.inteface';
import { FlowErrorBuilder, IFlowError } from '../../../../../models/error.interface';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FindServiceCodeService } from '../../../../../service/common/find-service-code.service';
import { UtilService } from '../../../../../service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class DebitAccountsResolver implements Resolve<Observable<IAccount[] | IFlowError>>{


  constructor(
    private statements: StatementsService,
    private findService: FindServiceCodeService,
    private utils: UtilService,
  ) { }

  resolve(_, state: RouterStateSnapshot): Observable<IAccount[] | IFlowError> {
    this.utils.showLoader();
    const donationServiceCode = this.findService.getServiceCode(state.url);

    return new Observable((observer) => {
      this.statements.getAccountsWithoutProduct(donationServiceCode, EEntryType.DEBIT)
        .pipe(finalize(() => observer.complete())).subscribe({
        next: (listResponse) => {
          try {
            const listTemp = listResponse.filter(account => account.enabled);
            observer.next(listTemp);
          } catch (error) {
            observer.next([]);
          }
        },
        error:(error: HttpErrorResponse) => {
          const errorResponse = new FlowErrorBuilder()
            .message(error?.error?.message ?? 'error_get_donation_list')
            .status(error?.status ?? 504)
            .error(error.error)
            .build();
          observer.next(errorResponse);
        }}
      );
    });
  }
}

