import { Injectable } from '@angular/core';
import { ETMServiceCode } from '../../../enums/service-code.enum';
import {
  ITMNavigateHandlerExtendedParams,
  ITMNavigateHandlerParams,
  ITMServiceDetail
} from '../../../interfaces/transaction-manager-navigate.interface';
import { IAchAccount } from '../../../../transfer/modules/transfer-ach/interfaces/ach-account-interface';
import { TmCommonService } from '../../tm-common.service';
import { StOwnTransferDefinitionService } from '../../definitions/base/detail/st-own-transfer-definition.service';
import { StThirdTransferDefinitionService } from '../../definitions/base/detail/st-third-transfer-definition.service';
import {
  StDonationTransferDefinitionService
} from '../../definitions/bp/detail/st-donation-transfer-definition.service';
import { StAchTransferDefinitionService } from '../../definitions/bp/detail/st-ach-transfer-definition.service';
import {
  StAchMassiveTransferDefinitionService
} from '../../definitions/bp/detail/st-ach-massive-transfer-definition.service';
import {
  StThirdPartyTransferDefinitionService
} from '../../definitions/bp/detail/st-third-party-transfer-definition.service';

@Injectable({
  providedIn: 'root'
})
export class TmDetailHandlerService {
  constructor(
    private transactionManagerCommon: TmCommonService,
    private otDefinitionService: StOwnTransferDefinitionService,
    private thirdPartyTransferDefinitionService: StThirdTransferDefinitionService,
    private donationTransferDefinitionService: StDonationTransferDefinitionService,
    private achTransferDefinitionService: StAchTransferDefinitionService,
    private thirdPartyLoanDefinitionService: StThirdPartyTransferDefinitionService,
    private achMassiveDefinitionService: StAchMassiveTransferDefinitionService,

  ) {
  }

  goToDetailTransaction(params: ITMServiceDetail, achAssociatedAccounts: IAchAccount[] = []) {
    const { transactionSelected } = params ?? {};

    if (!this.transactionManagerCommon.isSampleTransaction(transactionSelected?.serviceCode)) {
      this.navigateToVoucherForSpecialTransactionsHandler({
        ...params,
        achAssociatedAccounts,
      });
      return;
    }

    this.navigateToSampleTransactions(params);
  }

  private navigateToVoucherHandler(params: ITMNavigateHandlerParams) {
    const { transactionSelected: { serviceCode } } = params ?? {};

    const THIRD_PARTY_CODE = this.transactionManagerCommon.THIRD_TRANSFER_VALUE;
    const transactionMapped = {
      [ETMServiceCode.OWN_TRANSFER2]: () => this.otDefinitionService.getTransactionDetail(params),
      [THIRD_PARTY_CODE]: () => this.thirdPartyTransferDefinitionService.getTransactionDetail(params),
      [ETMServiceCode.DONATION2]: () => this.donationTransferDefinitionService.getTransactionDetail(params),
    }

    const transactionHandler = transactionMapped[serviceCode];

    if (!transactionHandler) return;

    transactionHandler();
  }

  private navigateToSampleTransactions(params: ITMServiceDetail) {
    this.transactionManagerCommon.getAccountsToDetail({
      transactionSelected: params?.transactionSelected,
      isTransactionHistoryMode: params?.isTransactionHistoryMode,
      navigateHandler: (params: ITMNavigateHandlerParams) => this.navigateToVoucherHandler(params),
      position: params?.position as number,
    });
  }

  private navigateToVoucherForSpecialTransactionsHandler(params: ITMNavigateHandlerExtendedParams) {
    const { transactionSelected: { serviceCode }, achAssociatedAccounts } = params ?? {};

    const transactionMapped = {
      [ETMServiceCode.ACH_TRANSFER2]: () => this.achTransferDefinitionService.getTransactionDetail(params, achAssociatedAccounts),
      [ETMServiceCode.ACH_MASSIVE_TRANSFERENCE2]: () => this.achMassiveDefinitionService.getTransactionDetail(params),
      [ETMServiceCode.THIRD_PARTY_PAYMENT_LOAN]: () => this.thirdPartyLoanDefinitionService.getTransactionDetail(params),
    }

    const transactionHandler = transactionMapped[serviceCode];

    if (!transactionHandler) return;

    transactionHandler();
  }

}
