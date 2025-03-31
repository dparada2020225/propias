import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { TransferACHService } from '../services/transaction/transfer-ach.service';
import { IAchAccount } from '../interfaces/ach-account-interface';
import { FlowErrorBuilder, IFlowError } from 'src/app/models/error.interface';
import { UtilService } from '../../../../../service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';

/**
 * @author Fabian Serrano
 * @date 19/04/22
 *
 */
@Injectable({
  providedIn: 'root',
})
export class TransferAchResolver implements Resolve<Observable<IAchAccount[] | IFlowError>> {
  constructor(
    private transfer: TransferACHService,
    private utils: UtilService,
    private persistStepStateService: ParameterManagementService,
  ) {}

  getClientCode(): string {
    return this.persistStepStateService.getParameter('userInfo')?.customerCode;
  }

  resolve(route: ActivatedRouteSnapshot): Observable<IAchAccount[] | IFlowError> {
    const isEnabled = route.data['isSignatureTrackingAchServiceEnabled'];

    if (!isEnabled && route.data.hasOwnProperty('isSignatureTrackingAchServiceEnabled')) {
      return new Observable((observer) => observer.next([]))
    }

    this.utils.showLoader();
    return new Observable((observer) => {
      this.transfer.associatedAccounts(this.getClientCode())
        .pipe(finalize(() => observer.complete()))
        .subscribe({
          next: (associatedAccounts) => {
            observer.next(associatedAccounts ?? []);
          },
          error: (error) => {
            const errorResponse = new FlowErrorBuilder()
              .status(error?.status)
              .message(error.error?.message ?? 'error_getting_associated_ach_accounts')
              .error(error?.error)
              .build();

            observer.next(errorResponse);
          },
        });
    });
  }
}
