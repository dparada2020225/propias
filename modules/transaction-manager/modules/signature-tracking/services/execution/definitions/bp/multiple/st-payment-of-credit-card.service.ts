import { Injectable } from '@angular/core';
import { concatMap } from 'rxjs/operators';
import { SignatureTrackingService } from '../../../../transaction/signature-tracking.service';
import {
  SplitTransactionDetailService
} from '../../../../../../../services/manager/bp/split-transaction-detail.service';
import { ITMTransaction } from '../../../../../../../interfaces/tm-transaction.interface';
import { ICreditCardPayments } from '../../../../../interfaces/st-process.interface';

@Injectable({
  providedIn: 'root'
})
export class StPaymentOfCreditCardService {

  constructor(
    private stTransaction: SignatureTrackingService,
    private splitTransactionDetail: SplitTransactionDetailService,
  ) { }

  execute(transaction: ITMTransaction, signatureType: string) {
    return this.executeProcess(transaction, signatureType);
  }

  private executeProcess(transaction: ITMTransaction, signatureType: string) {
    return this.processPaymentOfCreditCard(transaction, signatureType)
      .pipe(
        concatMap(() => this.notifyPaymentOfCreditCard(transaction))
      );
  }

  private processPaymentOfCreditCard(transaction: ITMTransaction, signatureType: string) {
    return this.stTransaction.process({
      transactionCode: transaction?.reference,
      signatureType,
    }, true);
  }

  private notifyPaymentOfCreditCard(transaction: ITMTransaction) {
    const detail = this.splitTransactionDetail.getDetailTransactionPaymentCreditCard(transaction?.request);

    const bodyRequest = {
      reference: transaction?.reference,
      cardName: detail?.nameOfCard,
      debitAccount: detail?.sourceAccountNumber,
      cardNumber: detail?.cardTrucMasked,
      amount: transaction?.amount ?? detail?.amount,
      debitAmount: transaction?.amount ?? detail?.amount,
    } as ICreditCardPayments;

    return this.stTransaction.creditCardPayments(bodyRequest);
  }
}
