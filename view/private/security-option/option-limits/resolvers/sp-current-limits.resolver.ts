import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ParameterManagementService } from '../../../../../service/navegation-parameters/parameter-management.service';
import { SpLimitsTransactionService } from '../services/transaction/sp-limits-transaction.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FlowErrorBuilder, IFlowError } from '../../../../../models/error.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpCurrentLimitsResolver implements Resolve<boolean> {

  constructor(
    private spLimitsService: SpLimitsTransactionService,
    private spinner: NgxSpinnerService,
    private parameterManagementService: ParameterManagementService,
    private router: Router,
  ) { }
  resolve(): Observable<any | IFlowError> {
    const idClient = this.parameterManagementService.getParameter('userInfo')?.customerCode;
    this.spinner.show("main-spinner");
    return new Observable((observer) => {
      this.spLimitsService.getCurrentLimits({
        clientCode: idClient,
      })
        .pipe(finalize(() => observer.complete()))
        .subscribe({
          next: (currentLimits) => {
            observer.next(currentLimits || [])
          },
          error: (error: HttpErrorResponse) => {
            const erroResponse = new FlowErrorBuilder()
              .error(error?.error ?? 'invalid error')
              .status(error?.status ?? 500)
              .message(error?.error?.message ?? 'error_getting_current_limits')
              .build();

            this.spinner.show('main-spinner');
            this.parameterManagementService.sendParameters({
              parameterStateNavigation: null,
              errorLimitsMessage: erroResponse?.message,
            });

            this.router.navigate(['security-profile']).finally(() => this.spinner.hide('main-spinner'));
            observer.next(erroResponse);
          },
        });
    });
  }
}
