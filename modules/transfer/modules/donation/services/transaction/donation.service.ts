import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDonationExecute, IDonationExecuteBySignatureTracking } from '../../interfaces/donation-execute.interface';
import { IDonationAccount, IDonationExecuteDescription } from '../../interfaces/donation-account.interface';
import { ERequestTypeTransaction } from 'src/app/enums/transaction-header.enum';
import { UtilTransactionService } from 'src/app/service/common/util-transaction.service';

/**
 * @author Fabian Serrano
 * @date 19/04/22
 *
 */
@Injectable({
  providedIn: 'root'
})
export class DonationService {

  constructor(
    private http: HttpClient,
    private utilTransaction: UtilTransactionService
  ) { }


  getDonation(): Observable<IDonationAccount[]> {
    return this.http.get<IDonationAccount[]>('/v1/donation/account');
  }

  donationTransfer(donationData: IDonationExecute, isTokenRequired: boolean, tokenValue: string): Observable<IDonationExecuteDescription> {

    const headers = this.utilTransaction.addHeaderToken(ERequestTypeTransaction.DONATIONS_TRANSFER, tokenValue);

    const headersService = isTokenRequired ? headers : {};

    return this.http.post<IDonationExecuteDescription>('/v1/donation/transference/execute', donationData, {
      headers: headersService,
    });
  }

  donationTransferBySignatureTracking(bodyRequest: IDonationExecuteBySignatureTracking) {
    return this.http.post<IDonationExecuteDescription>('/v1/donation/transference/notification', bodyRequest);
  }
}
