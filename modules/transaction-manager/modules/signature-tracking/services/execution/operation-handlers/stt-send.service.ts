import { HttpErrorResponse } from '@angular/common/http';
import {  Injectable } from '@angular/core';
import { SignatureTrackingService } from '../../transaction/signature-tracking.service';
import { StCommonTransactionService } from '../st-common-transaction.service';
import { IProcessSTOperations } from '../../../interfaces/st-transfer.interface';
import { ESTTransactionStatus } from '../../../enum/st-common.enum';
import { UtilService } from '../../../../../../../service/common/util.service';


@Injectable({
  providedIn: 'root'
})
export class SttSendService {

  constructor(
    private transactionService: SignatureTrackingService,
    private stCommonTransaction: StCommonTransactionService,
    private utils: UtilService,
  ) { }

  sendExecute(sendProperties: IProcessSTOperations) {
    this.utils.showLoader();

    const bodyRequest = this.stCommonTransaction.buildBodyRequestToSendTransaction({
      transaction: sendProperties?.transaction,
      signatureType: sendProperties?.signatureType,
      transactionStatus:  sendProperties?.transactionStatus,
    });

    this.transactionService.send(bodyRequest)
      .subscribe({
        next: (response) => {
          this.stCommonTransaction.handleResponseProcessOperation({
            outPutResponse: {
              message: sendProperties.message,
              status: ESTTransactionStatus.SUCCESS,
              position: sendProperties.position,
              action: sendProperties.action,
              data: response,
            }
          });
        },
        error: (error: HttpErrorResponse) => {
          const message = error?.error?.message ?? 'error:signature_tracking_send';

          this.stCommonTransaction.handleResponseProcessOperation({
            outPutResponse: {
              status: ESTTransactionStatus.FAILED,
              position: sendProperties.position,
              action: sendProperties.action,
              data: null,
              message,
            }
          });
        }
      })
  }
}
