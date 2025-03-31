import { Injectable } from '@angular/core';
import {
  Resolve,
} from '@angular/router';
import { Observable } from 'rxjs';
import { FlowErrorBuilder, IFlowError } from '../../../../../models/error.interface';
import { finalize } from 'rxjs/operators';
import { UtilService } from '../../../../../service/common/util.service';
import { ParameterManagementService } from '../../../../../service/navegation-parameters/parameter-management.service';
import { IUserInfo } from '../../../../../models/user-info.interface';
import { IStAchUniState } from '../interfaces/st-uni-operations.interface';
import { PROTECTED_PARAMETER_STATE } from '../../../../../enums/common-value.enum';
import { TmAchUniTransactionService } from '../services/transaction/tm-ach-uni-transaction.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TBisvMassiveAchLoteDetailMappedResponse } from '../interfaces/lote-detail.interface';

@Injectable({
  providedIn: 'root'
})
export class GetAchUniLoteDetailResolver implements Resolve<Observable<TBisvMassiveAchLoteDetailMappedResponse | IFlowError>> {
  constructor(
    private utils: UtilService,
    private parameterManagement: ParameterManagementService,
    private transactionService: TmAchUniTransactionService,
  ) {
  }
  resolve(): Observable<TBisvMassiveAchLoteDetailMappedResponse | IFlowError> {
    this.utils.showLoader();
    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');
    const { transactionDetail }= this.parameterManagement.getParameter<IStAchUniState>(PROTECTED_PARAMETER_STATE);


    return new Observable((observer) => {
      this.transactionService.getTransactionDetailByLote(userInfo.customerCode, transactionDetail.lote)
        .pipe(finalize(() => observer.complete())).subscribe({
        next: (response) => {
          observer.next(response ?? []);
        },
        error: (error: HttpErrorResponse) => {
          const errorResponse = new FlowErrorBuilder()
            .status(error.status)
            .message('Error al obtener detalle de cuentas en lote')
            .error(error.error)
            .build();

          observer.next(errorResponse);
        },
      });
    });
  }
}
