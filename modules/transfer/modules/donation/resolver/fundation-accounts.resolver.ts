import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { IDonationAccount } from '../interfaces/donation-account.interface';
import { FlowErrorBuilder, IFlowError } from '../../../../../models/error.interface';
import { DonationService } from '../services/transaction/donation.service';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilService } from '../../../../../service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class FundationAccountsResolver implements Resolve<Observable<IDonationAccount[] | IFlowError>>{


  constructor(
    private donationService: DonationService,
    private utils: UtilService,
  ) { }


  resolve(): Observable<IDonationAccount[] | IFlowError> {
    this.utils.showLoader();

    return new Observable((observer) => {
      this.donationService.getDonation()
        .pipe(finalize(() => observer.complete()))
        .subscribe({
          next: (listResponse) => {
            observer.next(listResponse ?? []);
          },
          error: (error: HttpErrorResponse) => {
            const errorResponse = new FlowErrorBuilder()
              .message(error.error.message ?? 'error_getting_list_accounts_debited')
              .status(error.status ?? 500)
              .error(error.error ?? 'error')
              .build();
            observer.next(errorResponse);
          }
        });
    });
  }
}
