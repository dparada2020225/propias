import { BankingAuthenticationService } from '@adf/security';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ERequestTypeHeader, ERequestTypeTransaction } from 'src/app/enums/transaction-header.enum';
import { TranslateService } from '@ngx-translate/core';
import { HandleTokenRequestService } from './handle-token-request.service';
import { IHeaderRequest } from '../../models/token.interface';
import { HttpStatusCode } from '../../enums/http-status-code.enum';
import { ITransactionFailedResponse, ITransactionSuccessResponse } from '../../models/utils-transaction.interface';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilTransactionService {

  constructor(
    private bankingService: BankingAuthenticationService,
    private handleTokenRequest: HandleTokenRequestService,
    private translate: TranslateService,
    ) {}

  addHeaderToken(typeTransaction: ERequestTypeTransaction, token: string, userName?: string): HttpHeaders | undefined {
    let headers: HttpHeaders;

    if (token && userName) {
      headers = new HttpHeaders()
        .set(ERequestTypeHeader.TYPE_TRANSACTION, typeTransaction)
        .set(ERequestTypeHeader.TOKEN_VALUE, `${this.bankingService.encrypt(token)}`)
        .set(ERequestTypeHeader.PARAMETER, userName);
    } else if(token) {
      headers = new HttpHeaders()
        .set(ERequestTypeHeader.TYPE_TRANSACTION, typeTransaction)
        .set(ERequestTypeHeader.TOKEN_VALUE, `${this.bankingService.encrypt(token)}`);
    } else {
      headers = new HttpHeaders()
      .set(ERequestTypeHeader.TYPE_TRANSACTION, typeTransaction)
      .set(ERequestTypeHeader.TOKEN_VALUE, '');
    }

    return headers;
  }


  addHeaderByToken(parameters: IHeaderRequest) {
    const { typeTransaction, token, isTokenRequired, service } = parameters;
    const tokenRequiredSetting = this.handleTokenRequest.isSetHeaderTokenRequired(service, parameters.serviceCode);
    const headers = this.addHeaderToken(typeTransaction as ERequestTypeTransaction, token as string) as HttpHeaders;
    const headerToUse = isTokenRequired && tokenRequiredSetting.rawValue ? headers : new HttpHeaders();
    console.log(tokenRequiredSetting);
    return headerToUse.set(tokenRequiredSetting.type, tokenRequiredSetting.value as string);
  }

  handleErrorTransaction<T = any>(error: HttpErrorResponse) {
    if (((error?.error && error?.error?.status) || (error && error?.status)) === HttpStatusCode.INVALID_TOKEN) {
      return {
        status: HttpStatusCode.INVALID_TOKEN,
        message: error?.error?.message,
        error: error?.error,
      } as ITransactionFailedResponse<T>;
    }

    if (error?.error?.code === HttpStatusCode.SIGNATURE_TRACKING) {
      return {
        status: HttpStatusCode.SIGNATURE_TRACKING,
        data: null,
        message: error?.error?.message,
      } as ITransactionSuccessResponse;
    }

    if (error?.error?.code === HttpStatusCode.PROCESS_PAYMENT_OF_PAYROLL) {
      return {
        status: HttpStatusCode.PROCESS_PAYMENT_OF_PAYROLL,
        data: null,
        message: error?.error?.message,
      } as ITransactionSuccessResponse;
    }

    if (error?.error?.code === HttpStatusCode.SIGNATURE_TRACKING_MODIFY_SUCCESS) {
      return {
        status: HttpStatusCode.SIGNATURE_TRACKING_MODIFY_SUCCESS,
        data: {
          date: error?.error?.dateTime,
          reference: error?.error?.reference,
        },
        message: error?.error?.message,
      } as ITransactionSuccessResponse;
    }

    return {
      status: error?.error?.status ?? 400,
      message: error?.error?.message ?? error?.error?.errorDescription ?? error?.error?.errorMessage ?? this.translate.instant('error:st-missing-connection'),
      error: error?.error,
    } as ITransactionFailedResponse<T>;
  }

  handleResponseTransaction<T = any>(response: T) {
    return {
      status: HttpStatusCode.SUCCESS_TRANSACTION,
      data: response,
    } as ITransactionSuccessResponse<T>;
  }

  handleErrorAcceptedTermsAndCondition() {
    const message = this.translate.instant('st:error_label_terms_and_condition');

    return throwError(() => ({
      error: {
        message,
      },
      status: 400,
      statusText: message,
    }));
  }
}
