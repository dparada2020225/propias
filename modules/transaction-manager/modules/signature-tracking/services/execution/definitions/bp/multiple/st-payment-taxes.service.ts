import { Injectable } from '@angular/core';
import { concatMap } from 'rxjs/operators';
import { SignatureTrackingService } from '../../../../transaction/signature-tracking.service';
import {
  SplitTransactionDetailService
} from '../../../../../../../services/manager/bp/split-transaction-detail.service';
import { ITMTransaction } from '../../../../../../../interfaces/tm-transaction.interface';
import { IPaymentOfTaxesRequest } from '../../../../../interfaces/st-process.interface';

@Injectable({
  providedIn: 'root'
})
export class StPaymentTaxesService {

  constructor(
    private stTransaction: SignatureTrackingService,
    private splitTransactionDetail: SplitTransactionDetailService,
  ) { }

  execute(transaction: ITMTransaction, signatureType: string) {
    return this.executeProcess(transaction, signatureType);
  }

  private executeProcess(transaction: ITMTransaction, signatureType: string) {
    return this.processPaymentTaxes(transaction, signatureType)
      .pipe(
        concatMap(() => this.executePaymentTaxes(transaction))
      );
  }

  private processPaymentTaxes(transaction: ITMTransaction, signatureType: string) {
    return this.stTransaction.process({
      transactionCode: transaction?.reference,
      signatureType,
    }, true);

  }

  private executePaymentTaxes(transaction: ITMTransaction) {
    const detail = this.splitTransactionDetail.getDetailTransactionPaymentTaxes(transaction?.request);

    const bodyRequest = {
      processID: detail?.id,
    } as IPaymentOfTaxesRequest;

    return this.stTransaction.paymentOfTaxes(bodyRequest);
  }
}
