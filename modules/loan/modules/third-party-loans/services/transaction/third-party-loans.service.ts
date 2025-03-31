import { BankingAuthenticationService } from '@adf/security';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ERequestTypeHeader, ERequestTypeTransaction } from '../../../../../../enums/transaction-header.enum';
import {
  IConsultDetailTPL,
  IConsultNumberLoan,
  IConsultThirdPartyLoan,
  ICreateNumberLoans,
  IDeleteLoan,
  IGetReceiptBodyRequest,
  ILoansResponse,
  IReceiptResponse, IThirdPartyLoanAssociate
} from '../../interfaces/crud/crud-third-party-loans-interface';
import { IConsultQuotasAmount, IPaymentExecute } from '../../interfaces/payment-third-party-loans-interface';
import { ITPLAccountsBodyRequest } from '../../interfaces/third-party-loans.interface';
import { ISTTPLPaymentNotificationBodyRequest } from '../../interfaces/st-tpl-payment.interface';

@Injectable({
  providedIn: 'root'
})
export class ThirdPartyLoansService {

  constructor(
    private httpClient: HttpClient,
    private bankingService: BankingAuthenticationService,
  ) { }

  associateNumberLoan(createThird: ICreateNumberLoans) {
    return this.httpClient.post<ILoansResponse>('/v1/thirdparties/loan-payment', createThird);
  }

  consultThirdPartyLoan(identifier: IConsultNumberLoan) {
    return this.httpClient.post<IConsultThirdPartyLoan>('/v1/thirdparties/loan-payment/loan/validation', identifier);
  }

  updateAssociateNumberLoan(createThird: ICreateNumberLoans) {
    return this.httpClient.put<ILoansResponse>('/v1/thirdparties/loan-payment', createThird);
  }

  deleteLoan(identifier: IDeleteLoan) {
    return this.httpClient.request<ILoansResponse>('delete', '/v1/thirdparties/loan-payment', { body: identifier });
  }

  consultDetail(identifier: IConsultNumberLoan) {
    return this.httpClient.post<IConsultDetailTPL>('/v1/thirdparties/loan-payment/detail', identifier);
  }


  getReceipt(bodyRequest: IGetReceiptBodyRequest) {
    return this.httpClient.post<IReceiptResponse>('/v1/thirdparties/loan-payment/receipt', bodyRequest);
  }

  getThirdPartyLoansAccount(parameters: ITPLAccountsBodyRequest) {
    return this.httpClient.post<IThirdPartyLoanAssociate[]>('/v1/thirdparties/loan-payment/pagination', parameters);
  }

  consultQuotasPayment(request: IConsultQuotasAmount) {
    return this.httpClient.post<any>('/v1/thirdparties/loan-payment/installments/payment', request)
  }

  paymentExecute(request: IPaymentExecute, isTokenRequired: boolean, tokenValue: string): Observable<any> {
    const headers = new HttpHeaders()
      .set(ERequestTypeHeader.TYPE_TRANSACTION, ERequestTypeTransaction.THIRD_LOAN_PAYMENT)
      .set(ERequestTypeHeader.TOKEN_VALUE, `${this.bankingService.encrypt(tokenValue)}`);

    const headersService = isTokenRequired ? headers : {};

    return this.httpClient.post('/v1/thirdparties/loan-payment/payment-execute', request, {
      headers: headersService
    });
  }

  partialPaymentValidation(identifier: string, valueToPay: string){
    let request = { identifier, valueToPay}
    return this.httpClient.post<any>('/v1/thirdparties/loan-payment/loan/partial-payment-validation', request)
  }

  notification(bodyRequest: ISTTPLPaymentNotificationBodyRequest) {
    return this.httpClient.post<any>('/v1/signature-tracking/multiple-trx/loan-payment-execute', bodyRequest);
  }


}
