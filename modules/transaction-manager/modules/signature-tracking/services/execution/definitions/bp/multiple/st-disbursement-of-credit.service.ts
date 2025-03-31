import { Injectable } from '@angular/core';
import { concatMap } from 'rxjs/operators';
import {
  SplitTransactionDetailService
} from '../../../../../../../services/manager/bp/split-transaction-detail.service';
import { SignatureTrackingService } from '../../../../transaction/signature-tracking.service';
import { ITMTransaction } from '../../../../../../../interfaces/tm-transaction.interface';
import { ICreditPurchaseDisbursements } from '../../../../../interfaces/st-process.interface';

@Injectable({
  providedIn: 'root'
})
export class StDisbursementOfCreditService {

  constructor(
    private stTransaction: SignatureTrackingService,
    private splitTransactionDetail: SplitTransactionDetailService,
  ) { }

  execute(transaction: ITMTransaction, signatureType: string) {
    return this.executeProcess(transaction, signatureType);
  }

  private executeProcess(transaction: ITMTransaction, signatureType: string) {
    return this.processDisbursementOfCredit(transaction, signatureType)
      .pipe(
        concatMap(() => this.notifyDisbursementOfCredit(transaction))
      );
  }

  private processDisbursementOfCredit(transaction: ITMTransaction, signatureType: string) {
    return this.stTransaction.process({
      transactionCode: transaction?.reference,
      signatureType,
    }, true);
  }

  private notifyDisbursementOfCredit(transaction: ITMTransaction) {
    const detail = this.splitTransactionDetail.getDetailTransactionLoanDisbursement(transaction?.request);

    const bodyRequest = {
      reference: transaction?.reference,
      name: detail?.nameBusiness,
      debitAccount: detail?.creditAccount,
      customerName: detail?.nameBusiness,
      currency: detail?.currency,
      amount: transaction?.amount ?? detail?.amount,
    } as ICreditPurchaseDisbursements;


    return this.stTransaction.creditPurchaseDisbursements(bodyRequest);
  }

}
