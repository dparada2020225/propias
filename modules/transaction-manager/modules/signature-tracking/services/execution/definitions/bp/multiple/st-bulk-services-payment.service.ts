import { Injectable } from '@angular/core';
import { concatMap } from 'rxjs/operators';
import { SignatureTrackingService } from '../../../../transaction/signature-tracking.service';
import {
  SplitTransactionDetailService
} from '../../../../../../../services/manager/bp/split-transaction-detail.service';
import { ITMTransaction } from '../../../../../../../interfaces/tm-transaction.interface';
import { IPaymentOfBulkServices } from '../../../../../interfaces/st-process.interface';


@Injectable({
  providedIn: 'root'
})
export class StBulkServicesPaymentService {

  constructor(
    private stTransactionService: SignatureTrackingService,
    private splitTransactionDetail: SplitTransactionDetailService,
  ) { }

  execute(transaction: ITMTransaction, signatureType: string) {
    return this.executeProcess(transaction, signatureType);
  }

  private executeProcess(transaction: ITMTransaction, signatureType: string) {
    return this.process(transaction, signatureType)
      .pipe(
        concatMap(() => this.notify(transaction))
      );
  }

  private process(transaction: ITMTransaction, signatureType: string) {
    return this.stTransactionService.process({
      transactionCode: transaction?.reference,
      signatureType,
    }, true);
  }

  private notify(transaction: ITMTransaction) {
    const detail = this.splitTransactionDetail.getDetailTransactionBulkPaymentServices(transaction?.request);

    const bodyRequest = {
      reference: transaction?.reference,
      name: detail?.userName,
      agreementCode: detail?.code,
      serviceCode: transaction?.serviceCode,
      lot: detail?.numberOfLote,
      paymentAmount: detail?.amountOfPayments,
      amount: transaction?.amount ?? detail?.amount,
      currency: detail?.currency,
      debitAccount: detail?.accountDebit,
    } as IPaymentOfBulkServices;

    return this.stTransactionService.paymentOfBulkServices(bodyRequest);
  }
}
