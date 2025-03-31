import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ITMTransaction, TMTransactionBuilder } from '../../../../interfaces/tm-transaction.interface';
import { HttpStatusCode } from '../../../../../../enums/http-status-code.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from '../../../../../../service/common/util.service';
import { TranslateService } from '@ngx-translate/core';
import { StdTableService } from '../definition/std-table.service';
import { ISendStartupParameters, ISTFailedTransactionModalParameters } from '../../interfaces/st-common.interface';
import { DetailTransactionComponent } from '../../components/detail-transaction/detail-transaction.component';
import { environment } from '../../../../../../../environments/environment';
import {
  ISignatureTrackingServiceResponse,
  SignatureTrackingServiceResponse
} from '../../interfaces/signature-tracking.interface';
import { ETabStep } from '../../enum/st-transaction-status.enum';
import { ESTTransactionStatus, ETransactionStatus } from '../../enum/st-common.enum';
import { ISignatureTrackingParam, ISTSendParametersBodyRequest } from '../../interfaces/st-service.interface';
import {
  ISTManageStepOperationParameters,
  ISTProcessManageResponse
} from '../../interfaces/st-operations.interface';
import { ESignatureTrackingUrlFlow, StNavigateProtectedParameter } from '../../enum/st-navigate-enum';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { Router } from '@angular/router';
import {
  IExecuteTransactionWithToken,
  IExecuteTransactionWithTokenFailedResponse
} from '../../../../../../models/token-service-response.interface';

@Injectable({
  providedIn: 'root'
})
export class StCommonTransactionService {

  constructor(
    private modalService: NgbModal,
    private utils: UtilService,
    private stTableDefinition: StdTableService,
    private translate: TranslateService,
    private parameterManager: ParameterManagementService,
    private router: Router,
  ) { }

  modalFailedTransactions(parameters: ISTFailedTransactionModalParameters) {
    const {
      transactionResponseList,
      fn,
    } = parameters;
    const tableTransactionDetail = this.stTableDefinition.buildTransactionDetailTable(transactionResponseList);

    const modal = this.modalService.open(DetailTransactionComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} modal-detail-table`,
      size: `lg`,
    });

    modal.dismissed.subscribe(() => {
      this.utils.scrollToTop();
    });

    const countSuccessTransaction = transactionResponseList
      .filter(transaction => transaction.status === ESTTransactionStatus.SUCCESS);
    const countFailedTransaction = transactionResponseList
      .filter(transaction => transaction.status === ESTTransactionStatus.FAILED);

    modal.componentInstance.tableStructured = tableTransactionDetail;
    modal.componentInstance.countSuccessTransaction = countSuccessTransaction.length;
    modal.componentInstance.countFailedTransaction = countFailedTransaction.length;

    modal.result.then(() => {
      this.utils.scrollToTop();
      const controlledErrorProcessPaymentOfPayroll = transactionResponseList.some(transaction => transaction?.statusCode === HttpStatusCode.PROCESS_PAYMENT_OF_PAYROLL);

      if (fn && controlledErrorProcessPaymentOfPayroll) {
        fn(transactionResponseList);
      }

    }).catch(error => error);
  }

  buildTransactionDetailResponse(transaction: ITMTransaction, error?: HttpErrorResponse): ISignatureTrackingServiceResponse {
    return new SignatureTrackingServiceResponse()
      .amount(transaction?.amount)
      .currency(transaction?.currency)
      .dateTime(transaction?.dateTime! ?? transaction?.creationDate)
      .errorDetail(this.getMessageError(error))
      .reference(transaction?.reference)
      .serviceDescription(transaction?.serviceDescription)
      .status(this.handleStatusTransaction(error))
      .user(transaction?.creator)
      .request(transaction?.request)
      .serviceCode(transaction?.serviceCode)
      .statusCode(error ? error?.error?.code : null)
      .build();
  }

  /*
* Get transaction response, view @buildTransactionDetailResponse and return
* @return object with model ITMTransaction.
* */
  parseTransactionFromResponseToTransaction(transactionResponse: ISignatureTrackingServiceResponse[]) {
    return transactionResponse.map(attr => (
      new TMTransactionBuilder()
        .reference(attr?.reference)
        .request(attr?.request!)
        .amount(attr?.amount)
        .currency(attr?.currency)
        .dateTime(attr?.dateTime)
        .serviceDescription(attr?.serviceDescription)
        .serviceCode(attr?.serviceCode!)
        .build()
    ));
  }


  buildBodyRequestToSendTransaction(startupParameters: ISendStartupParameters) {
    const { transaction, signatureType, transactionStatus } = startupParameters ?? {};

    return {
      transactionCode: transaction?.reference,
      signatureType,
      transactionStatus,
      amount: this.validateAmountToSend(transaction?.amount),
      currency: this.validateCurrencyToSend(transaction?.currency),
      serviceCode: transaction?.serviceCode,
      reason: transaction?.serviceDescription,
    } as ISTSendParametersBodyRequest
  }

  buildBodyRequestToAllOperations(startupParameters: ISendStartupParameters) {
    const { transaction, signatureType, transactionStatus } = startupParameters ?? {};

    return {
      transactionCode: transaction?.reference,
      signatureType,
      transactionStatus,
    } as ISignatureTrackingParam;
  }

  handleResponseProcessOperation(parameters: ISTProcessManageResponse) {
    const { outPutResponse } = parameters;

    this.parameterManager.sendParameters({
      navigationProtectedParameter: null,
      navigateStateParameters: outPutResponse,
    });

    this.utils.showLoader();
    this.router.navigate([ESignatureTrackingUrlFlow.HOME]).finally(() => this.utils.hideLoader());
  }

  handleParserErrorProcessWithTokenResponse(error: HttpErrorResponse) {
    if ((error?.error && error?.error?.status || error && error?.status) === HttpStatusCode.INVALID_TOKEN) {
      return {
        status: HttpStatusCode.INVALID_TOKEN,
        message: error?.error?.message,
        error: error?.error,
      } as IExecuteTransactionWithTokenFailedResponse;
    }

    if (error?.error?.code === HttpStatusCode.SIGNATURE_TRACKING) {
      return {
        status: HttpStatusCode.SIGNATURE_TRACKING,
        data: null,
        message: error?.error?.message,
      } as IExecuteTransactionWithToken;
    }

    return {
      status: error?.status,
      message: error?.error?.message ?? 'error:process_execute_transaction',
      error: error?.error,
    } as IExecuteTransactionWithTokenFailedResponse;
  }

  getCurrentStep(tabStep: number) {
    const steps = {
      0: ETabStep.ENTERED,
      1: ETabStep.TO_AUTHORIZE,
      2: ETabStep.AUTHORIZED
    };

    return steps[tabStep];
  }

  getCurrentTabPositionFromEmbbeded(step: string) {
    const steps = {
      [ETabStep.ENTERED]: 0,
      [ETabStep.TO_AUTHORIZE]: 1,
      [ETabStep.AUTHORIZED]: 2
    };

    return steps[step];
  }

  getTransactionStatus(position: number) {
    const status = {
      2: ETransactionStatus.AUTHORIZED,
      pending: ETransactionStatus.PENDING,
      1: ETransactionStatus.TO_AUTHORIZE,
      0: ETransactionStatus.ENTERED,
    };

    return status[position];
  }

  private handleStatusTransaction(error: HttpErrorResponse | undefined) {
    if (!error) {
      return ESTTransactionStatus.SUCCESS;
    }

    const errorCode = error?.error?.code;

    const mapSuccessErroCode = {
      [HttpStatusCode.SIGNATURE_TRACKING_AUTHORIZATION]: ESTTransactionStatus.SUCCESS,
      [HttpStatusCode.SIGNATURE_TRACKING_MODIFY_SUCCESS]: ESTTransactionStatus.SUCCESS,
      [HttpStatusCode.PROCESS_PAYMENT_OF_PAYROLL]: ESTTransactionStatus.SUCCESS,
    }

    return mapSuccessErroCode[errorCode] || ESTTransactionStatus.FAILED;
  }

  private getMessageError(error: HttpErrorResponse | undefined) {
    const isInternalServerError = error?.error?.code === HttpStatusCode.INTERNAL_SERVER_ERROR && error?.error?.message === 'internal_server_error';
    const sampleErrorMessage = error ? (error?.error?.message ?? 'fatal-error:timeout') : null;

    return isInternalServerError ? this.translate.instant('error:st-missing-connection') : sampleErrorMessage;
  }

  private validateAmountToSend(amount: string) {
    const currentAmount = String(amount).trim();
    return !currentAmount || currentAmount == 'UNDEFINED' || currentAmount === 'undefined' ? '' : currentAmount;
  }

  private validateCurrencyToSend(currency: string) {
    const currentCurrency = String(currency).trim();

    return !currentCurrency || currentCurrency == 'UNDEFINED' ? '' : currency;
  }

}
