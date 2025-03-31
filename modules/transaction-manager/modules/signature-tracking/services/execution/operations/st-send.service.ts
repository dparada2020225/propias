import { Injectable } from '@angular/core';
import { ITMTransaction } from '../../../../../interfaces/tm-transaction.interface';
import { ISTOperationStartupParameters } from '../../../interfaces/st-operations.interface';
import { TmCommonService } from '../../../../../services/tm-common.service';
import { ESignatureTrackingTypeAction } from '../../../enum/st-transaction-status.enum';
import { StCommonTransactionService } from '../st-common-transaction.service';
import { ITMServiceDetailAccountOperation } from '../../../../../interfaces/transaction-manager-navigate.interface';
import { SignatureTrackingService } from '../../transaction/signature-tracking.service';
import { catchError, finalize, map } from 'rxjs/operators';
import { forkJoin, of, Subject } from 'rxjs';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { UtilService } from '../../../../../../../service/common/util.service';
import { ESTTransactionStatus, ETransactionStatus } from '../../../enum/st-common.enum';
import { IUserInfo } from '../../../../../../../models/user-info.interface';
import { FeatureManagerService } from '../../../../../../../service/common/feature-manager.service';
import { TmOperationsService } from '../../../../../services/handlers/tm-operations.service';

@Injectable({
  providedIn: 'root',
})
export class StSendService {
  private isLoading = true;
  private message$: Subject<string> = new Subject();
  private message: string | null = null;
  private userInfo: IUserInfo = this.persistStepStateService.getParameter('userInfo');


  get loadingTransaction() {
    return this.isLoading;
  }

  get currentMessage() {
    return this.message;
  }

  get messageAlert() {
    return this.message$.asObservable();
  }


  constructor(
    private transactionManagerCommon: TmCommonService,
    private stCommonTransaction: StCommonTransactionService,
    private navigateOperationManager: TmOperationsService,
    private signatureTrackingService: SignatureTrackingService,
    private persistStepStateService: ParameterManagementService,
    private utils: UtilService,
    private featureManager: FeatureManagerService,
  ) {

  }

  send(startupParameters: ISTOperationStartupParameters) {
    const { transactionList, currentTabPosition, servicesSupported } = startupParameters ?? {};
    this.message = null;

    if (transactionList.length <= 0) {
      this.isLoading = false;
      this.message = 'error:send_selected_account';
      return;
    }

    if (transactionList.length > 1) {
      return this.sendMultiple(startupParameters);
    }

    const transactionToSend = transactionList[0];
    const isSupportedTransaction = this.transactionManagerCommon.isSupportedTransaction(servicesSupported, transactionToSend);

    if (!isSupportedTransaction) {
      this.utils.showLoader();
      this.isLoading = false;
      this.message = null;

      this.transactionManagerCommon.handleNavigateToEmbbededBanking({
        tabPosition: this.stCommonTransaction.getCurrentStep(currentTabPosition),
        action: ESignatureTrackingTypeAction.SEND,
        reference: transactionToSend?.reference,
        service: transactionToSend?.serviceCode
      });
      return;
    }

    const parameter: ITMServiceDetailAccountOperation = {
      transactionSelected: transactionToSend,
      action: ESignatureTrackingTypeAction.SEND,
      position: currentTabPosition,
    };

    this.navigateOperationManager.manageOperationTransferNavigation(parameter);
  }



  private sendMultiple(startupParameters: ISTOperationStartupParameters) {
    const { transactionList, fn } = startupParameters ?? {};

    this.utils.showPulseLoader();

    const request = forkJoin(this.executeSendTransaction(transactionList));

    request.pipe(finalize(() => {
      this.utils.hidePulseLoader();
      if (fn) {
        fn();
      }
    }))
      .subscribe({
        next: (response) => {
          const hasTransactionFailed = response
            .some(transaction => transaction.status === ESTTransactionStatus.FAILED);
          const hasSuccessTransactions = response
            .some(transaction => transaction.status === ESTTransactionStatus.SUCCESS);

          if (hasTransactionFailed) {
            this.stCommonTransaction.modalFailedTransactions({
              transactionResponseList: response,
            });
          }

          if (hasSuccessTransactions) {
            this.message$.next( 'signature_tracking:send_multiply_successfully');
          }

          this.isLoading = false;
        }
      });
  }

  private executeSendTransaction(transactionList: ITMTransaction[]) {
    return transactionList.map(transaction =>  this.signatureTrackingService.send(
      this.stCommonTransaction.buildBodyRequestToSendTransaction({
        transaction,
        signatureType: this.userInfo?.signatureType,
        transactionStatus: ETransactionStatus.ENTERED,
      })
    )
      .pipe(
        map(() => this.stCommonTransaction.buildTransactionDetailResponse(transaction)),
        catchError((error) => of(this.stCommonTransaction.buildTransactionDetailResponse(transaction, error)))
      ));
  }
}
