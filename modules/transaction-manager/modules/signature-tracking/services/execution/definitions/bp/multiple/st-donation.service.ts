import { Injectable } from '@angular/core';
import { catchError, concatMap, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { ERequestTypeTransaction } from '../../../../../../../../../enums/transaction-header.enum';
import {
  SplitTransactionDetailService
} from '../../../../../../../services/manager/bp/split-transaction-detail.service';
import {
  DonationService
} from '../../../../../../../../transfer/modules/donation/services/transaction/donation.service';
import {
  ParameterManagementService
} from '../../../../../../../../../service/navegation-parameters/parameter-management.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from '../../../../../../../../../service/common/util.service';
import { BankingAuthenticationService } from '@adf/security';
import { StProcessHandlerService } from '../../../utils/st-process-handler.service';
import { HandleTokenRequestService } from '../../../../../../../../../service/common/handle-token-request.service';
import { StCommonTransactionService } from '../../../st-common-transaction.service';
import { ITMTransaction } from '../../../../../../../interfaces/tm-transaction.interface';
import { ModalTokenComponent } from '../../../../../../../../../view/private/token/modal-token/modal-token.component';
import { environment } from '../../../../../../../../../../environments/environment';
import {
  IExecuteTransactionWithTokenFailedResponse
} from '../../../../../../../../../models/token-service-response.interface';
import { ISTProcessWithToken } from '../../../../../interfaces/st-service.interface';
import { IUserInfo } from '../../../../../../../../../models/user-info.interface';
import {
  ISTProcessExecuteMultipleDonationParameters,
  ISTProcessMultipleDonationParameters
} from '../../../../../interfaces/st-process-multiple.interface';
import {
  DonationExecuteBySignatureTrackingBuilder
} from '../../../../../../../../transfer/modules/donation/interfaces/donation-execute.interface';
import {
  TTransactionDonationResponse
} from '../../../../../../../../transfer/modules/donation/interfaces/donation-execution.interface';
import { HttpStatusCode } from '../../../../../../../../../enums/http-status-code.enum';
import { TDonationProcessResponse } from '../../../../../interfaces/st-operations.interface';
import { ISignatureTrackingMessageOutput } from '../../../../../interfaces/signature-tracking.interface';
import { ESTTransactionStatus } from '../../../../../enum/st-common.enum';
import { ESignatureTrackingTypeAction, ETabPosition } from '../../../../../enum/st-transaction-status.enum';



@Injectable({
  providedIn: 'root'
})
export class DonationProcessService {
  private signatureType: string = '';
  private isTokenRequired = false;
  private tokenValue: string | null = null;
  private isMultipleTransactions: boolean = false;
  private typeTransaction = ERequestTypeTransaction.DONATIONS_TRANSFER;

  constructor(
    private splitTransaction: SplitTransactionDetailService,
    private donationTransaction: DonationService,
    private parameterManager: ParameterManagementService,
    private modalService: NgbModal,
    private utils: UtilService,
    private bankingService: BankingAuthenticationService,
    private stProcessService: StProcessHandlerService,
    private handleTokenRequestService: HandleTokenRequestService,
    private stCommonService: StCommonTransactionService,
  ) {
    this.resetState();
  }

  getHasTokenRequired(serviceCode: string) {
    return this.handleTokenRequestService.isTokenRequired(serviceCode);
  }

  private resetState() {
    this.signatureType = '';
    this.tokenValue = null;
    this.isTokenRequired = false;
  }

  processSingleDonationHandler(serviceCode: string) {
    if (this.getHasTokenRequired(serviceCode)) {
      this.openTokenModal();
      return;
    }

    this.processTransactionHandler();
  }

  executeMultipleProcess(transactionSelected: ITMTransaction, signatureType: string) {
    this.isMultipleTransactions = true;
    this.signatureType = signatureType;

    return this.manageExecuteProcess({
      transactionSelected,
      transactionDetail: this.splitTransaction.getTransactionDetailForSampleTransactions(transactionSelected?.request),
    });
  }

  /* ====================== PROCESS SINGLE TRANSACTION - WITH TOKEN  =========================*/

  private openTokenModal() {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} sm-600`,
      size: 'lg',
    });


    modal.componentInstance.typeTransaction = ERequestTypeTransaction.DONATIONS_TRANSFER;
    modal.componentInstance.executeService = this.manageExecuteProcessWithToken.bind(this);

    modal.result.then(result => {
      this.manageProcessSingleTransactionTypeResponse(result);
    }).catch(error => error);
  }

  private manageExecuteProcessWithToken(tokenValue?: string) {
    this.utils.showLoader();

    const userInfo = this.parameterManager.getParameter('userInfo');
    const donationState = this.parameterManager.getParameter('navigateStateParameters');

    const transactionSelected: ITMTransaction = donationState?.transactionSelected;
    this.signatureType = userInfo.signatureType;
    this.tokenValue = tokenValue as string;
    this.isTokenRequired = this.getHasTokenRequired(transactionSelected?.serviceCode);

    return this.executeProcessWithToken()
      .pipe(
        map(() => ({ status: 200, data: null} as IExecuteTransactionWithTokenFailedResponse)),
        catchError((error: HttpErrorResponse) => of(this.stCommonService.handleParserErrorProcessWithTokenResponse(error)))
      )
  }

  private executeProcessWithToken() {
    const { transactionSelected } = this.parameterManager.getParameter('navigateStateParameters');

    const bodyRequest: ISTProcessWithToken = {
      isTokenRequired: this.isTokenRequired,
      tokenValue: this.tokenValue as string,
      typeTransaction: this.typeTransaction,
      bodyRequest: {
        signatureType: this.signatureType,
        transactionCode: transactionSelected?.reference,
      },
      serviceCode: transactionSelected.serviceCode,
    }

    return this.stProcessService.processTransactionWithToken(bodyRequest)
      .pipe(
        concatMap((response) => this.executeNotification({
          transactionSelected,
          transactionDetail: this.splitTransaction.getTransactionDetailForSampleTransactions(transactionSelected?.request),
          processTransactionResponse: response,
        }))
      );
  }


  /* ====================== PROCESS SINGLE TRANSACTION - WITH TOKEN =========================*/


  /* ====================== PROCESS SINGLE TRANSACTION - WITHOUT TOKEN =========================*/

  private processTransactionHandler() {
    const transactionState = this.parameterManager.getParameter('navigateStateParameters');
    const userInfo: IUserInfo = this.parameterManager.getParameter('userInfo');
    const { transactionSelected } = transactionState ?? {};
    const { signatureType } = userInfo ?? {};

    this.utils.showLoader();
    this.executeProcessSingleTransaction(transactionSelected, signatureType)
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

  private executeProcessSingleTransaction(transactionSelected: ITMTransaction, signatureType: string) {
    this.signatureType = signatureType;

    return this.manageExecuteProcess({
      transactionSelected,
      transactionDetail: this.splitTransaction.getTransactionDetailForSampleTransactions(transactionSelected?.request),
    });
  }

  private manageExecuteProcess(parameters: ISTProcessMultipleDonationParameters) {
    return this.stProcessService.processTransactionWithoutToken({
      signatureType: this.signatureType,
      transactionCode: parameters?.transactionSelected?.reference,
    }, this.isMultipleTransactions)
      .pipe(
        concatMap((response) => this.executeNotification({
          ...parameters,
          processTransactionResponse: response,
        }))
      );
  }


  /* ====================== PROCESS SINGLE TRANSACTION - WITHOUT TOKEN =========================*/


  private executeNotification(parameters: ISTProcessExecuteMultipleDonationParameters) {
    const { transactionSelected, transactionDetail, processTransactionResponse } = parameters ?? {};

    const requestBody = new DonationExecuteBySignatureTrackingBuilder()
      .reference(processTransactionResponse?.reference)
      .dateTime(processTransactionResponse?.dateTime)
      .sourceAccount(`${this.bankingService.encrypt(transactionDetail?.accountOrigin)}`)
      .sourceCurrency(transactionSelected?.currency)
      .sourceAmount(this.utils.parseAmountStringToNumber(transactionSelected?.amount))
      .build();

    return this.donationTransaction.donationTransferBySignatureTracking(requestBody);
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
      action: ESignatureTrackingTypeAction.AUTHORIZE,
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
      action: ESignatureTrackingTypeAction.AUTHORIZE,
      data: null,
      message: result?.message ?? 'error:signature_tracking_process',
    };

    this.stCommonService.handleResponseProcessOperation({
      outPutResponse: propertiesToTransferFlow,
    });
  }
}
