import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { finalize, Observable } from 'rxjs';
import { AchUniTransferService } from '../services/transaction/ach-uni-transfer.service';
import { UtilService } from 'src/app/service/common/util.service';
import { AchUniLimitForUserResponse } from '../interfaces/ach-uni-limits-response';
import { FlowErrorBuilder, IFlowError } from 'src/app/models/error.interface';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';

@Injectable({
  providedIn: 'root'
})
export class AchUniLimitTrasnferUserResolver implements Resolve<AchUniLimitForUserResponse | IFlowError> {
  constructor(
    private transfer: AchUniTransferService,
    private utils: UtilService,
    private persistStepStateService: ParameterManagementService,
  ) {}

  getClientCode(): string {
    return this.persistStepStateService.getParameter('userInfo')?.customerCode;
  }

  resolve(): Observable<AchUniLimitForUserResponse | IFlowError> {
    this.utils.showLoader();
    return new Observable((observer) => {
      this.transfer.getLimistTransferForUser(this.getClientCode(), 'USD')
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
