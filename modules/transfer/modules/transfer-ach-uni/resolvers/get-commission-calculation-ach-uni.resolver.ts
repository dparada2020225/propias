import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AchUniTransferService } from '../services/transaction/ach-uni-transfer.service';
import { UtilService } from 'src/app/service/common/util.service';
import { AchUniCommisionResponse } from '../interfaces/ach-uni-commision-response';
import { FlowErrorBuilder, IFlowError } from 'src/app/models/error.interface';
import { finalize, catchError } from 'rxjs/operators';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';

@Injectable({
  providedIn: 'root'
})
export class GetCommissionCalculationAchUniResolver implements Resolve<Observable<AchUniCommisionResponse | IFlowError>> {

  constructor(
    private utils: UtilService,
    private service: AchUniTransferService,
    private persistStepStateService: ParameterManagementService,
  ) { }

  getClientCode(): string {
    return this.persistStepStateService.getParameter('userInfo')?.customerCode;
  }

  resolve(): Observable<AchUniCommisionResponse | IFlowError> {
    this.utils.showLoader();

    return new Observable((observer) => {
      this.service.getCommissionCalculation(this.getClientCode()).pipe(
        finalize(() => observer.complete()),
        catchError((error) => {
          const errorResponse = new FlowErrorBuilder()
            .status(error.status)
            .message('Error al obtener comision')
            .error(error.error)
            .build();
          observer.next(errorResponse);
          return of<AchUniCommisionResponse | IFlowError>(errorResponse);
        })
      ).subscribe({
        next: (achUniCommisionResponse: AchUniCommisionResponse | IFlowError) => {
          if (achUniCommisionResponse instanceof Error) {
            const commision: AchUniCommisionResponse = { commissionValue: 0 };
            observer.next(commision);
          } else {
            observer.next(achUniCommisionResponse);
          }
        },
        error: () => {
          const commision: AchUniCommisionResponse = { commissionValue: 0 };
          observer.next(commision);
        }
      });
    });
  }
}
