import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { EEntryType, StatementsService } from 'src/app/service/shared/statements.service';
import { FlowErrorBuilder, IFlowError } from '../../../../../models/error.interface';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { IAccount } from 'src/app/models/account.inteface';
import { FindServiceCodeService } from '../../../../../service/common/find-service-code.service';
import { EBTScheduleService } from '../../bulk-transfer/enum/bt-view.enum';
import { UtilService } from '../../../../../service/common/util.service';
import { EACHTransferUrlNavigationCollection } from '../enum/navigation-parameter.enum';


@Injectable({
  providedIn: 'root',
})
export class AchSourceAccountsResolver implements Resolve<Observable<IAccount[] | IFlowError>> {
  constructor(
    private statements: StatementsService,
    private findService: FindServiceCodeService,
    private utils: UtilService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IAccount[] | IFlowError> {
    const url = route.data['service'] === EBTScheduleService.BULK_TRANSFER ? EACHTransferUrlNavigationCollection.HOME_TRANSACTION : state.url;
    const achServiceCode = this.findService.getServiceCode(url);
    this.utils.showLoader();

    return new Observable((observer) => {
      this.statements
        .getAccountsWithoutProduct(achServiceCode, EEntryType.DEBIT)
        .pipe(finalize(() => observer.complete()))
        .subscribe({
          next: (response) => {
            try {
              const accountListTemp = response.filter((account) => account.enabled);
              observer.next(accountListTemp);
            } catch (e) {
              observer.next([]);
            }
          },
          error: (error: HttpErrorResponse) => {
            const errorResponse = new FlowErrorBuilder()
              .status(error?.status)
              .message('error_getting_list_accounts_debited')
              .error(error?.error)
              .build();

            observer.next(errorResponse);
          },
        });
    });
  }
}
