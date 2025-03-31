import { Injectable } from '@angular/core';
import {
  Resolve,
} from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FlowErrorBuilder, IFlowError } from '../../../../../models/error.interface';
import { UtilService } from '../../../../../service/common/util.service';
import { IUserInfo } from '../../../../../models/user-info.interface';
import { PROTECTED_PARAMETER_STATE } from '../../../../../enums/common-value.enum';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { SpLoadSupplierTransactionService } from '../../execution/sp-loadSupplier-transaction.service';

@Injectable({
  providedIn: 'root'
})
export class GetPaymentSupplierResolver implements Resolve<Observable<any | IFlowError>> {
  constructor(
    private transfer: SpLoadSupplierTransactionService,
    private utils: UtilService,
    private parameterManagement: ParameterManagementService,
  ) {}

  resolve(): Observable<any | IFlowError> {
    const userInfo = this.parameterManagement.getParameter<IUserInfo>('userInfo');
    const state = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);

    this.utils.showLoader();

    return new Observable((observer) => {
      this.transfer.getSupplierByPaymentMethod({
        mainClient: +userInfo.customerCode,
        codigoPlanilla: +state?.transactionDetail.authorization,
      })

      .pipe(finalize(() => observer.complete()))
      .subscribe({
        next: (response) => {
          if (!response) {
            observer.next([]);
            return;
          }
          console.log('responseee', response)
          const suppliers = response.detalles ?? [];
          observer.next(suppliers);
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
