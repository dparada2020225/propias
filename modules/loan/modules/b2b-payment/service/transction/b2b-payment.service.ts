import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPaymentExecution, IPaymentExecutionDescription } from '../../interfaces/b2b-payment-execution.interface';
import { IPaymentAccount, IPaymentAccountDetail } from '../../interfaces/b2b-payment.interface';

@Injectable({
  providedIn: 'root'
})
export class B2bPaymentService {
  constructor(private http: HttpClient) { }

  executePayment(paymentData: IPaymentExecution) {
    return this.http.post<IPaymentExecutionDescription>(
      '/v1/back-to-back/execute/payment',
      paymentData
    );
  }

  getB2bList() {
    return this.http.get<IPaymentAccount[]>('/v1/back-to-back');
  }

  getB2bAccountDetail(b2BId: string, b2bAmount: number | null) {
    const paramsWithAmount = new HttpParams()
      .append('b2bID', b2BId)
      .append('b2b-amount', `${b2bAmount}`);

    const paramsWithoutAmount = new HttpParams()
      .append('b2bID', b2BId);

    const params = b2bAmount ? paramsWithAmount : paramsWithoutAmount;

    return this.http.get<IPaymentAccountDetail>(`/v1/back-to-back/payment/loan`, { params, });
  }
}
