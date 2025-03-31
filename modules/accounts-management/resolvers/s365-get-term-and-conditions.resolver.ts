import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilService } from '../../../service/common/util.service';
import { FlowErrorBuilder, IFlowError } from '../../../models/error.interface';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountsManagementService } from '../services/transaction/accounts-management.service';
import { ParameterManagementService } from '../../../service/navegation-parameters/parameter-management.service';
import { IUserInfo } from '../../../models/user-info.interface';
import { IT365TermAndConditionResponse } from '../interfaces/terms-condition.interface';

@Injectable({
  providedIn: 'root'
})
export class S365GetTermAndConditionsResolver implements Resolve<Observable<IT365TermAndConditionResponse | IFlowError>> {
  constructor(
    private transactionService: AccountsManagementService,
    private utils: UtilService,
    private parameterManagementService: ParameterManagementService,
  ) {
  }
  resolve(route: ActivatedRouteSnapshot): Observable<IT365TermAndConditionResponse | IFlowError> {
    this.utils.showLoader();
    const service = route.data['serviceType'];
    const userInfo: IUserInfo = this.parameterManagementService.getParameter('userInfo');

    return new Observable((observer) => {
      this.transactionService
        .getTermAndConditions(userInfo.customerCode, service)
        .pipe(finalize(() => observer.complete())).subscribe({
        next: (response) => {
          observer.next(response);
        },
        error: (error: HttpErrorResponse) => {
          const errorResponse = new FlowErrorBuilder()
            .status(error.status)
            .message(error?.error?.message ?? 'error:st-missing-connection')
            .error(error.error)
            .build();

          observer.next(errorResponse);
        },
      });
    });
  }
}
