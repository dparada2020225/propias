import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize, map } from 'rxjs/operators';
import { UtilService } from '../../../../../../../service/common/util.service';
import { ISignatureTrackingProcess, ISTProcessWithToken } from '../../../interfaces/st-service.interface';
import { IProcessSTOperations, IProcessSTOperationsWithToken } from '../../../interfaces/st-transfer.interface';
import { ESTTransactionStatus } from '../../../enum/st-common.enum';
import { of } from 'rxjs';
import { StProcessHandlerService } from '../utils/st-process-handler.service';
import { UtilTransactionService } from '../../../../../../../service/common/util-transaction.service';
import { StCommonTransactionService } from '../st-common-transaction.service';

@Injectable({
  providedIn: 'root',
})
export class SttProcessService {
  constructor(
    private utils: UtilService,
    private stProcessHandler: StProcessHandlerService,
    private utilsTransaction: UtilTransactionService,
    private stCommonTransaction: StCommonTransactionService,
  ) { }

  processExecute(processProperties: IProcessSTOperations) {
    this.utils.showLoader();

    const accountToDelete: ISignatureTrackingProcess = {
      transactionCode: processProperties?.transaction?.reference,
      signatureType: processProperties?.signatureType,
    };

    this.stProcessHandler.processTransactionWithoutToken(accountToDelete)
      .subscribe({
        next: (response) => {
          this.stCommonTransaction.handleResponseProcessOperation({
            outPutResponse: {
              message: processProperties.message as string,
              status: ESTTransactionStatus.SUCCESS,
              position: processProperties.position,
              action: processProperties.action,
              data: response,
            }
          });
        },
        error: (error: HttpErrorResponse) => {
          const message = error?.error?.message ?? 'error:signature_tracking_process';

          this.stCommonTransaction.handleResponseProcessOperation({
            outPutResponse: {
              status: ESTTransactionStatus.FAILED,
              position: processProperties.position,
              action: processProperties.action,
              data: null,
              message,
            }
          });
        }
      })
  }

  processExecuteWithToken(parameters: IProcessSTOperationsWithToken) {
    const { isTokenRequired, token, typeTransaction, processProperties } = parameters ?? {};
    this.utils.showLoader();

    const bodyRequest: ISTProcessWithToken = {
      isTokenRequired,
      tokenValue: token,
      typeTransaction,
      bodyRequest: {
        signatureType: processProperties?.signatureType,
        transactionCode: processProperties?.transaction?.reference,
      },
      serviceCode: processProperties.transaction?.serviceCode,
    }

    return this.stProcessHandler.processTransactionWithToken(bodyRequest)
      .pipe(
        finalize(() => this.utils.hideLoader()),
        map(response => this.utilsTransaction.handleResponseTransaction(response)),
        catchError(error => of(this.utilsTransaction.handleErrorTransaction(error)),
      ));
  }
}
