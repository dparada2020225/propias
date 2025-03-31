import { Injectable } from '@angular/core';
import { concatMap } from 'rxjs/operators';
import { StBisvService } from '../../../../transaction/st-bisv.service';
import { SignatureTrackingService } from '../../../../transaction/signature-tracking.service';
import {
  StBisvSplitTransactionManagerService
} from '../../../../../../../services/manager/bisv/st-bisv-split-transaction-manager.service';
import { TmCommonService } from '../../../../../../../services/tm-common.service';
import { ITMTransaction } from '../../../../../../../interfaces/tm-transaction.interface';

@Injectable({
  providedIn: 'root'
})
export class StTreasuryNpePaymentService {
  constructor(
    private stBisvService: StBisvService,
    private stTransaction: SignatureTrackingService,
    private stSplitService: StBisvSplitTransactionManagerService,
    private tmCommonService: TmCommonService,
  ) { }

  execute(transaction: ITMTransaction, signatureType: string) {
    const detail1 = this.stSplitService.getDetailTransactionForTreasuryPaymentNPE(transaction.request);
    return this.getTransactionDetail(transaction);
    // return this.executeProcess(transaction, signatureType);
  }

  private executeProcess(transaction: ITMTransaction, signatureType: string) {
    return this.process(transaction, signatureType)
      .pipe(
        concatMap(() => this.getTransactionDetail(transaction)),
        concatMap(() => this.saveDetailInDB(transaction)),
      );
  }

  private process(transaction: ITMTransaction, signatureType: string) {
    return this.stTransaction.process({
      transactionCode: transaction?.reference,
      signatureType,
    });
  }

  private getTransactionDetail(transaction: ITMTransaction) {
    return this.stBisvService.getTransactionDetailTreasuryPayment(transaction.reference);
  }

  private saveDetailInDB(transaction: ITMTransaction) {
    return this.stBisvService.saveTreasuryPaymentNPEIntoDb();
  }
}
