import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {
  M365StorageService
} from '../modules/transfer/modules/transfer-365-movil/services/execution/m365-storage.service';
import { FlowErrorBuilder, IFlowError } from '../models/error.interface';
import { EEntryType, StatementsService } from '../service/shared/statements.service';
import { IAccount } from '../models/account.inteface';
import { FindServiceCodeService } from '../service/common/find-service-code.service';
import { UtilService } from '../service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class GetSourceAccountResolver implements Resolve<Observable<IAccount[] | IFlowError>> {
  constructor(
    private statements: StatementsService,
    private findService: FindServiceCodeService,
    private utils: UtilService,
  ) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IAccount[] | IFlowError> {
    const sourceCode = this.findService.getServiceCode(state.url);
    const sourceRoute = route.data['service'];
    this.utils.showLoader();

    return new Observable((observer) => {
      this.statements
        .getAccountsWithoutProduct(sourceRoute ?? sourceCode, EEntryType.DEBIT)
        .pipe(finalize(() => observer.complete())).subscribe({
        next: (accountListResponse) => {
          try {
            const accountListTemp = accountListResponse.filter((account) => account.enabled);
            observer.next(accountListTemp);
          } catch (e) {
            observer.next([]);
          }
        },
        error: (error) => {
          const errorResponse = new FlowErrorBuilder()
            .status(error.status)
            .message('error_getting_list_accounts_debited')
            .error(error.error)
            .build();

          observer.next(errorResponse);
        },
      });
    });
  }
}
