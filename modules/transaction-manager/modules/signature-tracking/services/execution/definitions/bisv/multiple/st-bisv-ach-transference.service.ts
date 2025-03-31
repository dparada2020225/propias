import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {
  StBisvSplitTransactionManagerService
} from '../../../../../../../services/manager/bisv/st-bisv-split-transaction-manager.service';
import { ITMTransaction } from '../../../../../../../interfaces/tm-transaction.interface';
import { EACHServiceMapped } from '../../../../../../../../transfer/enum/ach-transaction.enum';
import { StBisvAchUniService } from '../atomic/st-bisv-ach-uni.service';
import { StBisvAchM365Service } from '../atomic/st-bisv-ach-m365.service';
import { StBisvAch365Service } from '../atomic/st-bisv-ach-365.service';


@Injectable({
  providedIn: 'root'
})
export class StBisvAchTransferenceService {

  constructor(
    private stSplitTransactionService: StBisvSplitTransactionManagerService,
    private stAchUniService: StBisvAchUniService,
    private stAchS365Service: StBisvAchM365Service,
    private stAchT365Service: StBisvAch365Service,
    private translate: TranslateService,
  ) { }

  execute(transaction: ITMTransaction, signatureType: string) {
    const typeServiceMapped = {
      [EACHServiceMapped.UNI]: () => this.stAchUniService.execute(transaction, signatureType),
      [EACHServiceMapped.MOVIL_365]: () => this.stAchS365Service.execute(transaction, signatureType),
      [EACHServiceMapped.NORMAL_365]: () => this.stAchT365Service.execute(transaction, signatureType),
      [EACHServiceMapped.CA_RD_BUSINESS_365]: () => this.stAchUniService.execute(transaction, signatureType),
    }

    const detailTransaction = this.stSplitTransactionService.getTransactionDetailForACHInBiesProfile(transaction.request);
    const service = typeServiceMapped[detailTransaction.typeService] as () => Observable<any> | undefined;

    if (!service) return this.manageCustomTransactionError('st:ach_error_transaction');

    return service() as Observable<any>;
  }

  private manageCustomTransactionError(message: string) {
    const messageTranslated = this.translate.instant(message);

    return throwError(() => ({
      error: {
        message: messageTranslated,
      },
      status: 400,
      statusText: message,
    }));
  }
}
