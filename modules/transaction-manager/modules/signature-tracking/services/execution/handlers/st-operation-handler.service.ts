import { Injectable } from '@angular/core';
import { SttManagerService } from '../operation-handlers/stt-manager.service';
import { ESignatureTrackingTypeAction } from '../../../enum/st-transaction-status.enum';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { IProcessSTOperations, ISTOperationHandlerParameter } from '../../../interfaces/st-transfer.interface';
import { StCommonTransactionService } from '../st-common-transaction.service';
import { STOperationHandlerParameters } from '../../../interfaces/st-operation-handler.interface';
import { FeatureManagerService } from '../../../../../../../service/common/feature-manager.service';

@Injectable({
  providedIn: 'root',
})
export class StOperationHandlerService {
  private userInfo =  this.parameterManagement.getParameter('userInfo');


  constructor(
    private signatureTrackingTransactionManager: SttManagerService,
    private parameterManagement: ParameterManagementService,
    private stCommon: StCommonTransactionService,
    private featureManagerService: FeatureManagerService,

  ) { }

  operationManager(startupParameters :STOperationHandlerParameters) {
    const { action } = startupParameters;

    const mapOperations = {
      [ESignatureTrackingTypeAction.REJECT]: () => this.manageRejectTransaction(startupParameters),
      [ESignatureTrackingTypeAction.SEND]: () => this.manageSendTransaction(startupParameters),
      [ESignatureTrackingTypeAction.AUTHORIZE]: () => this.manageAuthorizeTransaction(startupParameters),
      [ESignatureTrackingTypeAction.DELETE]: () => this.manageDeleteTransaction(startupParameters),
    }

    const operation = mapOperations[action];
    if (!operation) return;

    operation();
  }

  private manageRejectTransaction(startupParameters :STOperationHandlerParameters) {
    const { transactionSelected, position } = startupParameters;

    const message = this.featureManagerService.isBisvSignatureTrackingFeaturesEnabled() ? 'label:st_success_reject_single_trx' : null

    this.rejectTransaction({
      signatureType: this.userInfo?.signatureType,
      transaction: transactionSelected,
      message,
      position,
    });
  }

  private manageAuthorizeTransaction(startupParameters :STOperationHandlerParameters) {
    const { transactionSelected, position } = startupParameters;

    this.authorize({
      signatureType: this.userInfo?.signatureType,
      transaction: transactionSelected,
      message: 'signature_tracking:authorize_successfully',
      position,
    });
  }

  private manageDeleteTransaction(startupParameters :STOperationHandlerParameters) {
    const { transactionSelected, position } = startupParameters;

    const message =
      this.featureManagerService.isBisvSignatureTrackingFeaturesEnabled() ? 'signature_tracking:delete_single_transaction' : 'st-delete-transaction-success';

    this.deleted({
      signatureType: this.userInfo?.signatureType,
      transaction: transactionSelected,
      message,
      position,
    });
  }

  private manageSendTransaction(startupParameters :STOperationHandlerParameters) {
    const { transactionSelected, position } = startupParameters;

    this.sendTransaction({
      signatureType: this.userInfo?.signatureType,
      transaction: transactionSelected,
      message: 'signature_tracking:send_successfully',
      position,
    });

  }

  private rejectTransaction(params: ISTOperationHandlerParameter) {
    const { transaction, signatureType, message, position } = params ?? {};

    const parameters: IProcessSTOperations = {
      transaction,
      signatureType,
      message,
      position,
      transactionStatus: this.stCommon.getTransactionStatus(position),
      action: ESignatureTrackingTypeAction.REJECT,
    };


    this.signatureTrackingTransactionManager.handleExecuteReject(parameters);

  }

  private sendTransaction(params: ISTOperationHandlerParameter) {
    const { transaction, signatureType, message, position } = params ?? {};

    const parameters: IProcessSTOperations = {
      transaction,
      signatureType,
      message,
      position,
      transactionStatus: this.stCommon.getTransactionStatus(position),
      action: ESignatureTrackingTypeAction.SEND,
    };


    this.signatureTrackingTransactionManager.handleExecuteSend(parameters);

  }

  private deleted(params: ISTOperationHandlerParameter) {
    const { transaction, signatureType, message, position } = params ?? {};

    const parameters: IProcessSTOperations = {
      transaction,
      signatureType,
      message,
      position,
      transactionStatus: this.stCommon.getTransactionStatus(position),
      action: ESignatureTrackingTypeAction.DELETE,
    };


    this.signatureTrackingTransactionManager.handleExecuteDelete(parameters);

  }

  private authorize(params: ISTOperationHandlerParameter) {
    const { transaction, signatureType, message, position } = params ?? {};

    const parameters: IProcessSTOperations = {
      transaction,
      signatureType,
      message,
      position,
      transactionStatus: this.stCommon.getTransactionStatus(position),
      action: ESignatureTrackingTypeAction.AUTHORIZE,
    };


    this.signatureTrackingTransactionManager.handleExecuteAuthorize(parameters);

  }
}
