import { Injectable } from '@angular/core';
import { concatMap } from 'rxjs/operators';
import { SignatureTrackingService } from '../../../../transaction/signature-tracking.service';
import {
  SplitTransactionDetailService
} from '../../../../../../../services/manager/bp/split-transaction-detail.service';
import { ITMTransaction } from '../../../../../../../interfaces/tm-transaction.interface';
import { ICashierCheckRequest } from '../../../../../interfaces/st-process.interface';


@Injectable({
  providedIn: 'root'
})
export class StCashierCheckRequestService {

  constructor(
    private stSignatureTrackingService: SignatureTrackingService,
    private splitTransactionDetail: SplitTransactionDetailService,
  ) { }

  execute(transaction: ITMTransaction, signatureType: string) {
    return this.executeProcess(transaction, signatureType);
  }

  private executeProcess(transaction: ITMTransaction, signatureType: string) {
    return this.processCashierCheckRequestTransaction(transaction, signatureType)
      .pipe(
        concatMap(() => this.notifyCashierCheckRequestTransaction(transaction))
      );
  }

  private processCashierCheckRequestTransaction(transaction: ITMTransaction, signatureType: string) {
    return this.stSignatureTrackingService.process({
      transactionCode: transaction?.reference,
      signatureType,
    }, true);
  }

  private notifyCashierCheckRequestTransaction(transaction: ITMTransaction) {
    const detail = this.splitTransactionDetail.getDetailTransactionCashierCreditRequest(transaction?.request);

    const bodyRequest = {
      reference: transaction?.reference,
      customerName: detail?.userName,
      debitAccount: detail?.accountDebit,
      debitAccountName: detail?.nameOfAccountDebit,
      beneficiaries: [],
    } as ICashierCheckRequest;

    return this.stSignatureTrackingService.cashierCheckRequest(bodyRequest);
  }
}
