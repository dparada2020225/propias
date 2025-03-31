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
  AccountsManagementService
} from '../../../../../../../../accounts-management/services/transaction/accounts-management.service';
import { UtilTransactionService } from '../../../../../../../../../service/common/util-transaction.service';
import {
  T365TransactionService
} from '../../../../../../../../transfer/modules/transfer-365/services/transaction/t365-transaction.service';
import { ITMTransaction } from '../../../../../../../interfaces/tm-transaction.interface';
import {
  IBiesHandleResponseTermsAndCondition,
  IBiesHandleTransaction
} from '../../../../../interfaces/bisv/st-ach.interface';
import {
  ServiceTypeStatusTermsConditions
} from '../../../../../../../../transfer/enum/service-type-status-terms-conditions.enum';
import { concatMap } from 'rxjs';
import { IUserInfo } from '../../../../../../../../../models/user-info.interface';
import {
  S365TransferRequestBuilder,
} from '../../../../../../../../transfer/interface/365-transfer.interface';
import { ETMACHTypeTransaction } from '../../../../../../ach/enum/form-control-name.enum';
import { ET365TermCondition } from '../../../../../../../../accounts-management/interfaces/terms-condition.interface';
import { EProductFromCode, Product } from '../../../../../../../../../enums/product.enum';

@Injectable({
  providedIn: 'root'
})
export class StBisvAch365Service {

  constructor(
    private stSplitTransactionService: StBisvSplitTransactionManagerService,
    private parameterManagement: ParameterManagementService,
    private stTransaction: SignatureTrackingService,
    private utils: UtilService,
    private managementAccountService: AccountsManagementService,
    private utilTransaction: UtilTransactionService,
    private transfer365Service: T365TransactionService,
  ) { }

  execute(transaction: ITMTransaction, signatureType: string) {
    return this.handleExecuteTransaction({
      transaction,
      signatureType,
    });
  }

  private handleExecuteTransaction(parameters: IBiesHandleTransaction) {
    return this.getTermAndConditions(ServiceTypeStatusTermsConditions.M365)
      .pipe(
        concatMap((response) => this.manageTermsAndConditionResponse({
          ...parameters,
          response,
        })),
        concatMap(() => this.executeTransaction(parameters))
      );
  }

  private executeTransaction(parameters: IBiesHandleTransaction) {
    const data = this.buildBodyRequest(parameters);
    return  this.transfer365Service.transaction365(false, data as any, '');
  }

  private buildBodyRequest(parameters: IBiesHandleTransaction) {
    const { transaction } = parameters;

    const transactionDetail = this.stSplitTransactionService.getTransactionDetailForACHInBiesProfile(transaction?.request);
    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');
    const clientType = this.parameterManagement.getParameter('clientType');
    const clientTypeParsed = clientType === 'N' ? 'NATURAL' : 'LEGAL';
    const amount = String(this.utils.parseAmountStringToNumber(transactionDetail.sourceAmountParsed));

    return new S365TransferRequestBuilder()
      .sourceProduct(String(transactionDetail.sourceProduct))
      .sourceSubProduct(String(transactionDetail.sourceSubProduct))
      .sourceCurrency(transactionDetail.sourceCurrency)
      .sourceAmount(amount)
      .targetBank(transactionDetail.codeBank)
      .targetProduct(Product[transactionDetail.descriptionTypeAccount] ?? '01')
      .targetAccountNumber(transactionDetail.targetAccount)
      .targetCurrency(transactionDetail.sourceCurrency)
      .targetAmount(amount)
      .commentary(transactionDetail.comment)
      .targetAccountIdentificationNumber('')
      .clientType(clientTypeParsed)
      .clientNumber(userInfo.customerCode)
      .sourceAccountName(transactionDetail.sourceAccountDescription)
      .targetAccountType(transactionDetail.descriptionTypeAccount)
      .targetAccountIdentificationType('')
      .targetAccountName(transactionDetail.targetAccountName)
      .targetAccountStatus('A')
      .targetBankName(transactionDetail.targetBankName)
      .targetAccountEmail(transactionDetail.targetEmail)
      .targetAccountCreationDate(transactionDetail.targetDateCrated)
      .targetAccountModificationDate(transactionDetail.targetDateModify)
      .targetAccountCreationUser(transactionDetail.targetUserCreated)
      .targetAccountModificationUser(transactionDetail.targetUserModify)
      .serviceType(ETMACHTypeTransaction.NORMAL_365)
      .achTransferenceType(ETMACHTypeTransaction.NORMAL_365)
      .clientId(userInfo.customerCode)
      .build();
  }

  private manageTermsAndConditionResponse(parameters: IBiesHandleResponseTermsAndCondition) {
    const { response } = parameters;
    // if (!response || !response.hasOwnProperty('result') || response.result === ET365TermCondition.NOT) {
    //   return this.utilTransaction.handleErrorAcceptedTermsAndCondition();
    // }

    return this.process(parameters);
  }

  private process(parameters: IBiesHandleTransaction) {
    const { transaction, signatureType } = parameters;

    return this.stTransaction.process({
      transactionCode: transaction?.reference,
      signatureType,
    });
  }

  private getTermAndConditions(service: string) {
    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');

    return this.managementAccountService.getTermAndConditions(userInfo.customerCode, service);
  }
}
