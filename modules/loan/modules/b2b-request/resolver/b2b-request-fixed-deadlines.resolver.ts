import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { B2bRequestService } from '../service/transaction/b2b-request.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { FlowErrorBuilder, IFlowError } from '../../../../../models/error.interface';
import { IFixedDeadlines } from '../interfaces/fixed-deadlines.interface';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class B2bRequestFixedDeadlinesResolver implements Resolve<Observable<IFixedDeadlines[] | IFlowError>> {

  constructor(
    private b2bRequestService: B2bRequestService,
    private spinner: NgxSpinnerService
  ) { }

  resolve(): Observable<IFixedDeadlines[] | IFlowError> {
    this.spinner.show("main-spinner");

    return new Observable((observer) => {
      this.b2bRequestService.getAll()
        .pipe(finalize(() => observer.complete()))
        .subscribe({
          next: (listFixes) => {
            observer.next(listFixes ?? []);
          },
          error: (error: HttpErrorResponse) => {
            const errorResponse = new FlowErrorBuilder()
              .status(error.status)
              .message('error_get_list_fix_term')
              .error(error.error)
              .build()

            observer.next(errorResponse)
          }
        })
    });
  }
}
