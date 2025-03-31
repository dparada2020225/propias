import { Injectable } from '@angular/core';
import { forkJoin, of, Subject } from 'rxjs';
import { TmCommonService } from '../../../../../services/tm-common.service';
import { StCommonTransactionService } from '../st-common-transaction.service';
import { SignatureTrackingService } from '../../transaction/signature-tracking.service';
import { ISTOperationStartupParameters } from '../../../interfaces/st-operations.interface';
import { ITMTransaction } from '../../../../../interfaces/tm-transaction.interface';
import { catchError, finalize, map } from 'rxjs/operators';
import { ESignatureTrackingTypeAction } from '../../../enum/st-transaction-status.enum';
import { ITMServiceDetailAccountOperation } from '../../../../../interfaces/transaction-manager-navigate.interface';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { ESTTransactionStatus } from '../../../enum/st-common.enum';
import { UtilService } from '../../../../../../../service/common/util.service';
import { IUserInfo } from '../../../../../../../models/user-info.interface';
import { FeatureManagerService } from '../../../../../../../service/common/feature-manager.service';
import { AdfAlertModalComponent } from '@adf/components';
import { environment } from '../../../../../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StBuildUpdateBodyRequestService } from '../../definition/st-build-update-body-request.service';
import { TmOperationsService } from '../../../../../services/handlers/tm-operations.service';

@Injectable({
  providedIn: 'root'
})
export class StRejectService {
  private isLoading = true;
  private staticMessage: string | null = null;
  private dynamicMessage$: Subject<string> = new Subject();
  private userInfo: IUserInfo = this.persistStepStateService.getParameter('userInfo');
  private currentTabPosition: number | null = null;


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
    private featureManager: FeatureManagerService,
    private modalService: NgbModal,
    private stBuildUpdateBodyRequest: StBuildUpdateBodyRequestService,
  ) { }

  reject(startupParameters: ISTOperationStartupParameters) {
    const { transactionList, currentTabPosition } = startupParameters ?? {};
    this.currentTabPosition = currentTabPosition;
    this.staticMessage = null;

    if (transactionList.length <= 0) {
      this.isLoading = false;
      this.staticMessage = 'reject_empty_selected';
      return;
    }

    if (transactionList.length > 1 && this.featureManager.isBisvSignatureTrackingFeaturesEnabled()) {
      this.isLoading = false;
      return this.openModal(startupParameters);
    }

    if (transactionList.length > 1 && !this.featureManager.isBisvSignatureTrackingFeaturesEnabled()) {
      return this.rejectMultiple(startupParameters);
    }

    if (this.featureManager.isStBisvMultipleEnabled()) {
      this.isLoading = false;
      const isManageSingleTransactionByModal = true;
      this.openModal(startupParameters, isManageSingleTransactionByModal);
      return;
    }

    this.manageRejectSingleTransaction(startupParameters);
  }

  private manageRejectSingleTransaction(startupParameters: ISTOperationStartupParameters) {
    const { transactionList, servicesSupported, currentTabPosition} = startupParameters;

    const transactionToReject = transactionList[0];
    const isSupportedTransaction = this.transactionManagerCommon.isSupportedTransaction(servicesSupported, transactionToReject);

    if (!isSupportedTransaction) {
      this.utils.showLoader();
      this.isLoading = false;
      this.staticMessage = null;

      this.transactionManagerCommon.handleNavigateToEmbbededBanking({
        tabPosition: this.stCommonTransaction.getCurrentStep(currentTabPosition),
        action: ESignatureTrackingTypeAction.REJECT,
        reference: transactionToReject?.reference,
        service: transactionToReject?.serviceCode
      });
      return;
    }

    const parameter: ITMServiceDetailAccountOperation = {
      transactionSelected: transactionToReject,
      action: ESignatureTrackingTypeAction.REJECT,
      position: currentTabPosition,
    };

    this.navigateOperationManager.manageOperationTransferNavigation(parameter);
  }

  private openModal(startupParameters: ISTOperationStartupParameters, isManageSingleTransaction = false) {
    const modal = this.modalService.open(AdfAlertModalComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} alert-modal`,
      size: `lg`,
    });

    modal.dismissed.subscribe(() => {
      return;
    });

    const messageModal = isManageSingleTransaction ? 'label:st_reject_single' : 'label:st_reject_multiple';

    modal.componentInstance.data = this.stBuildUpdateBodyRequest.buildUpdateAlert(messageModal);

    modal.result.then(isResult => {
      if (!isResult) return;

      if (isManageSingleTransaction) {
        this.manageRejectSingleTransaction(startupParameters);
        return;
      }

      this.isLoading = true;
      this.rejectMultiple(startupParameters);

    }).catch(error => error);
  }

  private rejectMultiple(startupParameters: ISTOperationStartupParameters) {
    const { transactionList, fn } = startupParameters ?? {};

    this.utils.showPulseLoader();

    const request = forkJoin(this.executeRejectTransaction(transactionList));

    request.pipe(finalize(() => {
      this.utils.hidePulseLoader();
      if (fn) {
        fn();
      }
    })).subscribe(response => {
      const hasTransactionFailed = response
        .some(transaction => transaction.status === ESTTransactionStatus.FAILED);

      const hasSuccessTransactions = response
        .some(transaction => transaction.status === ESTTransactionStatus.SUCCESS);

      if (hasTransactionFailed) {
        this.stCommonTransaction.modalFailedTransactions({
          transactionResponseList: response,
        });
      }

      if (hasSuccessTransactions && this.featureManager.isBisvSignatureTrackingFeaturesEnabled()) {
        this.dynamicMessage$.next( 'label:st_success_reject_multiple_trx');
      }

      this.isLoading = false;
    });


  }

  private executeRejectTransaction(transactionList: ITMTransaction[]) {
    return transactionList.map(transaction => this.signatureTrackingService.toReturn({
      transactionCode: transaction?.reference,
      signatureType: this.userInfo?.signatureType,
      transactionStatus: this.stCommonTransaction.getTransactionStatus(this.currentTabPosition as number),
    })
      .pipe(
        map(() => this.stCommonTransaction.buildTransactionDetailResponse(transaction)),
        catchError((error) => of(this.stCommonTransaction.buildTransactionDetailResponse(transaction, error)))
      ));
  }
}
