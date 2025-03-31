import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { concatMap, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, map } from 'rxjs/operators';
import { ERequestTypeTransaction } from 'src/app/enums/transaction-header.enum';
import {
  ThirdPartyLoansService
} from '../../../../../../../../loan/modules/third-party-loans/services/transaction/third-party-loans.service';
import { StProcessHandlerService } from '../../../utils/st-process-handler.service';
import { UtilService } from '../../../../../../../../../service/common/util.service';
import {
  ParameterManagementService
} from '../../../../../../../../../service/navegation-parameters/parameter-management.service';
import { StCommonTransactionService } from '../../../st-common-transaction.service';
import {
  SplitTransactionDetailService
} from '../../../../../../../services/manager/bp/split-transaction-detail.service';
import { HandleTokenRequestService } from '../../../../../../../../../service/common/handle-token-request.service';
import { ITMTransaction } from '../../../../../../../interfaces/tm-transaction.interface';
import { ModalTokenComponent } from '../../../../../../../../../view/private/token/modal-token/modal-token.component';
import { environment } from '../../../../../../../../../../environments/environment';
import { HttpStatusCode } from '../../../../../../../../../enums/http-status-code.enum';
import {
  IExecuteTransactionWithTokenFailedResponse
} from '../../../../../../../../../models/token-service-response.interface';
import { ISTProcessWithToken } from '../../../../../interfaces/st-service.interface';
import { IUserInfo } from '../../../../../../../../../models/user-info.interface';
import { ISTProcessTPLPaymentParameters } from '../../../../../interfaces/st-process-multiple.interface';
import {
  ISTTPLPaymentNotificationBodyRequest
} from '../../../../../../../../loan/modules/third-party-loans/interfaces/st-tpl-payment.interface';
import { TProcessOperationResponse } from '../../../../../interfaces/st-operations.interface';
import { ESTTransactionStatus } from '../../../../../enum/st-common.enum';
import { ESignatureTrackingTypeAction, ETabPosition } from '../../../../../enum/st-transaction-status.enum';


@Injectable({
  providedIn: 'root'
})
export class StTplPaymentService {
  private signatureType: string = '';
  private isTokenRequired = false;
  private tokenValue: string | null = null;
  private isMultipleTransactions: boolean = false;
  private typeTransaction = ERequestTypeTransaction.THIRD_LOAN_PAYMENT;

  constructor(
    private thirdPartyLoansService: ThirdPartyLoansService,
    private stProcessService: StProcessHandlerService,
    private utils: UtilService,
    private parameterManager: ParameterManagementService,
    private modalService: NgbModal,
    private stCommonService: StCommonTransactionService,
    private splitTransaction: SplitTransactionDetailService,
    private handleTokenRequestService: HandleTokenRequestService,
  ) {
    this.resetState();
  }

  getHasTokenRequired(serviceCode: string) {
    return this.handleTokenRequestService.isTokenRequired(serviceCode);
  }

  executeProcess(serviceCode: string) {
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
      transactionDetail: this.splitTransaction.getTransactionDetailForThirdPartyPaymentLoan(transactionSelected.request),
    })
  }

  /* ====================== PROCESS SINGLE TRANSACTION - WITH TOKEN  =========================*/

  private openTokenModal() {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} sm-600`,
      size: 'lg',
    });

    modal.componentInstance.typeTransaction = ERequestTypeTransaction.THIRD_LOAN_PAYMENT;
    modal.componentInstance.executeService = this.manageExecuteProcessWithToken.bind(this);

    modal.result.then(result => {
      this.mangeProcessSingleTransactionTypeResponse(result);
    }).catch(error => error);
  }

  private manageExecuteProcessWithToken(tokenValue?: string) {
    this.utils.showLoader();

    const userInfo = this.parameterManager.getParameter('userInfo');
    const paymentState = this.parameterManager.getParameter('navigateStateParameters');

    const transactionSelected: ITMTransaction = paymentState?.transactionSelected;

    this.signatureType = userInfo?.signatureType as string;
    this.tokenValue = tokenValue as string;
    this.isTokenRequired = this.getHasTokenRequired(transactionSelected?.serviceCode);

    return this.executeProcessWithToken()
      .pipe(
        map(() => ({ status: HttpStatusCode.SUCCESS_TRANSACTION, data: null} as IExecuteTransactionWithTokenFailedResponse)),
        catchError((error) => of(this.stCommonService.handleParserErrorProcessWithTokenResponse(error)))
      );
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
      serviceCode: transactionSelected?.serviceCode,
    };

    return this.stProcessService.processTransactionWithToken(bodyRequest)
      .pipe(
        concatMap(() => this.executeNotification({
          transactionSelected,
          transactionDetail: this.splitTransaction.getTransactionDetailForThirdPartyPaymentLoan(transactionSelected.request),
        }))
      );
  }

  /* ====================== PROCESS SINGLE TRANSACTION - WITH TOKEN  =========================*/

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
          this.handleSuccessProcessResponse();
        },
        error: (error: HttpErrorResponse) => {
          const message = error?.error?.message ?? 'error:signature_tracking_process';

          this.handleErrorProcessResponse({
            status: error?.status,
            message,
            data: null,
          });
        },
      });
  }

  private executeProcessSingleTransaction(transactionSelected: ITMTransaction, signatureType: string) {
    this.signatureType = signatureType;

    return this.manageExecuteProcess({
      transactionSelected,
      transactionDetail: this.splitTransaction.getTransactionDetailForThirdPartyPaymentLoan(transactionSelected.request),
    });
  }

  private manageExecuteProcess(parameters: ISTProcessTPLPaymentParameters) {
    return this.stProcessService.processTransactionWithoutToken({
      signatureType: this.signatureType,
      transactionCode: parameters.transactionSelected.reference,
    }, this.isMultipleTransactions)
      .pipe(
        concatMap(() => this.executeNotification(parameters))
      );
  }

  /* ====================== PROCESS SINGLE TRANSACTION - WITHOUT TOKEN =========================*/

  private executeNotification(parameters: ISTProcessTPLPaymentParameters) {
    const { transactionSelected, transactionDetail } = parameters;
    const email = String(transactionDetail.email).trim() + String(transactionDetail.email2).trim();

    const bodyRequest: ISTTPLPaymentNotificationBodyRequest = {
      reference: transactionSelected.reference,
      amount: this.utils.parseAmountStringToNumber(transactionDetail.sourceAmount),
      currency: this.utils.getISOCurrency(String(transactionDetail.sourceCurrency).trim()),
      email,
      identifier: String(transactionDetail.targetAccount).trim(),
    }

    if (!email) return of(transactionSelected);

    return this.thirdPartyLoansService.notification(bodyRequest);
  }

  private mangeProcessSingleTransactionTypeResponse(result: TProcessOperationResponse) {
    if (!result) return;

    if (result.status !== HttpStatusCode.SUCCESS_TRANSACTION) {
      this.handleErrorProcessResponse(result);
      return;
    }

    this.handleSuccessProcessResponse();
  }

  private handleSuccessProcessResponse() {
    this.stCommonService.handleResponseProcessOperation({
      outPutResponse: {
        status: ESTTransactionStatus.SUCCESS,
        position: ETabPosition.AUTHORIZED,
        action: ESignatureTrackingTypeAction.AUTHORIZE,
        data: null,
        message: '',
      },
    });
  }

  private handleErrorProcessResponse(result: TProcessOperationResponse) {

    this.stCommonService.handleResponseProcessOperation({
      outPutResponse: {
        status: ESTTransactionStatus.FAILED,
        position: ETabPosition.AUTHORIZED,
        action: ESignatureTrackingTypeAction.AUTHORIZE,
        data: null,
        message: result?.message as string,
      },
    });
  }

  private resetState() {
    this.signatureType = '';
    this.tokenValue = null;
    this.isTokenRequired = false;
  }
}
