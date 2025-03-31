import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPaymentExecute } from '../../interfaces/payment-third-party-loans-interface';
import { ERequestTypeTransaction } from '../../../../../../enums/transaction-header.enum';
import { UtilTransactionService } from 'src/app/service/common/util-transaction.service';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationPaymentService {

  constructor(
    private http: HttpClient,
    private utilTransaction: UtilTransactionService
  ) { }

  paymentExecute(request: IPaymentExecute, isTokenRequired: boolean, tokenValue: string): Observable<any> {

    const headers = this.utilTransaction.addHeaderToken(ERequestTypeTransaction.THIRD_LOAN_PAYMENT, tokenValue);

    const headersService = isTokenRequired ? headers : {};

    return this.http.post('/v1/thirdparties/loan-payment/payment-execute', request, {
      headers: headersService
    });
  }
}
