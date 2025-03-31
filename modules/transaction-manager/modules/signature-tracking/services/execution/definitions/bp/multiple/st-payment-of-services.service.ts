import { Injectable } from '@angular/core';
import { concatMap } from 'rxjs/operators';
import { SignatureTrackingService } from '../../../../transaction/signature-tracking.service';
import {
  SplitTransactionDetailService
} from '../../../../../../../services/manager/bp/split-transaction-detail.service';
import { ITMTransaction } from '../../../../../../../interfaces/tm-transaction.interface';
import { IPaymentOFServices } from '../../../../../interfaces/st-process.interface';


@Injectable({
  providedIn: 'root'
})
export class StPaymentOfServicesService {

  constructor(
    private stTransaction: SignatureTrackingService,
    private splitTransactionDetail: SplitTransactionDetailService,
  ) { }


  execute(transaction: ITMTransaction, signatureType: string) {
    return this.executeProcess(transaction, signatureType);
  }

  private executeProcess(transaction: ITMTransaction, signatureType: string) {
    return this.processPaymentOfServices(transaction, signatureType)
      .pipe(
        concatMap(() => this.notifyPaymentOfServices(transaction))
      );
  }

  private processPaymentOfServices(transaction: ITMTransaction, signatureType: string) {
    return this.stTransaction.process({
      transactionCode: transaction?.reference,
      signatureType,
    }, true);

  }

  private notifyPaymentOfServices(transaction: ITMTransaction) {
    const detail = this.splitTransactionDetail.getDetailTransactionPaymentServices(transaction?.request);

    const bodyRequest = {
      reference: transaction?.reference,
      name: '',
      agreementCode: detail?.code,
      serviceName: '',
      amount: transaction?.amount ?? detail?.paymentValue,
      currency: detail?.currency,
      debitAccount: detail?.sourceAccountNumber,
    } as IPaymentOFServices;


    return this.stTransaction.paymentOfServices(bodyRequest);
  }
}
