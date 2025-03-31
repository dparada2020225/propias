import { Injectable } from '@angular/core';
import {
  Resolve,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UtilService } from '../service/common/util.service';
import { FlowErrorBuilder, IFlowError } from '../models/error.interface';
import { finalize } from 'rxjs/operators';
import {
  AccountsManagementService
} from '../modules/accounts-management/services/transaction/accounts-management.service';
import { IACHBiesGeneralParameters } from '../models/ach-general-parameters.interface';
import { ParameterManagementService } from '../service/navegation-parameters/parameter-management.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetAchBiesGeneralParametersResolver implements Resolve<Observable<IACHBiesGeneralParameters | IFlowError>> {
  constructor(
    private transactionService: AccountsManagementService,
    private utils: UtilService,
    private persistStepStateService: ParameterManagementService,
  ) {
  }

  getClientCode(): string {
    return this.persistStepStateService.getParameter('userInfo')?.customerCode;
  }

  resolve(): Observable<IACHBiesGeneralParameters | IFlowError> {
    this.utils.showLoader();

    return new Observable((observer) => {
      this.transactionService
        .getACHGeneralParameters(this.getClientCode())
        .pipe(finalize(() => observer.complete())).subscribe({
        next: (accountListResponse) => {
            observer.next(accountListResponse);
        },
        error: (error: HttpErrorResponse) => {
          const errorResponse = new FlowErrorBuilder()
            .status(error.status)
            .message(error?.error?.descriptionError ?? error?.error?.message ?? 'error:st-missing-connection')
            .error(error.error)
            .build();

          observer.next(errorResponse);
        },
      });
    });
  }
}
