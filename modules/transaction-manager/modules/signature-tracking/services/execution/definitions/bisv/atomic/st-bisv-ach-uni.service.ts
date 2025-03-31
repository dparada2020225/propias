import { Injectable } from '@angular/core';
import {
  StBisvSplitTransactionManagerService
} from '../../../../../../../services/manager/bisv/st-bisv-split-transaction-manager.service';
import {
  ParameterManagementService
} from '../../../../../../../../../service/navegation-parameters/parameter-management.service';
import { SignatureTrackingService } from '../../../../transaction/signature-tracking.service';
import { UtilService } from '../../../../../../../../../service/common/util.service';
import {
  AchUniTransferService
} from '../../../../../../../../transfer/modules/transfer-ach-uni/services/transaction/ach-uni-transfer.service';
import {
  AccountsManagementService
} from '../../../../../../../../accounts-management/services/transaction/accounts-management.service';
import { IUserInfo } from '../../../../../../../../../models/user-info.interface';
import { ITMTransaction } from '../../../../../../../interfaces/tm-transaction.interface';
import {
  IBiesHandleResponseTermsAndCondition,
  IBiesHandleTransaction
} from '../../../../../interfaces/bisv/st-ach.interface';
import { concatMap } from 'rxjs';
import { EACHServiceMapped } from '../../../../../../../../transfer/enum/ach-transaction.enum';
import { ET365TermCondition } from '../../../../../../../../accounts-management/interfaces/terms-condition.interface';
import { UtilTransactionService } from '../../../../../../../../../service/common/util-transaction.service';
import { ETMServiceCode } from '../../../../../../../enums/service-code.enum';
import { ERequestTypeTransaction } from '../../../../../../../../../enums/transaction-header.enum';
import { S365TransferRequestBuilder } from '../../../../../../../../transfer/interface/365-transfer.interface';
import { ETMACHTypeTransaction } from '../../../../../../ach/enum/form-control-name.enum';

@Injectable({
  providedIn: 'root'
})
export class StBisvAchUniService {

  constructor(
    private stSplitTransactionService: StBisvSplitTransactionManagerService,
    private parameterManagement: ParameterManagementService,
    private stTransaction: SignatureTrackingService,
    private utils: UtilService,
    private transferACHUNI: AchUniTransferService,
    private managementAccountService: AccountsManagementService,
    private utilTransaction: UtilTransactionService,
  ) { }

  execute(transaction: ITMTransaction, signatureType: string) {
    return this.handleExecuteTransaction({
      transaction,
      signatureType,
    });
  }

  handleExecuteTransaction(parameters: IBiesHandleTransaction) {
    return this.getTermAndConditions(EACHServiceMapped.UNI)
      .pipe(
        concatMap((response) => this.manageTermsAndConditionResponse({
          ...parameters,
          response,
        })),
        concatMap(() => this.executeTransaction(parameters))
      );
  }

  private executeTransaction(parameters: IBiesHandleTransaction) {
    const data = this.buildBodyRequest(parameters) as any;
    return  this.transferACHUNI.achUniTransfer(false, data, '')
  }

  private buildBodyRequest(parameters: IBiesHandleTransaction) {
    const { transaction } = parameters;
    const transactionDetail = this.stSplitTransactionService.getTransactionDetailForACHInBiesProfile(transaction?.request);
    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');
    const clientType = this.parameterManagement.getParameter('clientType');
    const amount = this.utils.parseAmountStringToNumber(transactionDetail.sourceAmountParsed);
    const commission = this.utils.parseAmountStringToNumber(transactionDetail.UniCommissionParsed);

    return new S365TransferRequestBuilder()
      .sourceProduct(transactionDetail.sourceProduct)
      .sourceSubProduct(transactionDetail.sourceSubProduct)
      .sourceCurrency(transactionDetail.sourceCurrency)
      .sourceAccountNumber(transactionDetail.sourceAccount)
      .sourceAmount(amount.toString())
      .targetBank(transactionDetail.codeBank)
      .targetProduct(transactionDetail.targetProduct)
      .targetAccountNumber(transactionDetail.targetAccount)
      .targetCurrency(transactionDetail.targetCurrency)
      .targetAmount(amount.toString())
      .commentary(transactionDetail.comment)
      .targetAccountIdentificationNumber(transactionDetail.targetIdentify)
      .clientType(clientType)
      .clientNumber(userInfo.customerCode)
      .sourceAccountName(transactionDetail.sourceAccountDescription)
      .targetAccountType('')
      .targetAccountIdentificationType('')
      .targetAccountName(transactionDetail.targetAccountName)
      .targetAccountStatus(transactionDetail.targetAccountStatus)
      .targetBankName(transactionDetail.targetBankName)
      .targetAccountEmail(transactionDetail.targetEmail)
      .targetAccountCreationDate(transactionDetail.targetDateCrated)
      .targetAccountModificationDate(transactionDetail.targetDateModify)
      .targetAccountCreationUser(transactionDetail.targetUserCreated)
      .targetAccountModificationUser(transactionDetail.targetUserModify)
      .serviceType(ETMACHTypeTransaction.UNI)
      .achTransferenceType(ETMACHTypeTransaction.UNI)
      .purpose(transactionDetail.proposalCode)
      .omitASTransaction()
      .commission(commission.toString())
      .build();
  }

  private manageTermsAndConditionResponse(parameters: IBiesHandleResponseTermsAndCondition) {
    const { response, isTokenRequired } = parameters;
    if (!response || !response.hasOwnProperty('result') || response.result === ET365TermCondition.NOT) {
      return this.utilTransaction.handleErrorAcceptedTermsAndCondition();
    }

    if (isTokenRequired) return this.processWithToken(parameters);

    return this.process(parameters);
  }

  private process(parameters: IBiesHandleTransaction) {
    const { transaction, signatureType } = parameters;

    return this.stTransaction.process({
      transactionCode: transaction?.reference,
      signatureType,
    });
  }

  private processWithToken(parameters: IBiesHandleTransaction) {
    const { transaction, signatureType, token, isTokenRequired } = parameters;

    return this.stTransaction.processWithToken({
      isTokenRequired: isTokenRequired as boolean,
      tokenValue: token as string,
      typeTransaction: ERequestTypeTransaction.ACH_TRANSFER,
      bodyRequest: {
        transactionCode: transaction?.reference,
        signatureType,
        serviceCode: ETMServiceCode.ACH_TRANSFER_MANAGER,
      },
      serviceCode: ETMServiceCode.ACH_TRANSFER_MANAGER
    });
  }

  private getTermAndConditions(service: string) {
    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');

    return this.managementAccountService.getTermAndConditions(userInfo.customerCode, service);
  }
}
