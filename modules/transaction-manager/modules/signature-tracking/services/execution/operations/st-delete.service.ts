import { Injectable } from '@angular/core';
import { forkJoin, of, Subject } from 'rxjs';
import { TmCommonService } from '../../../../../services/tm-common.service';
import { StCommonTransactionService } from '../st-common-transaction.service';
import { SignatureTrackingService } from '../../transaction/signature-tracking.service';
import { ISTOperationStartupParameters } from '../../../interfaces/st-operations.interface';
import { catchError, finalize, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ITMTransaction } from '../../../../../interfaces/tm-transaction.interface';
import { ESignatureTrackingTypeAction } from '../../../enum/st-transaction-status.enum';
import { ITMServiceDetailAccountOperation } from '../../../../../interfaces/transaction-manager-navigate.interface';
import { AdfAlertModalComponent } from '@adf/components';
import { environment } from '../../../../../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StBuildUpdateBodyRequestService } from '../../definition/st-build-update-body-request.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { ESTTransactionStatus, ETransactionStatus } from '../../../enum/st-common.enum';
import { UtilService } from '../../../../../../../service/common/util.service';
import { IUserInfo } from '../../../../../../../models/user-info.interface';
import { FeatureManagerService } from '../../../../../../../service/common/feature-manager.service';
import { TmOperationsService } from '../../../../../services/handlers/tm-operations.service';

@Injectable({
  providedIn: 'root',
})
export class StDeleteService {
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
    private modalService: NgbModal,
    private stBuildUpdateBodyRequest: StBuildUpdateBodyRequestService,
    private utils: UtilService,
    private featureManager: FeatureManagerService,
  ) { }

  delete(startupParameters: ISTOperationStartupParameters) {
    const { transactionList } = startupParameters ?? {};
    this.staticMessage = null;

    if (transactionList.length <= 0) {
      this.isLoading = false;
      this.staticMessage = 'error:delete_selected_account';
      return;
    }

    if (transactionList.length > 1) {
      this.isLoading = false;
      return this.openModal(startupParameters);
    }

    if (this.featureManager.isStBisvMultipleEnabled()) {
      this.isLoading = false;
      const isManageSingleTransactionByModal = true;
      this.openModal(startupParameters, isManageSingleTransactionByModal);
      return;
    }

    this.mangeDeleteSingleTransaction(startupParameters);
  }

  private mangeDeleteSingleTransaction(startupParameters: ISTOperationStartupParameters) {
    const { currentTabPosition, transactionList, servicesSupported } = startupParameters;
    const transactionToDelete = transactionList[0];
    const isSupportedTransaction = this.transactionManagerCommon.isSupportedTransaction(servicesSupported, transactionToDelete);

    if (!isSupportedTransaction) {
      this.utils.showLoader();
      this.isLoading = false;
      this.staticMessage = null;

      this.transactionManagerCommon.handleNavigateToEmbbededBanking({
        tabPosition: this.stCommonTransaction.getCurrentStep(currentTabPosition),
        action: ESignatureTrackingTypeAction.DELETE,
        reference: transactionToDelete?.reference,
        service: transactionToDelete?.serviceCode
      });
      return;
    }

    const parameter: ITMServiceDetailAccountOperation = {
      transactionSelected: transactionToDelete,
      action: ESignatureTrackingTypeAction.DELETE,
      position: currentTabPosition,
    };

    this.navigateOperationManager.manageOperationTransferNavigation(parameter);
  }

  private deleteMultiple(startupParameters: ISTOperationStartupParameters) {
    const { transactionList, fn } = startupParameters ?? {};

    this.utils.showPulseLoader();

    const request = forkJoin(this.executeDeleteTransaction(transactionList));

    request.pipe(finalize(() => {
      this.utils.hidePulseLoader();
      if (fn) {
        fn();
      }
    })).subscribe(response => {
      const hasTransactionFailed = response
        .some(transaction => transaction.status === ESTTransactionStatus.FAILED);

      if (hasTransactionFailed) {
        this.stCommonTransaction.modalFailedTransactions({
          transactionResponseList: response,
        });
      }

      this.dynamicMessage$.next('signature_tracking:delete_transaction');

      this.isLoading = false;
    });
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

    const messageModal = isManageSingleTransaction ? 'signature-tracking:delete_account' : 'signature-tracking:delete_accounts';
    modal.componentInstance.data = this.stBuildUpdateBodyRequest.buildUpdateAlert(messageModal);

    modal.result.then(isResult => {
      if (!isResult) return;

      if (isManageSingleTransaction) {
        this.mangeDeleteSingleTransaction(startupParameters);
        return;
      }

      this.isLoading = true;
      this.deleteMultiple(startupParameters);

    }).catch(error => error);
  }

  private executeDeleteTransaction(transactionList: ITMTransaction[]) {
    return transactionList.map((transaction) => this.signatureTrackingService.delete({
      transactionCode: transaction.reference,
      signatureType: this.userInfo?.signatureType,
      transactionStatus: ETransactionStatus.ENTERED
    }).pipe(
      map(() => this.stCommonTransaction.buildTransactionDetailResponse(transaction)),
      catchError((error: HttpErrorResponse) => of(this.stCommonTransaction.buildTransactionDetailResponse(transaction, error)))
    ));
  }
}
