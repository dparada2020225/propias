import { Injectable } from '@angular/core';
import { forkJoin, of, Subject } from 'rxjs';
import { TmCommonService } from '../../../../../services/tm-common.service';
import { StCommonTransactionService } from '../st-common-transaction.service';
import { SignatureTrackingService } from '../../transaction/signature-tracking.service';
import { catchError, finalize, map } from 'rxjs/operators';
import { ISTOperationStartupParameters } from '../../../interfaces/st-operations.interface';
import { ITMTransaction } from '../../../../../interfaces/tm-transaction.interface';
import { ESignatureTrackingTypeAction } from '../../../enum/st-transaction-status.enum';
import { ITMServiceDetailAccountOperation } from '../../../../../interfaces/transaction-manager-navigate.interface';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { ESTTransactionStatus, ETransactionStatus } from '../../../enum/st-common.enum';
import { UtilService } from '../../../../../../../service/common/util.service';
import { IUserInfo } from '../../../../../../../models/user-info.interface';
import { TranslateService } from '@ngx-translate/core';
import { FeatureManagerService } from '../../../../../../../service/common/feature-manager.service';
import { HttpStatusCode } from '../../../../../../../enums/http-status-code.enum';
import { ModalTokenComponent } from '../../../../../../../view/private/token/modal-token/modal-token.component';
import { environment } from '../../../../../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TypeTokenEnum } from '../../../../../../../enums/token.enum';
import { TmOperationsService } from '../../../../../services/handlers/tm-operations.service';

@Injectable({
  providedIn: 'root'
})
export class StAuthorizeService {
  private isLoading = true;
  private staticMessage: string | null = null;
  private dynamicMessage$: Subject<string> = new Subject();
  private userInfo: IUserInfo = this.persistStepStateService.getParameter('userInfo');


  get loading() {
    return this.isLoading;
  }

  get currentMessage() {
    return this.staticMessage;
  }

  get message() {
    return this.dynamicMessage$.asObservable();
  }


  constructor(
    private transactionManagerCommon: TmCommonService,
    private stCommonTransaction: StCommonTransactionService,
    private navigateOperationManager: TmOperationsService,
    private signatureTrackingService: SignatureTrackingService,
    private persistStepStateService: ParameterManagementService,
    private utils: UtilService,
    private translate: TranslateService,
    private featureManager: FeatureManagerService,
    private modalService: NgbModal,
  ) { }

  authorize(startupParameters: ISTOperationStartupParameters) {
    const { transactionList, currentTabPosition, servicesSupported } = startupParameters ?? {};
    this.staticMessage = null;

    if (transactionList.length <= 0) {
      this.isLoading = false;
      this.staticMessage = 'authorized_empty_selected';
      return;
    }

    if (transactionList.length > 1 && this.featureManager.isBisvSignatureTrackingFeaturesEnabled()) {
      return this.openTokenModal(startupParameters);
    }

    if (transactionList.length > 1) {
      return this.authorizeMultiple(startupParameters);
    }

    const transactionToAuthorize = transactionList[0];
    const isSupportedTransaction = this.transactionManagerCommon.isSupportedTransaction(servicesSupported, transactionToAuthorize);

    if (!isSupportedTransaction) {
      this.utils.showLoader();
      this.isLoading = false;
      this.staticMessage = null;

      this.transactionManagerCommon.handleNavigateToEmbbededBanking({
        tabPosition: this.stCommonTransaction.getCurrentStep(currentTabPosition),
        action: ESignatureTrackingTypeAction.AUTHORIZE,
        reference: transactionToAuthorize?.reference,
        service: transactionToAuthorize?.serviceCode
      });
      return;
    }

    const parameter: ITMServiceDetailAccountOperation = {
      transactionSelected: transactionToAuthorize,
      action: ESignatureTrackingTypeAction.AUTHORIZE,
      position: currentTabPosition,
    };

    this.navigateOperationManager.manageOperationTransferNavigation(parameter);
  }

  private authorizeMultiple(startupParameters: ISTOperationStartupParameters) {
    const { transactionList, fn } = startupParameters ?? {};

    this.utils.showPulseLoader();

    const request = forkJoin(this.executeAuthorizeTransaction(transactionList));
    request.pipe(finalize(() => {
      this.utils.hidePulseLoader();
      if (fn) {
        fn();
      }
    })).subscribe(response => {
      const messageCompletedSignatures = this.translate.instant('alert_message_st');
      const messageCompletedSignatureMultiple = this.translate.instant('label:st_authorize_multiple');
      const hasTransactionFailed = response.
      some(transaction => transaction.status === ESTTransactionStatus.FAILED);

      const successTransactions = response
        .filter((transaction) => transaction.status === ESTTransactionStatus.SUCCESS);
      const isCompletedSignatureTransactions = successTransactions
        .every((transaction) => transaction.statusCode === HttpStatusCode.SIGNATURE_TRACKING_AUTHORIZATION);
      const isNeededAnotherSignatureTransaction = successTransactions
        .every((transaction) => transaction.errorDetail === null);


      if (hasTransactionFailed) {
        this.stCommonTransaction.modalFailedTransactions({
          transactionResponseList: response,
        });
      }

      if (successTransactions.length > 0 && isCompletedSignatureTransactions) {
        const bisvMessage = successTransactions.length > 1 ? messageCompletedSignatureMultiple : successTransactions[0].errorDetail;
        const message = this.featureManager.isBisvSignatureTrackingFeaturesEnabled()  ? bisvMessage : messageCompletedSignatures;
        this.dynamicMessage$.next(message);
      }

      if (successTransactions.length > 0 && isNeededAnotherSignatureTransaction) {
        this.dynamicMessage$.next('signature_tracking:authorize_successfully');
      }

      this.isLoading = false;
    });

  }

  private executeAuthorizeTransaction(transactionList: ITMTransaction[]) {
    return transactionList.map(transaction => this.signatureTrackingService.authorize({
      transactionCode: transaction?.reference,
      signatureType: this.userInfo?.signatureType,
      transactionStatus: ETransactionStatus.TO_AUTHORIZE
    })
      .pipe(
        map(() => this.stCommonTransaction.buildTransactionDetailResponse(transaction)),
        catchError((error) => of(this.stCommonTransaction.buildTransactionDetailResponse(transaction, error)))
      ));
  }

  private openTokenModal(startupParameters: ISTOperationStartupParameters) {
    const typeToken = this.utils.getTokenType();

    if (typeToken === TypeTokenEnum.SMS) {
    }
    return this.authorizeMultiple(startupParameters);
    // const modal = this.modalService.open(ModalTokenComponent, {
    //   centered: true,
    //   windowClass: `${environment.profile || 'byte-theme'} own-modal sm-600`,
    //   size: 'lg',
    // });
    //
    // modal.result
    //   .then((result) => {
    //     if (!result) return;
    //
    //     this.authorizeMultiple(startupParameters);
    //   })
    //   .catch((error) => error);
  }
}
