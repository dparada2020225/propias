import { Injectable } from '@angular/core';
import { ETMServiceCode } from '../../../enums/service-code.enum';
import {
  ITMNavigateHandlerParams, ITMServiceDetailAccountOperation,
  ITMServiceTransactionOperationExtended
} from '../../../interfaces/transaction-manager-navigate.interface';
import { TmCommonService } from '../../tm-common.service';
import {
  StOpAchMassiveTransferDefinitionService
} from '../../definitions/bp/operations/st-op-ach-massive-transfer-definition.service';
import {
  StOpAchTransferDefinitionService
} from '../../definitions/bp/operations/st-op-ach-transfer-definition.service';
import {
  StOpDonationTransferDefinitionService
} from '../../definitions/bp/operations/st-op-donation-transfer-definition.service';
import {
  StOpOwnTransferDefinitionService
} from '../../definitions/base/operations/st-op-own-transfer-definition.service';
import {
  StOpThirdPartyLoanTransferDefinitionService
} from '../../definitions/bp/operations/st-op-third-party-loan-transfer-definition.service';
import {
  StOpThirdPartyTransferDefinitionService
} from '../../definitions/base/operations/st-op-third-party-transfer-definition.service';
import { IAchAccount } from '../../../../transfer/modules/transfer-ach/interfaces/ach-account-interface';

@Injectable({
  providedIn: 'root',
})
export class TmdNavigateOperationService {
  constructor(
    private transactionManagerCommon: TmCommonService,
    private stOpAchMassiveDefinitionService: StOpAchMassiveTransferDefinitionService,
    private stOpAchDefinitionService: StOpAchTransferDefinitionService,
    private stOpDonationDefinitionService: StOpDonationTransferDefinitionService,
    private stOpOwnTransferDefinitionService: StOpOwnTransferDefinitionService,
    private stOpThirdTransferDefinitionService: StOpThirdPartyTransferDefinitionService,
    private stOpThirdPartyLoanDefinitionService: StOpThirdPartyLoanTransferDefinitionService,
  ) {
  }

  goToOperationTransaction(parameters: ITMServiceDetailAccountOperation, achAssociatedAccounts: IAchAccount[] = []) {
    const { transactionSelected } = parameters ?? {};

    if (!this.transactionManagerCommon.isSampleTransaction(transactionSelected?.serviceCode)) {
      this.handleNavigateToSpecialTransactions({
        ...parameters,
        achAssociatedAccounts,
      });
      return;
    }

    this.handleNavigateToSampleTransactions(parameters);
  }

  private handleNavigateToSampleTransactions(parameters: ITMServiceDetailAccountOperation) {
    const { transactionSelected } = parameters ?? {};

    this.transactionManagerCommon.getAccountsToDetail({
      transactionSelected,
      isTransactionHistoryMode: false,
      navigateHandler: (params: ITMNavigateHandlerParams) => this.navigateToVoucherHandler(params),
      position: parameters?.position,
      action: parameters?.action,
      sourceAccount: '',
      targetAccount: ''
    });
  }

  private handleNavigateToSpecialTransactions(params: ITMServiceTransactionOperationExtended) {
    const { transactionSelected: { serviceCode } } = params;

    const transactionMapped = {
      [ETMServiceCode.ACH_TRANSFER2]: () => this.stOpAchDefinitionService.navigateToOperation(params),
      [ETMServiceCode.ACH_MASSIVE_TRANSFERENCE2]: () => this.stOpAchMassiveDefinitionService.navigateToOperation(params),
      [ETMServiceCode.THIRD_PARTY_PAYMENT_LOAN]: () => this.stOpThirdPartyLoanDefinitionService.navigateToOperation(params),
    }

    const transactionHandler = transactionMapped[serviceCode];

    if (!transactionHandler) return;

    transactionHandler();

  }

  private navigateToVoucherHandler(params: ITMNavigateHandlerParams) {
    const { transactionSelected: { serviceCode } } = params ?? {};

    const THIRD_PARTY_CODE = this.transactionManagerCommon.THIRD_TRANSFER_VALUE;
    const transactionMapped = {
      [ETMServiceCode.OWN_TRANSFER2]: () => this.stOpOwnTransferDefinitionService.navigateToOperation(params),
      [THIRD_PARTY_CODE]: () => this.stOpThirdTransferDefinitionService.navigateToOperation(params),
      [ETMServiceCode.DONATION2]: () => this.stOpDonationDefinitionService.navigateToOperation(params),
    }

    const transactionHandler = transactionMapped[serviceCode];

    if (!transactionHandler) return;

    transactionHandler();
  }

}
