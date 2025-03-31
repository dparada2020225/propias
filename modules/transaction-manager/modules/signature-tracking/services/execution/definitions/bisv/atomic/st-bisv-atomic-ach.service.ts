import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { UtilService } from '../../../../../../../../../service/common/util.service';
import { ITMTransaction } from '../../../../../../../interfaces/tm-transaction.interface';
import { IUserInfo } from '../../../../../../../../../models/user-info.interface';
import {
  ParameterManagementService
} from '../../../../../../../../../service/navegation-parameters/parameter-management.service';
import { UtilTransactionService } from '../../../../../../../../../service/common/util-transaction.service';
import {
  ITransactionFailedResponse,
  ITransactionSuccessResponse
} from '../../../../../../../../../models/utils-transaction.interface';
import { HttpStatusCode } from '../../../../../../../../../enums/http-status-code.enum';
import { ESignatureTrackingTypeAction, ETabPosition } from '../../../../../enum/st-transaction-status.enum';
import { ESTTransactionStatus } from '../../../../../enum/st-common.enum';
import { ESignatureTrackingUrlFlow } from '../../../../../enum/st-navigate-enum';
import { Router } from '@angular/router';
import { ModalTokenComponent } from '../../../../../../../../../view/private/token/modal-token/modal-token.component';
import { environment } from '../../../../../../../../../../environments/environment';
import { ERequestTypeTransaction } from '../../../../../../../../../enums/transaction-header.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HandleTokenRequestService } from '../../../../../../../../../service/common/handle-token-request.service';
import { StBisvAchUniService } from './st-bisv-ach-uni.service';

@Injectable({
  providedIn: 'root'
})
export class StBisvAtomicAchService {

  constructor(
    private utils: UtilService,
    private achTransactionService: StBisvAchUniService,
    private parameterManagement: ParameterManagementService,
    private utilTransaction: UtilTransactionService,
    private router: Router,
    private modalService: NgbModal,
    private handleTokenRequestService: HandleTokenRequestService,
  ) { }

  private getHasTokenRequired(serviceCode: string) {
    return this.handleTokenRequestService.isTokenRequired(serviceCode);
  }


  execute(transaction: ITMTransaction) {
    this.manageHandler(transaction);
  }

  private manageHandler(transaction: ITMTransaction) {
    if (this.getHasTokenRequired(transaction.serviceCode)) {
      this.openTokenModal(transaction);
      return;
    }

    this.transactionHandler(transaction)
      .subscribe({
        next: (response) => {
          this.handleTransactionResponse(response)
        },
      })
  }


  private transactionHandler(transaction: ITMTransaction, token?: string) {
    this.utils.showLoader();
    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');

    return this.achTransactionService.handleExecuteTransaction({
        transaction,
        token,
        isTokenRequired: this.getHasTokenRequired(transaction.serviceCode),
        signatureType: userInfo.signatureType,
      })
      .pipe(
        map(response => this.utilTransaction.handleResponseTransaction(response)),
        catchError(error => of(this.utilTransaction.handleErrorTransaction(error))),
      );
  }

  private openTokenModal(transaction: ITMTransaction) {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} sm-600`,
      size: 'lg',
    });


    modal.componentInstance.typeTransaction = ERequestTypeTransaction.ACH_TRANSFER;
    modal.componentInstance.executeService = (token?: string) => this.transactionHandler(transaction, token);

    modal.result.then(result => {
      this.handleTransactionResponse(result);
    }).catch(error => error);
  }

  private handleTransactionResponse(response: ITransactionSuccessResponse | ITransactionFailedResponse) {
    if (response.status !== HttpStatusCode.SUCCESS_TRANSACTION && response.status !== 39) {
      const parameters = {
        position: ETabPosition.AUTHORIZED,
        message: response.message,
        failed: true,
        status: ESTTransactionStatus.FAILED,
        action: ESignatureTrackingTypeAction.PROCESS,
      };

      this.parameterManagement.sendParameters({
        navigateStateParameters: parameters,
        navigationProtectedParameter: null,
      });

      this.router.navigate([ESignatureTrackingUrlFlow.HOME]).finally(() => this.utils.hideLoader());
      return;
    }

    const errorCodeActions: any = {
        '0': { successMessage: 'label:st_success_process_single_trx' },
          // 0: { successMessage: 'label:st_success_process_single_trx' },
      '124': { successMessage: 'ach-uni:transfer-success-other-hour' },
        // 124: { successMessage: 'ach-uni:transfer-success-other-hour' },
    };
    const action = errorCodeActions[response.data.errorCode];


    let message: string = ''
    if(response.data.errorCode){}

    const parameters = {
      position: ETabPosition.AUTHORIZED,
      message: action.successMessage,
      failed: false,
      status: ESTTransactionStatus.SUCCESS,
      action: ESignatureTrackingTypeAction.PROCESS,
    };

    this.parameterManagement.sendParameters({
      navigateStateParameters: parameters,
      navigationProtectedParameter: null,
    });

    this.router.navigate([ESignatureTrackingUrlFlow.HOME]).finally(() => this.utils.hideLoader());
  }
}
