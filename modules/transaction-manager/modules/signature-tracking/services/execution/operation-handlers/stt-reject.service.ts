import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignatureTrackingService } from '../../transaction/signature-tracking.service';
import { StCommonTransactionService } from '../st-common-transaction.service';
import { IProcessSTOperations } from '../../../interfaces/st-transfer.interface';
import { ESTTransactionStatus } from '../../../enum/st-common.enum';
import { UtilService } from '../../../../../../../service/common/util.service';


@Injectable({
  providedIn: 'root'
})
export class SttRejectService {

  constructor(
    private transactionService: SignatureTrackingService,
    private stCommonTransaction: StCommonTransactionService,
    private utils: UtilService,
  ) { }

  rejectExecute(rejectProperties: IProcessSTOperations) {
    this.utils.showLoader();

    const bodyRequest = this.stCommonTransaction.buildBodyRequestToAllOperations({
      transaction: rejectProperties?.transaction,
      signatureType: rejectProperties?.signatureType,
      transactionStatus: rejectProperties?.transactionStatus,
    });

    this.transactionService.toReturn(bodyRequest)
      .subscribe({
        next: (response) => {
          this.stCommonTransaction.handleResponseProcessOperation({
            outPutResponse: {
              message: rejectProperties.message as string,
              status: ESTTransactionStatus.SUCCESS,
              position: rejectProperties.position,
              action: rejectProperties.action,
              data: response,
            },
          });
        },
        error: (error: HttpErrorResponse) => {
          const message = error?.error?.message ?? 'error:signature_tracking_reject';

          this.stCommonTransaction.handleResponseProcessOperation({
            outPutResponse: {
              status: ESTTransactionStatus.FAILED,
              position: rejectProperties.position,
              action: rejectProperties.action,
              data: null,
              message,
            },
          });
        }
      })
  }
}
