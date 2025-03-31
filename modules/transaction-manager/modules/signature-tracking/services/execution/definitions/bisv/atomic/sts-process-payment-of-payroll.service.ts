import {Injectable} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {catchError, map} from 'rxjs/operators';
import {of, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AdfAlertModalComponent, AlertAttributeBuilder, AlertBuilder} from '@adf/components';
import {HttpErrorResponse} from '@angular/common/http';
import { ITMTransaction } from '../../../../../../../interfaces/tm-transaction.interface';
import { HandleTokenRequestService } from '../../../../../../../../../service/common/handle-token-request.service';
import { StProcessHandlerService } from '../../../utils/st-process-handler.service';
import {
  ParameterManagementService
} from '../../../../../../../../../service/navegation-parameters/parameter-management.service';
import { UtilService } from '../../../../../../../../../service/common/util.service';
import { UtilTransactionService } from '../../../../../../../../../service/common/util-transaction.service';
import { HttpStatusCode } from '../../../../../../../../../enums/http-status-code.enum';
import { ESignatureTrackingUrlFlow } from '../../../../../enum/st-navigate-enum';
import { ModalTokenComponent } from '../../../../../../../../../view/private/token/modal-token/modal-token.component';
import { environment } from '../../../../../../../../../../environments/environment';
import { ERequestTypeTransaction } from '../../../../../../../../../enums/transaction-header.enum';
import { IResponseRetryProcessPaymentOfPayroll } from '../../../../../interfaces/st-payment-of-payroll.interface';
import { ETabPosition } from '../../../../../enum/st-transaction-status.enum';
import { SignatureTrackingService } from '../../../../transaction/signature-tracking.service';
import { StBuildUpdateBodyRequestService } from '../../../../definition/st-build-update-body-request.service';
import { StCommonTransactionService } from '../../../st-common-transaction.service';
import { ESTTransactionStatus } from '../../../../../enum/st-common.enum';


@Injectable({
  providedIn: 'root'
})
export class StsProcessPaymentOfPayrollService {
  private transaction: ITMTransaction | null = null;

  constructor(
    private handleTokenRequestService: HandleTokenRequestService,
    private processHandler: StProcessHandlerService,
    private parameterManager: ParameterManagementService,
    private modalService: NgbModal,
    private utils: UtilService,
    private utilTransaction: UtilTransactionService,
    private router: Router,
    private stTransaction: SignatureTrackingService,
    private stBuildUpdateBodyRequest: StBuildUpdateBodyRequestService,
    private stCommonTransaction: StCommonTransactionService,
  ) {
    this.resetState();
  }


  execute(parameters: any) {
    const { transactionSelected } = parameters;

    this.transaction = transactionSelected;

    this.mangeExecuteProcess({
      transactionSelected,
    });
  }

  private transactionHandler(transactionSelected: ITMTransaction, token: string = '') {
    this.utils.showLoader();

    return this.process(token)
      .pipe(
        map(response => this.utilTransaction.handleResponseTransaction(response)),
        catchError(error => of(this.utilTransaction.handleErrorTransaction(error))),
      );
  }

  private mangeExecuteProcess(parameters: any) {
    const { transactionSelected } = parameters;
    if (this.handleTokenRequestService.isTokenRequired(this.transaction?.serviceCode)) {
      this.tokenModal(transactionSelected);
      return;
    }

    this.transactionHandler(transactionSelected).subscribe({
      next: response => this.handleTransactionResponse(response, transactionSelected),
    });
  }

  private handleTransactionResponse(response: any, transactionSelected: ITMTransaction) {
    if (response.status !== HttpStatusCode.SUCCESS_TRANSACTION && response.status !== HttpStatusCode.PROCESS_PAYMENT_OF_PAYROLL) {
      const parameters = {
        position: ETabPosition.AUTHORIZED,
        message: response.message,
        failed: true,
        status: ESTTransactionStatus.FAILED,
      };

      this.parameterManager.sendParameters({
        navigateStateParameters: parameters,
        navigationProtectedParameter: null,
      });

      this.router.navigate([ESignatureTrackingUrlFlow.HOME]).finally(() => {});
      return;
    }

    const parameters = {
      position: ETabPosition.AUTHORIZED,
      message: null,
      failed: false,
      status: ESTTransactionStatus.SUCCESS,
    };

    this.parameterManager.sendParameters({
      navigateStateParameters: parameters,
      navigationProtectedParameter: null,
    });

    this.router.navigate([ESignatureTrackingUrlFlow.HOME]).finally(() => {});
  }


  private tokenModal(transactionSelected: ITMTransaction) {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} sm-600`,
      size: 'lg',
    });


    modal.componentInstance.typeTransaction = ERequestTypeTransaction.AUTHENTICATION;
    modal.componentInstance.executeService = (token?: string) => this.transactionHandler(transactionSelected, token);

    modal.result.then(result => {
      if (!result) return;

      this.handleTransactionResponse(result, transactionSelected);
    }).catch(error => error);
  }


  private openModalControlledErrorForProcessPaymentOfPayroll(message: string, transactionSelected: ITMTransaction) {
    const modal = this.modalService.open(AdfAlertModalComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} alert-modal`,
      size: `lg`,
    });

    modal.componentInstance.data = this.alertForErrorProcessPaymentOfPayroll(message);

    modal.result.then((isConfirm) => {
      if (!isConfirm) { return; }

      this.retryProcess(transactionSelected);

    }).catch(error => error);
  }


  retryProcess(transaction: ITMTransaction) {
    this.utils.showLoader();

    this.modifyTransaction(transaction)
      .subscribe({
        next: (response) => {
          if (!response.hasOwnProperty('statusCode') || !response.hasOwnProperty('isSuccessful')) {
            this.stCommonTransaction.handleResponseProcessOperation({
              outPutResponse: {
                status: ESTTransactionStatus.FAILED,
                position: 2,
                action: '',
                data: null,
                message: (response as any).error.message,
              }
            });

            return;
          }

          this.mangeExecuteProcess({
            transactionSelected: transaction,
          });
        },
      });
  }


  private modifyTransaction(transaction: ITMTransaction) {
    return this.stTransaction.update({
        transactionCode: transaction?.reference,
        data: this.stBuildUpdateBodyRequest.buildBodyToUpdatePaymentOfPayrollMultiple(transaction?.request).trim(),
        serviceModify: transaction?.serviceCode,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error?.error?.code !== HttpStatusCode.SIGNATURE_TRACKING_MODIFY_SUCCESS) {
            return throwError(() => error);
          }

          return of({
            isSuccessful: true,
            statusCode: HttpStatusCode.SIGNATURE_TRACKING_MODIFY_SUCCESS,
          } as IResponseRetryProcessPaymentOfPayroll)
        })
      );
  }


  private alertForErrorProcessPaymentOfPayroll(message?: string) {
    const iconAlertAttribute = new AlertAttributeBuilder()
      .label('banca-regional-warning')
      .build();

    const titleAlertAttribute = new AlertAttributeBuilder()
      .label('alert-title')
      .build();

    const messageAlertAttribute = new AlertAttributeBuilder()
      .label(message ?? 'not-found:message')
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

  getHasTokenRequired(serviceCode: string) {
    return this.handleTokenRequestService.isTokenRequired(serviceCode);
  }

  private process(token?: string) {
    if (!this.handleTokenRequestService.isTokenRequired(this.transaction?.serviceCode)) {
      return this.processHandler.processTransactionWithoutToken({
        transactionCode: this.transaction!.reference,
        signatureType: this.parameterManager.getParameter('userInfo').signatureType,
      }, false);
    }

    return this.processHandler.processTransactionWithToken({
      isTokenRequired: this.handleTokenRequestService.isTokenRequired(this.transaction?.serviceCode),
      tokenValue: token as string,
      typeTransaction: ERequestTypeTransaction.AUTHENTICATION,
      bodyRequest: {
        transactionCode: `${this.transaction?.reference}`,
        signatureType: this.parameterManager.getParameter('userInfo').signatureType,
      },
      serviceCode: this.transaction?.serviceCode,
    });
  }

  private resetState() {
    this.transaction = null;
  }
}
