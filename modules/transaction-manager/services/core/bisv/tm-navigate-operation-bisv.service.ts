import { Injectable } from '@angular/core';
import { TmCommonService } from '../../tm-common.service';
import {
  StOpAchBisvTransferDefinitionService
} from '../../definitions/bisv/operations/st-op-ach-bisv-transfer-definition.service';
import {
  StOpOwnTransferDefinitionService
} from '../../definitions/base/operations/st-op-own-transfer-definition.service';
import {
  StOpThirdPartyTransferDefinitionService
} from '../../definitions/base/operations/st-op-third-party-transfer-definition.service';
import {
  ITMNavigateHandlerParams,
  ITMServiceDetailAccountOperation, ITMServiceTransactionOperationExtended
} from '../../../interfaces/transaction-manager-navigate.interface';
import { IAchAccount } from '../../../../transfer/modules/transfer-ach/interfaces/ach-account-interface';
import { ETMServiceCode } from '../../../enums/service-code.enum';
import {
  StOpAch365SipaBisvTransferDefinitionService
} from '../../definitions/bisv/operations/st-op-ach-365-sipa-bisv-transfer-definition.service';
import {
  StOpPayrollPaymentBisvDefinitionService
} from '../../definitions/bisv/operations/st-op-payroll-payment-bisv-definition.service';
import {
  StOpAchUniMultipleDefinitionService
} from '../../definitions/bisv/operations/st-op-ach-uni-multiple-definition.service';
import { TmCoreUtilsService } from '../utils/tm-core-utils.service';
import { StOpSupplierPaymentBisvService } from '../../definitions/bisv/operations/st-op-supplier-payment-bisv.service';

@Injectable({
  providedIn: 'root'
})
export class TmNavigateOperationBisvService {

  constructor(
    private transactionManagerCommon: TmCommonService,
    private stOpAchDefinitionService: StOpAchBisvTransferDefinitionService,
    private stOpOwnTransferDefinitionService: StOpOwnTransferDefinitionService,
    private stOpThirdTransferDefinitionService: StOpThirdPartyTransferDefinitionService,
    private stOpAchSipaTransferDefinitionService: StOpAch365SipaBisvTransferDefinitionService,
    private stOpAchUniMultipleDefinitionService: StOpAchUniMultipleDefinitionService,
    private stOpPaymentPayrollDefinitionService: StOpPayrollPaymentBisvDefinitionService,
    private stOpPaymentSupplier: StOpSupplierPaymentBisvService,
    private coreUtils: TmCoreUtilsService,
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
      [ETMServiceCode.ACH_TRANSFER_MANAGER]: () => this.stOpAchDefinitionService.navigateToOperation(params),
      [ETMServiceCode.PAYMENT_OF_PAYROLL]: () => this.stOpPaymentPayrollDefinitionService.navigateToOperation(params),
      [ETMServiceCode.ACH_365_SIPA]: () => this.stOpAchSipaTransferDefinitionService.navigateToOperation(params),
      [ETMServiceCode.ACH_MASSIVE_TRANSFERENCE]: () => this.stOpAchUniMultipleDefinitionService.navigateToOperation(params),
      [ETMServiceCode.BISV_PAYMENT_SUPPLIER]: () => this.stOpPaymentSupplier.navigateToOperation(params),
    }

    const transactionHandler = transactionMapped[serviceCode];

    if (!transactionHandler) {
      this.coreUtils.openModalTransactionNotConfigured();
      return;
    }

    transactionHandler();

  }

  private navigateToVoucherHandler(params: ITMNavigateHandlerParams) {
    const { transactionSelected: { serviceCode } } = params ?? {};

    const THIRD_PARTY_CODE = this.transactionManagerCommon.THIRD_TRANSFER_VALUE;
    const transactionMapped = {
      [ETMServiceCode.OWN_TRANSFER2]: () => this.stOpOwnTransferDefinitionService.navigateToOperation(params),
      [THIRD_PARTY_CODE]: () => this.stOpThirdTransferDefinitionService.navigateToOperation(params),
    }

    const transactionHandler = transactionMapped[serviceCode];

    if (!transactionHandler) {
      this.coreUtils.openModalTransactionNotConfigured();
      return;
    }

    transactionHandler();
  }

}
