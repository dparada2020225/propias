import { Injectable } from '@angular/core';
import { concatMap } from 'rxjs/operators';
import { SignatureTrackingService } from '../../../../transaction/signature-tracking.service';
import {
  SplitTransactionDetailService
} from '../../../../../../../services/manager/bp/split-transaction-detail.service';
import { ITMTransaction } from '../../../../../../../interfaces/tm-transaction.interface';
import { IDivideItAllUp } from '../../../../../interfaces/st-process.interface';


@Injectable({
  providedIn: 'root'
})
export class StDivideAllService {

  constructor(
    private stTransaction: SignatureTrackingService,
    private splitTransactionDetail: SplitTransactionDetailService,
  ) { }


  execute(transaction: ITMTransaction, signatureType: string) {
    return this.executeProcess(transaction, signatureType);
  }

  private executeProcess(transaction: ITMTransaction, signatureType: string) {
    return this.processDivideItAll(transaction, signatureType)
      .pipe(
        concatMap(() => this.notifyDivideItAll(transaction))
      );
  }

  private processDivideItAll(transaction: ITMTransaction, signatureType: string) {
    return this.stTransaction.process({
      transactionCode: transaction?.reference,
      signatureType,
    }, true);
  }

  private notifyDivideItAll(transaction: ITMTransaction) {
    const detail = this.splitTransactionDetail.getDetailTransactionDivideAll(transaction?.request);

    const bodyRequest = {
      reference: transaction?.reference,
      name: detail?.nameBusiness,
      cardNumber: detail?.targetNumberAccountTrunc,
      cardName: detail?.nameCard,
      currency: detail?.currency,
      amount: transaction?.amount ?? detail?.amount,
      term: detail?.deadline,
      monthlyFee: detail?.monthlyQuota,
    } as IDivideItAllUp;


    return this.stTransaction.divideItAllUp(bodyRequest);
  }
}
