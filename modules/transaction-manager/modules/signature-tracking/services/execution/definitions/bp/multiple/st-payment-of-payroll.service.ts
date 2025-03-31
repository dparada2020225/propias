import { Injectable } from '@angular/core';
import { catchError, concatMap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SignatureTrackingService } from '../../../../transaction/signature-tracking.service';
import {
  SplitTransactionDetailService
} from '../../../../../../../services/manager/bp/split-transaction-detail.service';
import { UtilService } from '../../../../../../../../../service/common/util.service';
import { StBuildUpdateBodyRequestService } from '../../../../definition/st-build-update-body-request.service';
import { ITMTransaction } from '../../../../../../../interfaces/tm-transaction.interface';
import { HttpStatusCode } from '../../../../../../../../../enums/http-status-code.enum';
import { IResponseRetryProcessPaymentOfPayroll } from '../../../../../interfaces/st-payment-of-payroll.interface';
import { ETMServiceCode } from '../../../../../../../enums/service-code.enum';
import { IPaymentOfPayroll } from '../../../../../interfaces/st-process.interface';


@Injectable({
  providedIn: 'root'
})
export class StPaymentOfPayrollService {

  constructor(
    private stTransaction: SignatureTrackingService,
    private splitTransactionDetail: SplitTransactionDetailService,
    private utilService: UtilService,
    private stBuildUpdateBodyRequest: StBuildUpdateBodyRequestService,
  ) { }

  execute(transaction: ITMTransaction, signatureType: string) {
    return this.executeProcess(transaction, signatureType);
  }

  retryProcess(transaction: ITMTransaction, signatureType: string) {
    return this.modifyTransaction(transaction)
      .pipe(
        concatMap((response) => {
          if (!response.hasOwnProperty('statusCode') || !response.hasOwnProperty('isSuccessful')) {
            return throwError(() => response);
          }

          return this.executeProcess(transaction, signatureType);
        })
      );
  }

  private modifyTransaction(transaction: ITMTransaction) {
    return this.stTransaction.update({
      transactionCode: transaction?.reference,
      data: this.stBuildUpdateBodyRequest.buildBodyToUpdatePaymentOfPayrollMultiple(transaction?.request).trim(),
      serviceModify: transaction?.serviceCode,
    })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error?.error?.code !== HttpStatusCode.SIGNATURE_TRACKING_MODIFY_SUCCESS) {
            return throwError(() => error);
          }

          return of({
            isSuccessful: true,
            statusCode: HttpStatusCode.SIGNATURE_TRACKING_MODIFY_SUCCESS,
          } as IResponseRetryProcessPaymentOfPayroll)
        })
      );
  }

  private executeProcess(transaction: ITMTransaction, signatureType: string) {
    return this.processPaymentOfPayroll(transaction, signatureType)
      .pipe(
        concatMap(() => {
          if (transaction?.serviceCode !== ETMServiceCode.PAYMENT_OF_PAYROLL) {
            return of(transaction);
          }

          return this.notifyPaymentOfPayroll(transaction);
        })
      );
  }

  private processPaymentOfPayroll(transaction: ITMTransaction, signatureType: string) {
    return this.stTransaction.process({
      transactionCode: transaction?.reference,
      signatureType,
    }, true);
  }

  private notifyPaymentOfPayroll(transaction: ITMTransaction) {
    const detail = this.splitTransactionDetail.getDetailTransactionPaymentOfPayroll(transaction.request);

    const bodyRequest = {
      reference: transaction?.reference,
      name: detail?.productDescription,
      formLot: detail?.authorization,
      debitAccount: detail?.sourceAccountNumber,
      debitAccountName: detail?.productDescription,
      currency: detail?.currency,
      amount: `${this.utilService.parseAmountStringToNumber(transaction?.amount ?? detail?.amount)}`,
      paymentAmount: `${this.utilService.parseAmountStringToNumber(detail?.countAccounts)}`,
      scheduleDateTime: detail?.datePayment2,
      scheduleHourTime: detail?.hourPayment,
    } as IPaymentOfPayroll;


    return this.stTransaction.paymentOfPayroll(bodyRequest);
  }
}
