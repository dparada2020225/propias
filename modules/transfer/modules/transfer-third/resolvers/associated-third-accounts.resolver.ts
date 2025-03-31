import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {IThirdTransfersAccounts} from '../../../interface/transfer-data-interface';
import {TransferThirdService} from '../services/transaction/transfer-third.service';
import {FlowErrorBuilder, IFlowError} from '../../../../../models/error.interface';
import {UtilService} from '../../../../../service/common/util.service';

/**
 * @author Fabian Serrano
 * @date 11/08/22
 *
 */
@Injectable({
  providedIn: 'root',
})
export class AssociatedThirdAccountsResolver implements Resolve<Observable<IThirdTransfersAccounts[] | IFlowError>> {
  constructor(
    private transferThirdService: TransferThirdService,
    private utils: UtilService,
  ) {
  }

  resolve(): Observable<IThirdTransfersAccounts[] | IFlowError> {
    this.utils.showLoader();
    return new Observable((observer) => {
      this.transferThirdService
        .getAssociatedThirdAccounts()
        .pipe(finalize(() => observer.complete()))
        .subscribe({
          next: (associatedThirdAccounts) => {
            const associatedThirdAccountsTemp = associatedThirdAccounts ?? [];
            observer.next(associatedThirdAccountsTemp);
          },
          error: (error) => {
            const errorResponse = new FlowErrorBuilder()
              .status(error.status)
              .message(error?.error?.message ?? 'error_getting_associated_third_accounts')
              .error(error.error)
              .build();

            observer.next(errorResponse);
          },
        });
    });
  }
}
