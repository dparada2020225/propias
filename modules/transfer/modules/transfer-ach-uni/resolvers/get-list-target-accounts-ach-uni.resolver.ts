import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { FindServiceCodeService } from 'src/app/service/common/find-service-code.service';
import { UtilService } from 'src/app/service/common/util.service';
import { AchUniTransferService } from '../services/transaction/ach-uni-transfer.service';
import { finalize } from 'rxjs/operators';
import { FlowErrorBuilder, IFlowError } from 'src/app/models/error.interface';
import { AchUniBank } from '../interfaces/ach-uni-bank';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';

@Injectable({
  providedIn: 'root'
})
export class GetListTargetAccountsAchUniResolver implements Resolve<Observable<AchUniBank[] | IFlowError>> {

  constructor(
    private findService: FindServiceCodeService,
    private utils: UtilService,
    private service: AchUniTransferService,
    private persistStepStateService: ParameterManagementService,
  ) {
  }

  getClientCode(): string {
    return this.persistStepStateService.getParameter('userInfo')?.customerCode;
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AchUniBank[] | IFlowError> {
    const sourceCode = this.findService.getServiceCode(state.url);
    const sourceRoute = route.data['service'];
    this.utils.showLoader();


    console.log(this.getClientCode())
    return new Observable((observer) => {
      this.service
        .getListBanks(this.getClientCode())
        .pipe(finalize(() => observer.complete())).subscribe({
        next: (bankListResponse) => {
          try {
            observer.next(bankListResponse);
          } catch (e) {
            observer.next([]);
          }
        },
        error: (error) => {
          const errorResponse = new FlowErrorBuilder()
            .status(error.status)
            .message('Error al obtener listado de bancos')
            .error(error.error)
            .build();

          observer.next(errorResponse);
        },
      });
    });
  }
}
