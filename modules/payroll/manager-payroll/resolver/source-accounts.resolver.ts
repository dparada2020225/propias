import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {FlowErrorBuilder, IFlowError} from '../../../../models/error.interface';
import {IAccount} from '../../../../models/account.inteface';
import {EEntryType, StatementsService} from '../../../../service/shared/statements.service';
import {FindServiceCodeService} from '../../../../service/common/find-service-code.service';
import {UtilService} from '../../../../service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentOfPayrollResolver implements Resolve<Observable<IAccount[] | IFlowError>>{
  constructor(
    private statements: StatementsService,
    private findService: FindServiceCodeService,
    private utils: UtilService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IAccount[] | IFlowError> {
    this.utils.showLoader();
    const serviceCodeByUrl = this.findService.getServiceCode(state.url);
    const service = route.data['service']
    const serviceCode = service ?? serviceCodeByUrl;
    return new Observable((observer) => {
      this.statements.getAccountsWithoutProduct(serviceCode, EEntryType.DEBIT)
        .pipe(finalize(() => observer.complete())).subscribe({
        next: (listResponse) => {
          try {
            const listTemp = listResponse.filter(account => account.enabled);
            observer.next(listTemp);
          } catch (error) {
            observer.next([]);
          }
        },
        error:(error: HttpErrorResponse) => {
          const errorResponse = new FlowErrorBuilder()
            .message(error?.error?.message ?? 'payroll:error_get_source_account')
            .status(error?.status ?? 504)
            .error(error.error)
            .build();
          observer.next(errorResponse);
        }}
      );
    });
  }
}

