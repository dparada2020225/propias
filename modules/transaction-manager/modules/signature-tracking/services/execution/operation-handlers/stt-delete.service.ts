import { Injectable } from '@angular/core';
import { SignatureTrackingService } from '../../transaction/signature-tracking.service';
import { HttpErrorResponse } from '@angular/common/http';
import { StCommonTransactionService } from '../st-common-transaction.service';
import { IProcessSTOperations } from '../../../interfaces/st-transfer.interface';
import { ESTTransactionStatus } from '../../../enum/st-common.enum';
import { UtilService } from '../../../../../../../service/common/util.service';


@Injectable({
  providedIn: 'root'
})
export class SttDeleteService {
  constructor(
    private transactionService: SignatureTrackingService,
    private stCommonTransaction: StCommonTransactionService,
    private utils: UtilService,
  ) { }

  deleteExecute(deleteProperties: IProcessSTOperations) {
    this.utils.showLoader();

    const bodyRequest = this.stCommonTransaction.buildBodyRequestToAllOperations({
      transaction: deleteProperties?.transaction,
      signatureType: deleteProperties?.signatureType,
      transactionStatus: deleteProperties?.transactionStatus,
    });

    this.transactionService.delete(bodyRequest)
      .subscribe({
        next: (response) => {
          this.stCommonTransaction.handleResponseProcessOperation({
            outPutResponse: {
              message: deleteProperties.message as string,
              status: ESTTransactionStatus.SUCCESS,
              position: deleteProperties.position,
              action: deleteProperties.action,
              data: response,
            },
          });
        },
        error: (error: HttpErrorResponse) => {
          const message = error?.error?.message ?? 'error:signature_tracking_delete';

          this.stCommonTransaction.handleResponseProcessOperation({
            outPutResponse: {
              status: ESTTransactionStatus.FAILED,
              position: deleteProperties.position,
              action: deleteProperties.action,
              data: null,
              message,
            },
          });
        }
      }
    )
  }

}
