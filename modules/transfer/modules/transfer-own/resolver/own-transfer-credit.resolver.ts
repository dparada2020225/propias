import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { IAccount } from 'src/app/models/account.inteface';
import { FlowErrorBuilder, IFlowError } from 'src/app/models/error.interface';
import { EEntryType, StatementsService } from 'src/app/service/shared/statements.service';

import { IOwnAccount } from '../interfaces/own-transfer.interface';
import { FindServiceCodeService } from '../../../../../service/common/find-service-code.service';
import { UtilService } from '../../../../../service/common/util.service';

/**
 * @author Fabian Serrano
 * @date 17/06/22
 *
 */
@Injectable({
  providedIn: 'root',
})
export class OwnTransferCreditResolver implements Resolve<Observable<IAccount[] | IFlowError>> {
  constructor(
    private statements: StatementsService,
    private findService: FindServiceCodeService,
    private utils: UtilService,
  ) {}

  resolve(_, state: RouterStateSnapshot): Observable<IOwnAccount[] | IFlowError> {
    const ownTransferCreditServiceCode = this.findService.getServiceCode(state.url);
    this.utils.hideLoader();

    return new Observable((observer) => {
      this.statements
        .getAccountsWithoutProduct(ownTransferCreditServiceCode, EEntryType.CREDIT)
        .pipe(finalize(() => observer.complete()))
        .subscribe({
          next: (accountListResponse) => {
            try {
              const accountListTemp = accountListResponse.filter((account) => account.enabled);
              observer.next(accountListTemp);
            } catch (e) {
              observer.next([]);
            }
          },
          error: (error: HttpErrorResponse) => {
            const errorResponse = new FlowErrorBuilder()
              .status(error?.status ?? 500)
              .message(error?.error.message ?? 'error_getting_list_accounts_credit')
              .error(error?.error ?? 'invalid error')
              .build();

            observer.next(errorResponse);
          },
        });
    });
  }
}
