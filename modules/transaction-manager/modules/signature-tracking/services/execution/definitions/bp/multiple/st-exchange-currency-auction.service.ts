import { Injectable } from '@angular/core';
import { concatMap } from 'rxjs/operators';
import { SignatureTrackingService } from '../../../../transaction/signature-tracking.service';
import {
  SplitTransactionDetailService
} from '../../../../../../../services/manager/bp/split-transaction-detail.service';
import { ITMTransaction } from '../../../../../../../interfaces/tm-transaction.interface';
import { IForeignCurrencyAuction } from '../../../../../interfaces/st-process.interface';


@Injectable({
  providedIn: 'root'
})
export class StExchangeCurrencyAuctionService {

  constructor(
    private stTransaction: SignatureTrackingService,
    private splitTransactionDetail: SplitTransactionDetailService,
  ) { }

  execute(transaction: ITMTransaction, signatureType: string) {
    return this.executeProcess(transaction, signatureType);
  }

  private executeProcess(transaction: ITMTransaction, signatureType: string) {
    return this.processExchangeCurrencyAuction(transaction, signatureType)
      .pipe(
        concatMap(() => this.notifyExchangeCurrencyAuction(transaction))
      );
  }

  private processExchangeCurrencyAuction(transaction: ITMTransaction, signatureType: string) {
    return this.stTransaction.process({
      transactionCode: transaction?.reference,
      signatureType,
    }, true);
  }

  private notifyExchangeCurrencyAuction(transaction: ITMTransaction) {
    const detail = this.splitTransactionDetail.getDetailTransactionExchangeCurrencyAuction(transaction?.request);

    const bodyRequest = {
      reference: transaction?.reference,
      customerName: detail?.clientName,
      referenceExchangeRate: detail?.rateExchangeReference,
      targetAccount: detail?.targetAccountNumber,
      targetCurrency: detail?.targetCurrency,
      amount: transaction?.amount ?? detail?.amount,
      debitAccount: detail?.sourceAccountNumber,
      sourceCurrency: detail?.sourceCurrency,
      amountDebited: transaction?.amount ?? detail?.amount,
    } as IForeignCurrencyAuction;

    return this.stTransaction.exchangeCurrencyAuction(bodyRequest);

  }
}
