import { Injectable } from '@angular/core';
import { UtilService } from '../../../../../../../../../service/common/util.service';
import {
  ParameterManagementService
} from '../../../../../../../../../service/navegation-parameters/parameter-management.service';
import { UtilTransactionService } from '../../../../../../../../../service/common/util-transaction.service';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  ITransactionFailedResponse,
  ITransactionSuccessResponse
} from '../../../../../../../../../models/utils-transaction.interface';
import { HttpStatusCode } from '../../../../../../../../../enums/http-status-code.enum';
import { ESignatureTrackingTypeAction, ETabPosition } from '../../../../../enum/st-transaction-status.enum';
import { ESTTransactionStatus } from '../../../../../enum/st-common.enum';
import { ESignatureTrackingUrlFlow } from '../../../../../enum/st-navigate-enum';
import { IStBisvAchMassiveTransferStartupParameters } from '../../../../../interfaces/bisv/st-ach.interface';
import { StBisvAchMassiveTransferenceService } from '../multiple/st-bisv-ach-massive-transference.service';
import { ModalTokenComponent } from '../../../../../../../../../view/private/token/modal-token/modal-token.component';
import { environment } from '../../../../../../../../../../environments/environment';
import { ERequestTypeTransaction } from '../../../../../../../../../enums/transaction-header.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HandleTokenRequestService } from '../../../../../../../../../service/common/handle-token-request.service';

@Injectable({
  providedIn: 'root'
})
export class StBisvAtomicAchUniMultipleService {

  constructor(
    private utils: UtilService,
    private achTransactionService: StBisvAchMassiveTransferenceService,
    private parameterManagement: ParameterManagementService,
    private utilTransaction: UtilTransactionService,
    private router: Router,
    private modalService: NgbModal,
    private handleTokenRequestService: HandleTokenRequestService,
  ) { }

  execute(parameters: IStBisvAchMassiveTransferStartupParameters) {
    this.manageHandler(parameters);
  }

  private transactionHandler(parameters: IStBisvAchMassiveTransferStartupParameters) {
    this.utils.showLoader();
    return this.achTransactionService.handleExecuteTransaction({
      ...parameters,
      isTokenRequired: this.getHasTokenRequired(parameters.transaction.serviceCode),
      token: parameters?.token,
      })
      .pipe(
        map(response => this.utilTransaction.handleResponseTransaction(response)),
        catchError(error => of(this.utilTransaction.handleErrorTransaction(error))),
      );
  }

  private getHasTokenRequired(serviceCode: string) {
    return this.handleTokenRequestService.isTokenRequired(serviceCode);
  }

  private manageHandler(parameters: IStBisvAchMassiveTransferStartupParameters) {
    const { transaction } = parameters;
    if (this.getHasTokenRequired(transaction.serviceCode)) {
      this.openTokenModal(parameters);
      return;
    }

    this.transactionHandler(parameters)
      .subscribe({
        next: (response) => {
          this.handleTransactionResponse(response)
        },
      })
  }

  private openTokenModal(parameters: IStBisvAchMassiveTransferStartupParameters) {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} sm-600`,
      size: 'lg',
    });


    modal.componentInstance.typeTransaction = ERequestTypeTransaction.ACH_TRANSFER;
    modal.componentInstance.executeService = (token?: string) => this.transactionHandler({
      ...parameters,
      token: token,
    });

    modal.result.then(result => {
      this.handleTransactionResponse(result);
    }).catch(error => error);
  }

  private handleTransactionResponse(response: ITransactionSuccessResponse | ITransactionFailedResponse) {
    if (response.status !== HttpStatusCode.SUCCESS_TRANSACTION) {
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

    const parameters = {
      position: ETabPosition.AUTHORIZED,
      message: 'label:st_success_process_single_trx',
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
