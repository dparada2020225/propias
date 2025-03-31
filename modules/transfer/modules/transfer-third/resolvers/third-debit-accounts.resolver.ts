import {Injectable} from '@angular/core';
import {Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {IAccount} from 'src/app/models/account.inteface';
import {FlowErrorBuilder, IFlowError} from '../../../../../models/error.interface';
import {EEntryType, StatementsService} from '../../../../../service/shared/statements.service';
import {FindServiceCodeService} from '../../../../../service/common/find-service-code.service';
import {UtilService} from '../../../../../service/common/util.service';

/**
 * @author Fabian Serrano
 * @date 11/08/22
 *
 */
@Injectable({
  providedIn: 'root',
})
export class ThirdDebitAccountsResolver implements Resolve<Observable<IAccount[] | IFlowError>> {
  constructor(
    private statements: StatementsService,
    private findService: FindServiceCodeService,
    private utils: UtilService,
  ) {
  }

  resolve(_, state: RouterStateSnapshot): Observable<IAccount[] | IFlowError> {
    const thirdTransferDebitServiceCode = this.findService.getServiceCode(state.url);
    this.utils.showLoader();


    return new Observable((observer) => {
      this.statements
        .getAccountsWithoutProduct(thirdTransferDebitServiceCode, EEntryType.DEBIT)
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
