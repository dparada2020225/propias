import { Injectable } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { TmCommonService } from '../../../../../services/tm-common.service';
import { StCommonTransactionService } from '../st-common-transaction.service';
import { finalize } from 'rxjs/operators';
import { IAchAccount } from '../../../../../../transfer/modules/transfer-ach/interfaces/ach-account-interface';
import { IACHSettings } from '../../../../../../transfer/modules/transfer-ach/interfaces/settings.interface';
import {
  ISTProcessOperationStartupParameters
} from '../../../interfaces/st-operations.interface';
import { ITMTransaction } from '../../../../../interfaces/tm-transaction.interface';
import { ESignatureTrackingTypeAction } from '../../../enum/st-transaction-status.enum';
import { ITMServiceDetailAccountOperation } from '../../../../../interfaces/transaction-manager-navigate.interface';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { HttpStatusCode } from '../../../../../../../enums/http-status-code.enum';
import { AdfAlertModalComponent, AlertAttributeBuilder, AlertBuilder } from '@adf/components';
import { environment } from '../../../../../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from '../../../../../../../service/common/util.service';
import { TPaymentOfPayrollManageFinalizeRequest } from '../../../interfaces/st-process.interface';
import { ESTTransactionStatus } from '../../../enum/st-common.enum';
import { ISignatureTrackingServiceResponse } from '../../../interfaces/signature-tracking.interface';
import { IUserInfo } from '../../../../../../../models/user-info.interface';
import { TmOperationsService } from '../../../../../services/handlers/tm-operations.service';
import { StProcessMultipleCoreService } from '../core/st-process-multiple-core.service';
import { StProcessMultipleBpService } from '../core/bp/st-process-multiple-bp.service';


@Injectable({
  providedIn: 'root'
})
export class StProcessService {
  private isLoading = true;
  private staticMessage: string | null = null;
  private dynamicMessage$: Subject<string> = new Subject();
  private userInfo: IUserInfo = this.persistStepStateService.getParameter('userInfo');
  private associatedAccounts: IAchAccount[] = [];
  private achSettings: IACHSettings[] = [];
  private handlerFinalizeExecuteProcess: TPaymentOfPayrollManageFinalizeRequest | undefined = undefined;
  private associatedAccountsMap!: Map<string, IAchAccount>

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
    private persistStepStateService: ParameterManagementService,
    private modalService: NgbModal,
    private stProcessMultipleTransactionManager: StProcessMultipleCoreService,
    private stBPProcessMultiple: StProcessMultipleBpService,
    private utils: UtilService,
  ) { }

  process(startupParameters: ISTProcessOperationStartupParameters) {
    const {
      transactionList,
      currentTabPosition,
      servicesSupported,
      associatedAccounts,
      achSettings,
      associatedAccountsMap,
      fn } = startupParameters ?? {};

    this.associatedAccounts = associatedAccounts;
    this.achSettings = achSettings;
    this.handlerFinalizeExecuteProcess = fn;
    this.associatedAccountsMap = associatedAccountsMap;
    this.staticMessage = null;

    if (transactionList.length <= 0) {
      this.isLoading = false;
      this.staticMessage = 'process_empty_selected';
      return;
    }


    if (transactionList.length > 1) {
      return this.processMultiple(startupParameters);
    }

    const transactionToProcess = transactionList[0];
    const isSupportedTransaction = this.transactionManagerCommon.isSupportedTransaction(servicesSupported, transactionToProcess);

    if (!isSupportedTransaction) {
      this.utils.showLoader();
      this.isLoading = false;
      this.staticMessage = null;

      this.transactionManagerCommon.handleNavigateToEmbbededBanking({
        tabPosition: this.stCommonTransaction.getCurrentStep(currentTabPosition),
        action: ESignatureTrackingTypeAction.PROCESS,
        reference: transactionToProcess?.reference,
        service: transactionToProcess?.serviceCode
      });
      return;
    }

    const parameter: ITMServiceDetailAccountOperation = {
      transactionSelected: transactionToProcess,
      action: ESignatureTrackingTypeAction.PROCESS,
      position: currentTabPosition,
    };

    this.navigateOperationManager.manageOperationTransferNavigation(parameter, this.associatedAccounts);
  }

  private processMultiple(startupParameters: ISTProcessOperationStartupParameters) {
    const { transactionList } = startupParameters ?? {};

    this.utils.showPulseLoader();

    const request = forkJoin(this.executeProcessMultiple(transactionList));

    request.pipe(finalize(() => this.manageFinalizeExecuteProcess()))
    .subscribe({
      next: (response) => {
        this.handleExecuteProcessResponse(response as any);
      },
    });
  }

  private handleErrorPaymentOfPayroll(response: ISignatureTrackingServiceResponse[]) {
    const transactionFailedToExecute = response
      .filter(transaction => transaction?.statusCode === HttpStatusCode.PROCESS_PAYMENT_OF_PAYROLL);

    this.openModalControlledErrorForProcessPaymentOfPayroll(transactionFailedToExecute);
  }

  private openModalControlledErrorForProcessPaymentOfPayroll(transactionResponse: ISignatureTrackingServiceResponse[]) {
    const errorMessage = transactionResponse[0]?.errorDetail;

    const modal = this.modalService.open(AdfAlertModalComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} alert-modal`,
      size: `lg`,
    });

    modal.componentInstance.data = this.alertForErrorProcessPaymentOfPayroll(errorMessage);

    modal.result.then((isConfirm) => {
      if (!isConfirm) { return; }

      this.manageRetryProcessPaymentOfPayroll(transactionResponse);
    }).catch(error => error);

  }

  private manageRetryProcessPaymentOfPayroll(transactionResponse: ISignatureTrackingServiceResponse[]) {
    this.utils.showPulseLoader();

    const transactionList = this.stCommonTransaction.parseTransactionFromResponseToTransaction(transactionResponse);
    const transaction = this.stBPProcessMultiple.executeRetryPaymentOfPayroll({
      transactions: transactionList,
      signatureType: this.userInfo?.signatureType,
    });

    forkJoin(transaction)
      .pipe(finalize(() => this.manageFinalizeExecuteProcess()))
      .subscribe({
        next: (response) => {
          this.handleExecuteProcessResponse(response as any);
        },
      })
  }

  private getResponseTransactionStatus(response: ISignatureTrackingServiceResponse[]) {
    const hasTransactionFailed = response.some(transaction => transaction?.status === ESTTransactionStatus.FAILED);
    const controlledErrorProcessPaymentOfPayroll = response
      .some(transaction => transaction?.statusCode === HttpStatusCode.PROCESS_PAYMENT_OF_PAYROLL);

    return {
      hasFailedTransactions: hasTransactionFailed,
      isErroInPaymentOfPayrollTransaction: controlledErrorProcessPaymentOfPayroll,
    }
  }

  private handleExecuteProcessResponse(response: ISignatureTrackingServiceResponse[]) {
    const { hasFailedTransactions, isErroInPaymentOfPayrollTransaction } = this.getResponseTransactionStatus(response);

    if (hasFailedTransactions) {
      this.stCommonTransaction.modalFailedTransactions({
        transactionResponseList: response,
        fn: this.handleErrorPaymentOfPayroll.bind(this)
      });
    }

    if  (isErroInPaymentOfPayrollTransaction && !hasFailedTransactions) {
      this.handleErrorPaymentOfPayroll(response);
    }

    this.isLoading = false;
  }

  private manageFinalizeExecuteProcess() {
    this.utils.hidePulseLoader();

    if (this.handlerFinalizeExecuteProcess) {
      this.handlerFinalizeExecuteProcess();
    }
  }

  private executeProcessMultiple(transactionList: ITMTransaction[]) {
    const userInfo: IUserInfo = this.persistStepStateService.getParameter('userInfo');

    return this.stProcessMultipleTransactionManager.executeProcessMultiple({
      signatureType: userInfo.signatureType,
      achSettings: this.achSettings,
      achAssociatedAccounts: this.associatedAccounts,
      transactionList,
      achAssociatedAccountsMap: this.associatedAccountsMap,
    });
  }


  private alertForErrorProcessPaymentOfPayroll(errorMessage?: string) {
    const iconAlertAttribute = new AlertAttributeBuilder()
      .label('banca-regional-warning')
      .build();

    const titleAlertAttribute = new AlertAttributeBuilder()
      .label('alert-title')
      .build();

    const messageAlertAttribute = new AlertAttributeBuilder()
      .label(errorMessage ?? 'not-found:message')
      .build();

    const nextButtonAlertAttribute = new AlertAttributeBuilder()
      .label('t.confirm')
      .build();

    const prevButtonAlertAttribute = new AlertAttributeBuilder()
      .label('btn.cancel')
      .build();

    return new AlertBuilder()
      .icon(iconAlertAttribute)
      .title(titleAlertAttribute)
      .message(messageAlertAttribute)
      .nextButtonMessage(nextButtonAlertAttribute)
      .cancelButtonMessage(prevButtonAlertAttribute)
      .build();
  }
}
