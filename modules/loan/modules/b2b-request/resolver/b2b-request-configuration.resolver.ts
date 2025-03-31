import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { FlowErrorBuilder, IFlowError } from '../../../../../models/error.interface';
import { B2bRequestService } from '../service/transaction/b2b-request.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { IB2bRequestConfig } from '../interfaces/b2b-request.interface';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class B2bRequestConfigurationResolver implements Resolve<Observable<IB2bRequestConfig | IFlowError>> {
  constructor(
    private b2bRequestService: B2bRequestService,
    private spinner: NgxSpinnerService
  ) { }

  resolve(): Observable<IB2bRequestConfig | IFlowError> {
    this.spinner.show("main-spinner");

    return new Observable((observer) => {
      this.b2bRequestService.getConfig()
        .pipe(finalize(() => observer.complete()))
        .subscribe({
          next: (config) => {
            observer.next(config);
          },
          error: (error: HttpErrorResponse) => {
            const errorResponse = new FlowErrorBuilder()
              .status(error.status)
              .message('error_getting_configuration_request_b2b')
              .error(error.error)
              .build()

            observer.next(errorResponse)
          }
        })
    });
  }
}
