import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, concatMap, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin, of, throwError } from 'rxjs';
import { BankingAuthenticationService } from '@adf/security';
import { TranslateService } from '@ngx-translate/core';
import { ERequestTypeTransaction } from '../../../../../../../../../enums/transaction-header.enum';
import {
  TransferThirdService
} from '../../../../../../../../transfer/modules/transfer-third/services/transaction/transfer-third.service';
import {
  ParameterManagementService
} from '../../../../../../../../../service/navegation-parameters/parameter-management.service';
import { UtilService } from '../../../../../../../../../service/common/util.service';
import { StProcessHandlerService } from '../../../utils/st-process-handler.service';
import { HandleTokenRequestService } from '../../../../../../../../../service/common/handle-token-request.service';
import { StCommonTransactionService } from '../../../st-common-transaction.service';
import {
  SplitTransactionDetailService
} from '../../../../../../../services/manager/bp/split-transaction-detail.service';
import { TransactionManagerService } from '../../../../../../../services/transaction-manager.service';
import { ModalTokenComponent } from '../../../../../../../../../view/private/token/modal-token/modal-token.component';
import { environment } from '../../../../../../../../../../environments/environment';
import { ITMTransaction } from '../../../../../../../interfaces/tm-transaction.interface';
import {
  IExecuteTransactionWithTokenFailedResponse
} from '../../../../../../../../../models/token-service-response.interface';
import { IUserInfo } from '../../../../../../../../../models/user-info.interface';
import { ISTProcessWithToken } from '../../../../../interfaces/st-service.interface';
import {
  ISTThirdPartyTransferProcess
} from '../../../../../../../../transfer/modules/transfer-third/interfaces/third-transfer-service';
import {
  TTransactionDonationResponse
} from '../../../../../../../../transfer/modules/donation/interfaces/donation-execution.interface';
import { HttpStatusCode } from '../../../../../../../../../enums/http-status-code.enum';
import { TDonationProcessResponse } from '../../../../../interfaces/st-operations.interface';
import { ISignatureTrackingMessageOutput } from '../../../../../interfaces/signature-tracking.interface';
import { ESTTransactionStatus } from '../../../../../enum/st-common.enum';
import { ESignatureTrackingTypeAction, ETabPosition } from '../../../../../enum/st-transaction-status.enum';
import { ITransactionManagerAccountDetail } from '../../../../../../../interfaces/transaction-manger.interface';
import { FlowErrorBuilder } from '../../../../../../../../../models/error.interface';


@Injectable({
  providedIn: 'root'
})
export class StThirdPartyTransferService {
  private isTokenRequired = false;
  private tokenValue: string | null = null;
  private isMultipleTransactions: boolean = false;
  private typeTransaction = ERequestTypeTransaction.THIRD_PARTY_TRANSFER;

  constructor(
    private thirdPartyTransaction: TransferThirdService,
    private parameterManager: ParameterManagementService,
    private modalService: NgbModal,
    private utils: UtilService,
    private stProcessService: StProcessHandlerService,
    private handleTokenRequestService: HandleTokenRequestService,
    private stCommonService: StCommonTransactionService,
    private bankingService: BankingAuthenticationService,
    private splitTransactionDetail: SplitTransactionDetailService,
    private transactionManager: TransactionManagerService,
    private translate: TranslateService,
  ) {
    this.resetState();
  }

  private getHasTokenRequired(serviceCode: string) {
    return this.handleTokenRequestService.isTokenRequired(serviceCode);
  }

  private resetState() {
    this.tokenValue = null;
    this.isTokenRequired = false;
  }

  executeSingleTransaction(serviceCode: string) {
    // NOTE: [BISV - Firmas Multiple 17/04/2024]: se remueve uso de método token para procesar, al moverlo al authorizar
    if (this.getHasTokenRequired(serviceCode)) {
      this.openTokenModal();
      return;
    }

    this.processTransactionHandler();
  }


  /* ====================== PROCESS SINGLE TRANSACTION - WITH TOKEN  =========================*/

  private openTokenModal() {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} sm-600`,
      size: 'lg',
    });


    modal.componentInstance.typeTransaction = ERequestTypeTransaction.THIRD_PARTY_TRANSFER;
    modal.componentInstance.executeService = this.manageExecuteProcessWithToken.bind(this);

    modal.result.then(result => {
      this.manageProcessSingleTransactionTypeResponse(result);
    }).catch(error => error);
  }

  private manageExecuteProcessWithToken(tokenValue?: string) {
    this.utils.showLoader();

    const thirdPartyTransferState = this.parameterManager.getParameter('navigateStateParameters');
    const transactionSelected: ITMTransaction = thirdPartyTransferState?.transactionSelected;

    this.tokenValue = tokenValue as string;
    this.isTokenRequired = this.getHasTokenRequired(transactionSelected?.serviceCode);

    return this.executeProcessWithToken()
      .pipe(
        map(() => ({ status: 200, data: null} as IExecuteTransactionWithTokenFailedResponse)),
        catchError((error: HttpErrorResponse) => of(this.stCommonService.handleParserErrorProcessWithTokenResponse(error)))
      )
  }

  private executeProcessWithToken() {
    const {
      transactionSelected,
      sourceAccount,
      targetAccount
    } = this.parameterManager.getParameter('navigateStateParameters');
    const userInfo: IUserInfo = this.parameterManager.getParameter('userInfo');

    const bodyRequest: ISTProcessWithToken = {
      isTokenRequired: this.isTokenRequired,
      tokenValue: this.tokenValue as string,
      typeTransaction: this.typeTransaction,
      bodyRequest: {
        signatureType: userInfo.signatureType,
        transactionCode: transactionSelected?.reference,
      },
      serviceCode: transactionSelected.serviceCode,
    }

    return this.stProcessService.processTransactionWithToken(bodyRequest)
      .pipe(
        concatMap(() => this.executeNotification({
          transactionSelected,
          transactionDetail: this.splitTransactionDetail.getTransactionDetailForSampleTransactions(transactionSelected?.request),
          targetAccountName: sourceAccount.name,
          sourceAccountName: targetAccount.name,
          signatureType: userInfo?.signatureType,
        }))
      );
  }


  /* ====================== PROCESS SINGLE TRANSACTION - WITH TOKEN =========================*/


  /* ====================== PROCESS SINGLE TRANSACTION - WITHOUT TOKEN =========================*/

  private processTransactionHandler() {
    const transactionState = this.parameterManager.getParameter('navigateStateParameters');
    const userInfo: IUserInfo = this.parameterManager.getParameter('userInfo');
    const { transactionSelected, sourceAccount, targetAccount } = transactionState ?? {};
    const { signatureType } = userInfo ?? {};

    this.utils.showLoader();
    this.executeProcessSingleTransaction({
      transactionSelected,
      signatureType,
      sourceAccountName: sourceAccount.name,
      targetAccountName: targetAccount.name,
      })
      .subscribe({
        next: () => {
          this.handleSuccessProcessResponse(null)
        },
        error: (error: HttpErrorResponse) => {
          const message = error?.error?.message ?? 'error:signature_tracking_process';

          this.handleErrorProcessResponse({
            data: null,
            message,
            status: error?.error?.status,
          });
        }
      })
  }

  private executeProcessSingleTransaction(parameters: ISTThirdPartyTransferProcess) {
    const { transactionSelected} = parameters;

    return this.manageExecuteProcess({
      ...parameters,
      transactionDetail: this.splitTransactionDetail.getTransactionDetailForSampleTransactions(transactionSelected?.request),
    });
  }

  private manageExecuteProcess(parameters: ISTThirdPartyTransferProcess) {
    const userInfo: IUserInfo = this.parameterManager.getParameter('userInfo');

    return this.stProcessService.processTransactionWithoutToken({
        signatureType: userInfo.signatureType,
        transactionCode: parameters?.transactionSelected?.reference,
      }, this.isMultipleTransactions)
      .pipe(
        concatMap(() => this.executeNotification({
          ...parameters,
        }))
      );
  }


  /* ====================== PROCESS SINGLE TRANSACTION - WITHOUT TOKEN =========================*/


  private executeNotification(parameters: ISTThirdPartyTransferProcess) {
    const {
      transactionSelected,
      transactionDetail,
      sourceAccountName,
      targetAccountName
    } = parameters ?? {};


    if (!transactionDetail?.email) return of(transactionSelected);

    return this.thirdPartyTransaction.notify({
      amount: transactionDetail.amountOrigin,
      reference: transactionSelected.reference,
      sourceAccount: this.bankingService.encrypt(transactionDetail?.accountOrigin ?? '') as string,
      targetAccount: this.bankingService.encrypt(transactionDetail?.accountTarget ?? '') as string,
      sourceAccountName,
      targetAccountName,
      email: transactionDetail.email,
    });
  }


  /*   ================================ HANDLER's RESPONSE PROCESS OPERATION ===================================  */

  private manageProcessSingleTransactionTypeResponse(result: TTransactionDonationResponse) {
    if (!result) { return; }

    if (result?.status !== HttpStatusCode.SUCCESS_TRANSACTION) {
      this.handleErrorProcessResponse(result);
      return;
    }

    this.handleSuccessProcessResponse(result);
  }

  private handleSuccessProcessResponse(result: TDonationProcessResponse) {
    const propertiesToTransferFlowSuccess: ISignatureTrackingMessageOutput = {
      message: result?.message ?? '',
      status: ESTTransactionStatus.SUCCESS,
      position: ETabPosition.AUTHORIZED,
      action: ESignatureTrackingTypeAction.PROCESS,
      data: result?.data ?? null,
    };

    this.stCommonService.handleResponseProcessOperation({
      outPutResponse: propertiesToTransferFlowSuccess,
    });
  }

  private handleErrorProcessResponse(result: TDonationProcessResponse) {
    const propertiesToTransferFlow: ISignatureTrackingMessageOutput = {
      status: ESTTransactionStatus.FAILED,
      position: ETabPosition.AUTHORIZED,
      action: ESignatureTrackingTypeAction.PROCESS,
      data: null,
      message: result?.message ?? 'error:signature_tracking_process',
    };

    this.stCommonService.handleResponseProcessOperation({
      outPutResponse: propertiesToTransferFlow,
    });
  }

  executeMultiple(transactionSelected: ITMTransaction) {
    const userInfo: IUserInfo = this.parameterManager.getParameter('userInfo');

    return this.getAccountsToDetail(transactionSelected)
      .pipe(
        concatMap((response) => {
          const [sourceAccount, targetAccount] = response;

          if (sourceAccount.hasOwnProperty('error') || targetAccount.hasOwnProperty('error')) {
            return this.handleErrorToGetSourceAndTargetAccount();
          }

          const sourceAccountResponse = sourceAccount as ITransactionManagerAccountDetail;
          const targetAccountResponse = targetAccount as ITransactionManagerAccountDetail;

          return this.manageExecuteProcess({
            sourceAccountName: sourceAccountResponse.name,
            targetAccountName: targetAccountResponse.name,
            transactionSelected,
            signatureType: userInfo.signatureType,
            transactionDetail: this.splitTransactionDetail.getTransactionDetailForSampleTransactions(transactionSelected?.request.trimStart()),
          })
        })
      );
  }

  private handleErrorToGetSourceAndTargetAccount() {
    const message = this.translate.instant('error:massive_transference_limit');

    return throwError(() => ({
      error: {
        message,
      },
      status: 400,
      statusText: message,
    }));
  }

  private getAccountsToDetail(transactionSelected: ITMTransaction) {
    const data = this.splitTransactionDetail.getTransactionDetailForSampleTransactions(transactionSelected?.request.trimStart());

    return forkJoin(
      [data?.accountOrigin, data?.accountTarget]
        .map((acc) => this.transactionManager.getAccountDetail(acc)
          .pipe(
            catchError((error: HttpErrorResponse) => of(new FlowErrorBuilder()
              .error(error?.error)
              .message(error?.error?.message)
              .status(error?.status)
              .build()
          ))
        ))
    );
  }
}
