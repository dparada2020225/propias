import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UtilService } from '../../../../../service/common/util.service';
import { FlowErrorBuilder, IFlowError } from '../../../../../models/error.interface';
import { finalize } from 'rxjs/operators';
import { TmAchTransactionService } from '../services/transaction/tm-ach-transaction.service';
import { TLookUpACHRegister, TLookUpACHRegisterAtomicMapped } from '../interfaces/tm-ach-register.interface';
import { ParameterManagementService } from '../../../../../service/navegation-parameters/parameter-management.service';
import { PROTECTED_PARAMETER_STATE } from '../../../../../enums/common-value.enum';
import { ITMConsultACHHomeState } from '../interfaces/state.interface';
import { ETMACHService } from '../enum/form-control-name.enum';
import { TmAchStorageService } from '../services/execution/tm-ach-storage.service';
import { IUserInfo } from '../../../../../models/user-info.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TmAchConsultResolver implements Resolve<Observable<TLookUpACHRegister | IFlowError>> {
  constructor(
    private transferService: TmAchTransactionService,
    private parameterManagement: ParameterManagementService,
    private utils: UtilService,
    private storageService: TmAchStorageService,
  ) {
  }
  resolve(): Observable<TLookUpACHRegister | IFlowError> {
    this.utils.showLoader();
    const { formValues } = this.parameterManagement.getParameter<ITMConsultACHHomeState>(PROTECTED_PARAMETER_STATE);
    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');

    if (formValues.service === ETMACHService.ATOMIC && this.storageService.atomicTransactionList.length > 0) {
      return of(this.storageService.atomicTransactionList);
    }

    const mappedService = {
      [ETMACHService.ATOMIC]: () => this.transferService.getAchRegisterForAtomicTransfer({ ...formValues, clientCode: userInfo.customerCode}),
      [ETMACHService.MULTIPLE_365]: () => this.transferService.getAchRegisterForMultiple365Transfer({ ...formValues, clientCode: userInfo.customerCode}),
      [ETMACHService.MULTIPLE_UNI]: () => this.transferService.getAchRegisterForMultipleTransfer({ ...formValues, clientCode: userInfo.customerCode}),
    }

    const service = mappedService[formValues.service]() as Observable<TLookUpACHRegister | IFlowError>;
    return new Observable((observer) => {
      service
        .pipe(finalize(() => observer.complete())).subscribe({
          next: (transactionListResponse) => {
            if (formValues.service === ETMACHService.ATOMIC) {
              this.storageService.setAtomicTransactionList(transactionListResponse as TLookUpACHRegisterAtomicMapped);
            }

            observer.next(transactionListResponse);
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
