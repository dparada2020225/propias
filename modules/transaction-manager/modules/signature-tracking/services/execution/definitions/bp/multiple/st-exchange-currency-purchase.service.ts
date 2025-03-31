import { Injectable } from '@angular/core';
import { concatMap } from 'rxjs/operators';
import { SignatureTrackingService } from '../../../../transaction/signature-tracking.service';
import {
  SplitTransactionDetailService
} from '../../../../../../../services/manager/bp/split-transaction-detail.service';
import { ITMTransaction } from '../../../../../../../interfaces/tm-transaction.interface';
import { IPurchaseForeignCurrency } from '../../../../../interfaces/st-process.interface';


@Injectable({
  providedIn: 'root'
})
export class StExchangeCurrencyPurchaseService {

  constructor(
    private stTransaction: SignatureTrackingService,
    private splitTransactionDetail: SplitTransactionDetailService,
  ) { }

  execute(transaction: ITMTransaction, signatureType: string) {
    return this.executeProcess(transaction, signatureType);
  }

  private executeProcess(transaction: ITMTransaction, signatureType: string) {
    return this.processExchangeCurrencyPurchase(transaction, signatureType)
      .pipe(
        concatMap(() => this.notifyExchangeCurrencyPurchase(transaction))
      );
  }

  private processExchangeCurrencyPurchase(transaction: ITMTransaction, signatureType: string) {
    return this.stTransaction.process({
      transactionCode: transaction?.reference,
      signatureType,
    }, true);
  }

  private notifyExchangeCurrencyPurchase(transaction: ITMTransaction) {
    const detail = this.splitTransactionDetail.getDetailTransactionPurchaseForeignCurrency(transaction?.request);

    const bodyRequest = {
      reference: transaction?.reference,
      name: '',
      amount: detail?.amount,
      equivalentAmount: detail?.lempirasEquivalence,
      exchangeRate: detail?.rateExchange,
      debitAccount: detail?.accountDebited,
      creditAccount: detail?.accountAccredited,
      currency: transaction?.currency,
    } as IPurchaseForeignCurrency;

    return this.stTransaction.exchangeCurrencyPurchase(bodyRequest);
  }
}
