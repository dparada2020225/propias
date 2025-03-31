import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilService } from '../../../../../service/common/util.service';
import { FlowErrorBuilder, IFlowError } from '../../../../../models/error.interface';
import { finalize } from 'rxjs/operators';
import { AmS365TransactionService } from '../services/transaction/am-s365-transaction.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TAMS365ListOfCountry } from '../interfaces/s365-catalogs.interface';

@Injectable({
  providedIn: 'root'
})
export class AmS365ListOfCountriesResolver implements Resolve<Observable<TAMS365ListOfCountry | IFlowError>> {
  constructor(
    private transactionService: AmS365TransactionService,
    private utils: UtilService,
  ) {
  }
  resolve(): Observable<TAMS365ListOfCountry | IFlowError> {
    this.utils.showLoader();

    return new Observable((observer) => {
      this.transactionService
        .getListOfCountry()
        .pipe(finalize(() => observer.complete())).subscribe({
        next: (countriesResponse) => {
          observer.next(countriesResponse);
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
