import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AchUniPurpose } from '../interfaces/ach-uni-purpose';
import { FindServiceCodeService } from 'src/app/service/common/find-service-code.service';
import { UtilService } from 'src/app/service/common/util.service';
import { AchUniTransferService } from '../services/transaction/ach-uni-transfer.service';
import { FlowErrorBuilder, IFlowError } from 'src/app/models/error.interface';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GetListPurposeAchUniResolver implements Resolve<Observable<AchUniPurpose[] | IFlowError>> {

  constructor(
    private findService: FindServiceCodeService,
    private utils: UtilService,
    private service: AchUniTransferService,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AchUniPurpose[] | IFlowError> {
    const sourceCode = this.findService.getServiceCode(state.url);
    const sourceRoute = route.data['service'];
    this.utils.showLoader();

    return new Observable((observer) => {
      this.service
        .getListPurpose()
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
            .message('Error al obtener listado de propositos')
            .error(error.error)
            .build();

          observer.next(errorResponse);
        },
      });
    });
  }
}
