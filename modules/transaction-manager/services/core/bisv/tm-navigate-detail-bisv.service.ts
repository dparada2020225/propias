import { Injectable } from '@angular/core';
import { ITMNavigateHandlerParams, ITMServiceDetail } from '../../../interfaces/transaction-manager-navigate.interface';
import { TmCommonService } from '../../tm-common.service';
import { ETMServiceCode } from '../../../enums/service-code.enum';
import { StOwnTransferDefinitionService } from '../../definitions/base/detail/st-own-transfer-definition.service';
import { StThirdTransferDefinitionService } from '../../definitions/base/detail/st-third-transfer-definition.service';
import {
  StPayrollPaymentBisvDefinitionService
} from '../../definitions/bisv/detail/st-payroll-payment-bisv-definition.service';
import {
  StAchTransferBisvDefinitionService
} from '../../definitions/bisv/detail/st-ach-transfer-bisv-definition.service';
import {
  StAch365SipaBisvDefinitionService
} from '../../definitions/bisv/detail/st-ach-365-sipa-bisv-definition.service';
import {
  StAchUniMultipleDefinitionService
} from '../../definitions/bisv/detail/st-ach-uni-multiple-definition.service';
import { TmCoreUtilsService } from '../utils/tm-core-utils.service';
import {
  StSupplierPaymentBisvDefinitionService
} from '../../definitions/bisv/detail/st-supplier-payment-bisv-definition.service';

@Injectable({
  providedIn: 'root'
})
export class TmNavigateDetailBisvService {
  constructor(
    private transactionManagerCommon: TmCommonService,
    private paymentOfPayrollDefinitionService: StPayrollPaymentBisvDefinitionService,
    private ownTransferDefinitionService: StOwnTransferDefinitionService,
    private thirdTransferDefinitionService: StThirdTransferDefinitionService,
    private achTransferDefinitionService: StAchTransferBisvDefinitionService,
    private ach365SipaTransferDefinitionService: StAch365SipaBisvDefinitionService,
    private achUniMultipleDefinitionService: StAchUniMultipleDefinitionService,
    private supplierPaymentDefinitionService: StSupplierPaymentBisvDefinitionService,
    private coreUtils: TmCoreUtilsService,
  ) { }

  goToDetailTransaction(params: ITMServiceDetail) {
    const { transactionSelected } = params ?? {};

    if (!this.transactionManagerCommon.isSampleTransaction(transactionSelected?.serviceCode)) {
      this.navigateToVoucherForSpecialTransactionsHandler(params);
      return;
    }

    this.navigateToSampleTransactions(params);
  }

  private navigateToVoucherHandler(params: ITMNavigateHandlerParams) {
    const { transactionSelected: { serviceCode } } = params ?? {};

    const transactionMapped = {
      [ETMServiceCode.OWN_TRANSFER2]: () => this.ownTransferDefinitionService.getTransactionDetail(params),
      [ETMServiceCode.THIRD_TRANSFER]: () => this.thirdTransferDefinitionService.getTransactionDetail(params),
    }

    const transactionHandler = transactionMapped[serviceCode];

    if (!transactionHandler) {
      this.coreUtils.openModalTransactionNotConfigured();
      return;
    }

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

  private navigateToVoucherForSpecialTransactionsHandler(params: ITMServiceDetail) {
    const { transactionSelected: { serviceCode } } = params ?? {};

    const transactionMapped = {
      [ETMServiceCode.PAYMENT_OF_PAYROLL]: () => this.paymentOfPayrollDefinitionService.getTransactionDetail(params),
      [ETMServiceCode.ACH_TRANSFER_MANAGER]: () => this.achTransferDefinitionService.getTransactionDetail(params),
      [ETMServiceCode.ACH_365_SIPA]: () => this.ach365SipaTransferDefinitionService.getTransactionDetail(params),
      [ETMServiceCode.ACH_MASSIVE_TRANSFERENCE]: () => this.achUniMultipleDefinitionService.getTransactionDetail(params),
      [ETMServiceCode.ACH_MASSIVE_TRANSFERENCE]: () => this.achUniMultipleDefinitionService.getTransactionDetail(params),
      [ETMServiceCode.BISV_PAYMENT_SUPPLIER]: () => this.supplierPaymentDefinitionService.getTransactionDetail(params),
    }

    const transactionHandler = transactionMapped[serviceCode];

    if (!transactionHandler) {
      this.coreUtils.openModalTransactionNotConfigured();
      return;
    }

    transactionHandler();
  }

}
