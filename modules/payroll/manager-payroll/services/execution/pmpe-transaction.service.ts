import {Injectable} from '@angular/core';
import {BehaviorSubject, concatMap, from, of, switchMap} from 'rxjs';
import {ModalTokenComponent} from '../../../../../view/private/token/modal-token/modal-token.component';
import {ERequestTypeTransaction} from '../../../../../enums/transaction-header.enum';
import {UtilService} from '../../../../../service/common/util.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HandleTokenRequestService} from '../../../../../service/common/handle-token-request.service';
import {ParameterManagementService} from '../../../../../service/navegation-parameters/parameter-management.service';
import {Router} from '@angular/router';
import {SPPMRoutes} from '../../enums/pmp-routes.enum';
import {PaymentOfPayrollRouteProtectedParameter} from '../../enums/pmp-protected-parameter.enum';
import { IPayPayroll, IPayrollPaymentError } from '../../interfaces/pmp-payment-home.interface';
import {PmpTransactionService} from "../transaction/pmp-transaction.service";
import {catchError, map} from "rxjs/operators";
import {PmpeBuilddataService} from "./pmpe-builddata.service";
import {HttpStatusCode} from "../../../../../enums/http-status-code.enum";
import {HttpErrorResponse} from '@angular/common/http';
import {UtilTransactionService} from "../../../../../service/common/util-transaction.service";
import { IPayrollPaymentSendFileParameters, IPayrollPaySuccess } from '../../interfaces/pmpe-transaction.interface';
import {ITransactionSuccessResponse} from "../../../../../models/utils-transaction.interface";
import { PayrollManagerPaymentExecuteParameters } from '../../interfaces/pmp-payed-payroll.interface';


@Injectable({
  providedIn: 'root'
})
export class PmpeTransactionService {
  private messageSubject = new BehaviorSubject<string | null>(null);
  message$ = this.messageSubject.asObservable();


  constructor(
    private utils: UtilService,
    private modalService: NgbModal,
    private handleTokenRequest: HandleTokenRequestService,
    private parameterManager: ParameterManagementService,
    private serviceTransactions: PmpTransactionService,
    private router: Router,
    private buildDataToTransfer: PmpeBuilddataService,
    private utilTransaction: UtilTransactionService,
  ) {
  }


  execute(parameters: PayrollManagerPaymentExecuteParameters) {
    this.validateIsTokenRequiredModal(parameters);
  }

  private executeTransaction(parameters: PayrollManagerPaymentExecuteParameters, token?: string) {
    this.utils.showLoader();
    const dto: IPayPayroll = this.buildDataToTransfer.generateDataToPayPayroll(parameters)


    return this.serviceTransactions.payPayroll({
      bodyRequest: dto,
      token,
      isTokenRequired: this.isTokenRequired
    }).pipe(
      concatMap((response:IPayrollPaySuccess) => {
        return this.sendFile({
          response,
          paymentDetail: parameters.paymentDetail,
          signatureTrackingResponse: null,
        });
      }),
      catchError((error: IPayrollPaymentError) => {
        if (error?.error?.code === HttpStatusCode.SIGNATURE_TRACKING) {
          return this.sendFile({
            paymentDetail: parameters.paymentDetail,
            response: {
              reference: error?.error?.reference,
              fileName: `I${error?.error?.developerCode}.txt`,
              dateTime: error?.error?.dateTime,
            },
            signatureTrackingResponse: error,
          });
        }
        return of(this.utilTransaction.handleErrorTransaction(error));
      })
    );
  }

  private sendFile(parameters: IPayrollPaymentSendFileParameters) {
    const { response, signatureTrackingResponse, paymentDetail } = parameters;

    return from(this.buildDataToTransfer.buildFile({
      fileName: response.fileName,
      paymentDetail,
    }))
      .pipe(
      switchMap(({formData}) => this.serviceTransactions.sendFTPFile(formData) ),
      map(() => {
        if (signatureTrackingResponse) {
          return {
            status: HttpStatusCode.SIGNATURE_TRACKING,
            data: {
              reference: response?.reference,
              dateTime: response?.dateTime,
            },
            message: signatureTrackingResponse?.error?.message,
          } as ITransactionSuccessResponse;
        }

        return this.utilTransaction.handleResponseTransaction(response);
      }),
      catchError((error: HttpErrorResponse) => of(this.utilTransaction.handleErrorTransaction(error)))
    );
  }


  get isTokenRequired() {
    return this.handleTokenRequest.isTokenRequired();
  }

  private validateIsTokenRequiredModal(parameters: PayrollManagerPaymentExecuteParameters) {
    if (this.isTokenRequired) {
      this.openTokenModal(parameters);
      return
    }

    this.executeTransaction(parameters).subscribe({
      next: (response) => {
        this.handleResponse(response as ITransactionSuccessResponse<IPayrollPaySuccess>);
      },
    });
  }

  private handleResponse(response:ITransactionSuccessResponse<IPayrollPaySuccess>) {
    if (response.status === HttpStatusCode.INVALID_TOKEN) {
      this.utils.hidePulseLoader();
      this.utils.hideLoader();
      return;
    }

    if (response.status !== HttpStatusCode.SUCCESS_TRANSACTION && Number(response?.status) !== Number(HttpStatusCode.SIGNATURE_TRACKING)) {
      this.utils.hidePulseLoader();
      this.utils.hideLoader();
      this.messageSubject.next(response.message as string);
      this.utils.scrollToTop();
      return;
    }

    this.utils.showLoader();

    if (Number(response.status) == Number(HttpStatusCode.SIGNATURE_TRACKING)) {
      this.navigateSignatureTrackingTransaction(response);
      return;
    }

    this.navigateSuccessTransaction(response);
  }


  private navigateSuccessTransaction(response:ITransactionSuccessResponse<IPayrollPaySuccess>) {
    const state = this.parameterManager.getParameter('navigateStateParameters');

    this.parameterManager.sendParameters({
      navigateStateParameters: {
        ...state,
        serviceResponse: response.data,
      },
      navigationProtectedParameter: PaymentOfPayrollRouteProtectedParameter.PAYMENT_VOUCHER
    })

    this.utils.showLoader();
    this.router.navigate([SPPMRoutes.VOUCHER_PAYMENT]).finally(() => this.utils.hideLoader());
  }

  private navigateSignatureTrackingTransaction(response: ITransactionSuccessResponse<IPayrollPaySuccess>) {
    const state = this.parameterManager.getParameter('navigateStateParameters');

    this.parameterManager.sendParameters({
      navigateStateParameters: {
        ...state,
        serviceResponse: {
          dateTime: response?.data?.dateTime,
          reference: response?.data?.reference,
          message: 'payroll:label_success_signature',
        },
      },
      navigationProtectedParameter: PaymentOfPayrollRouteProtectedParameter.ST_PAYMENT_VOUCHER
    })

    this.utils.showLoader();
    this.router.navigate([SPPMRoutes.ST_PAYMENT_VOUCHER]).finally(() => this.utils.hideLoader());
  }


  private openTokenModal(parameters: PayrollManagerPaymentExecuteParameters) {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${this.utils.getProfile() || 'byte-theme'} sm-600`,
      size: 'lg',
    });

    modal.componentInstance.typeTransaction = ERequestTypeTransaction.AUTHENTICATION;
    modal.componentInstance.executeService = (token: string) => this.executeTransaction(parameters, token);

    modal.result
      .then((response) => {
      if (!response) {
        return
      }

        this.handleResponse(response);
      })
      .catch(() => {
      })
  }


  public resetMessage() {
    this.messageSubject.next(null);
  }

}
