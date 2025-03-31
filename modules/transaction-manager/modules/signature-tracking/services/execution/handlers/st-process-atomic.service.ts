import { Injectable } from '@angular/core';
import { SttManagerService } from '../operation-handlers/stt-manager.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ParameterManagementService
} from '../../../../../../../service/navegation-parameters/parameter-management.service';
import { ModalTokenComponent } from '../../../../../../../view/private/token/modal-token/modal-token.component';
import { environment } from '../../../../../../../../environments/environment';
import { IProcessSTOperations } from '../../../interfaces/st-transfer.interface';
import { ESTTransactionStatus, ETransactionStatus } from '../../../enum/st-common.enum';
import { ESignatureTrackingTypeAction, ETabPosition } from '../../../enum/st-transaction-status.enum';
import { IUserInfo } from '../../../../../../../models/user-info.interface';
import {
  IExecuteTransactionWithToken,
  IExecuteTransactionWithTokenFailedResponse
} from '../../../../../../../models/token-service-response.interface';
import {
  IMultipleRequestResponse,
} from '../../../interfaces/signature-tracking.interface';
import { HandleTokenRequestService } from '../../../../../../../service/common/handle-token-request.service';
import { StCommonTransactionService } from '../st-common-transaction.service';
import { ITMTransaction } from '../../../../../interfaces/tm-transaction.interface';
import { FeatureManagerService } from '../../../../../../../service/common/feature-manager.service';
import { UtilService } from '../../../../../../../service/common/util.service';
import { TypeTokenEnum } from '../../../../../../../enums/token.enum';


@Injectable({
  providedIn: 'root',
})
export class StProcessAtomicService {
  private typeTransaction: string = '';

  constructor(
    private stOperationManager: SttManagerService,
    private parameterManager: ParameterManagementService,
    private modalService: NgbModal,
    private handleTokenRequired: HandleTokenRequestService,
    private stCommonTransaction: StCommonTransactionService,
    private featureManager: FeatureManagerService,
    private utils: UtilService,
  ) { }

  execute(typeTransaction: string) {
    this.typeTransaction = typeTransaction;
    const transactionState = this.parameterManager.getParameter('navigateStateParameters');
    const transactionServiceCode = transactionState?.transactionSelected?.serviceCode;

    // if (this.featureManager.isStBisvMultipleEnabled()) {
    //   return this.openTokenBisvModal();
    // }

    if (this.getIsTokenRequired(transactionServiceCode)) {
      this.openTokenModal();
      return;
    }

    this.handleProcessTransaction();
  }

  private openTokenModal() {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} sm-600`,
      size: 'lg',
    });

    modal.componentInstance.typeTransaction = this.typeTransaction;
    modal.componentInstance.executeService = this.handleProcessTransactionWithToken.bind(this);

    modal.result.then(result => {
      this.handleProcessWithTokenTransactionResponse(result);
    }).catch(error => error);

  }

  private handleProcessTransaction() {
    const transactionState = this.parameterManager.getParameter('navigateStateParameters');
    const userInfo: IUserInfo = this.parameterManager.getParameter('userInfo');


    const properties: IProcessSTOperations = this.getProcessParametersToExecute(transactionState?.transactionSelected, userInfo?.signatureType);
    this.stOperationManager.handleExecuteProcess(properties);
  }

  private getProcessParametersToExecute(transaction: ITMTransaction, signature: string) {
    const message = this.featureManager.isBisvSignatureTrackingFeaturesEnabled() ? 'label:st_success_process_single_trx' : '';

    return {
      transaction,
      signatureType: signature,
      transactionStatus: ETransactionStatus.AUTHORIZED,
      message,
      position: ETabPosition.AUTHORIZED,
      action: ESignatureTrackingTypeAction.PROCESS
    }
  }

  private handleProcessTransactionWithToken(tokenValue?: string) {
    const transactionState = this.parameterManager.getParameter('navigateStateParameters');
    const userInfo: IUserInfo = this.parameterManager.getParameter('userInfo');


    return this.stOperationManager.handleExecuteProcessWithToken({
      processProperties: this.getProcessParametersToExecute(transactionState?.transactionSelected, userInfo?.signatureType),
      isTokenRequired: this.getIsTokenRequired(transactionState?.transactionSelected?.serviceCode),
      token: tokenValue as string,
      typeTransaction: this.typeTransaction,
    });
  }

  private handleProcessWithTokenTransactionResponse(result: IExecuteTransactionWithToken<IMultipleRequestResponse> | IExecuteTransactionWithTokenFailedResponse | null) {
    if (!result) return;

    if (result?.status !== 200) {
      this.stCommonTransaction.handleResponseProcessOperation({
        outPutResponse: {
          status: ESTTransactionStatus.FAILED,
          position: ETabPosition.AUTHORIZED,
          action: ESignatureTrackingTypeAction.AUTHORIZE,
          data: null,
          message: result?.message ?? 'error:signature_tracking_process',

        }
      });

      return;
    }

    this.stCommonTransaction.handleResponseProcessOperation({
      outPutResponse: {
        message: result?.message ?? '',
        status: ESTTransactionStatus.SUCCESS,
        position: ETabPosition.AUTHORIZED,
        action: ESignatureTrackingTypeAction.AUTHORIZE,
        data: result?.data ?? null,
      }
    });
  }

  private getIsTokenRequired(serviceCode: string) {
    return this.handleTokenRequired.isTokenRequired(serviceCode);
  }

  private openTokenBisvModal() {
    const typeToken = this.utils.getTokenType();

    if (typeToken === TypeTokenEnum.SMS) {
      return this.handleProcessTransaction();
    }

    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} own-modal sm-600`,
      size: 'lg',
    });

    modal.result
      .then((result) => {
        if (!result) return;

        this.handleProcessTransaction();
      })
      .catch((error) => error);
  }
}
