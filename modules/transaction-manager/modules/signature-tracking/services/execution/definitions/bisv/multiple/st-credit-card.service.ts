import { Injectable } from '@angular/core';
import { concatMap } from 'rxjs/operators';
import { StBisvService } from '../../../../transaction/st-bisv.service';
import { SignatureTrackingService } from '../../../../transaction/signature-tracking.service';
import {
  StBisvSplitTransactionManagerService
} from '../../../../../../../services/manager/bisv/st-bisv-split-transaction-manager.service';
import { ITMTransaction } from '../../../../../../../interfaces/tm-transaction.interface';
import { IStBISVCreditCardPaymentNotifyRequest } from '../../../../../interfaces/bisv/st-credit-card-payment.interface';


@Injectable({
  providedIn: 'root'
})
export class StCreditCardService {

  constructor(
    private stBisvService: StBisvService,
    private stTransaction: SignatureTrackingService,
    private stSplitService: StBisvSplitTransactionManagerService,
  ) { }

  execute(transaction: ITMTransaction, signatureType: string) {
    return this.executeProcess(transaction, signatureType);
  }

  private executeProcess(transaction: ITMTransaction, signatureType: string) {
    return this.process(transaction, signatureType)
      .pipe(
        concatMap(() => this.notify(transaction)),
      );
  }

  private process(transaction: ITMTransaction, signatureType: string) {
    return this.stTransaction.process({
      transactionCode: transaction?.reference,
      signatureType,
    });
  }

  private notify(transaction: ITMTransaction) {
    const detail = this.stSplitService.getDetailTransactionPaymentOfCreditCard(transaction.request);

    const bodyRequest = {
      cardName: detail.multiCurrencyProductDescription.trim(),
      debitAccount: detail.account.trim(),
      cardNumber: detail.description.trim(),
      amount: detail.amountParsed,
      currency: detail.currency,
      debitAmount: detail.amountParsed,
      reference: transaction.reference,
      lps: detail.currency === 'USD' ? 'N' : 'Y',
      dls: detail.currency === 'USD' ? 'S' : 'N',
      trx: '',
      mode: '',
    } as IStBISVCreditCardPaymentNotifyRequest;

    return this.stBisvService.notifyCreditCardPayment(bodyRequest);
  }
}
