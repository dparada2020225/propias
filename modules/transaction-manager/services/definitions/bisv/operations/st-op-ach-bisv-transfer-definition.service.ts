import { Injectable } from '@angular/core';
import {
  ITMServiceDetailAccountOperation
} from '../../../../interfaces/transaction-manager-navigate.interface';
import { UtilService } from '../../../../../../service/common/util.service';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import {
  TmdBisvConfirmationVoucherManagerService
} from '../../../manager/bisv/tmd-bisv-confirmation-voucher-manager.service';
import { EM365UrlCollection } from '../../../../../transfer/modules/transfer-365-movil/enum/url-collection.enum';
import { E365UrlCollection } from '../../../../../transfer/modules/transfer-365/enum/url-collection.enum';
import { EACHServiceMapped } from '../../../../../transfer/enum/ach-transaction.enum';
import { StBisvSplitTransactionManagerService } from '../../../manager/bisv/st-bisv-split-transaction-manager.service';
import {
  AchUniTransferUrlNavigationCollection
} from '../../../../../transfer/modules/transfer-ach-uni/enums/ach-uni-navigation-parameter.enum';
import { T365RouteProtected } from '../../../../../transfer/modules/transfer-365/enum/route-protected.enum';
import { S365RouteProtected } from '../../../../../transfer/modules/transfer-365-movil/enum/route-protected.enum';
import { TmCoreUtilsService } from '../../../core/utils/tm-core-utils.service';
import {
  StCommonTransactionService
} from '../../../../modules/signature-tracking/services/execution/st-common-transaction.service';
import { TmCommonService } from '../../../tm-common.service';

@Injectable({
  providedIn: 'root'
})
export class StOpAchBisvTransferDefinitionService {

  constructor(
    private utils: UtilService,
    private router: Router,
    private parameterManager: ParameterManagementService,
    private tmConfirmationVoucher: TmdBisvConfirmationVoucherManagerService,
    private splitTransactionDetail: StBisvSplitTransactionManagerService,
    private coreUtils: TmCoreUtilsService,
    private tmCommon: TmCommonService,
    private stCommon: StCommonTransactionService,
  ) { }

  navigateToOperation(params: ITMServiceDetailAccountOperation) {
    const { transactionSelected } = params ?? {};

    const { typeService } = this.splitTransactionDetail.getTransactionDetailForACHInBiesProfile(transactionSelected?.request);

    const handlerDetailTransactionMapped = {
      [EACHServiceMapped.UNI] : () => this.manageGetTransactionDetailForUni(params),
      // [EACHServiceMapped.MOVIL_365] : () => this.manageGetTransactionDetailFor365Movil(params),
      // [EACHServiceMapped.NORMAL_365] : () => this.manageGetTransactionDetailFor365(params),
    }

    const handler = handlerDetailTransactionMapped[typeService];

    if (!handler) {
      const { transactionSelected, position, action } = params;
      this.tmCommon.handleNavigateToEmbbededBanking({
        tabPosition: this.stCommon.getCurrentStep(position ?? 0),
        action: action,
        reference: transactionSelected?.reference,
        service: transactionSelected?.serviceCode,
      });
      // this.coreUtils.openModalTransactionNotConfigured();
      return;
    }

    this.utils.showLoader();
    handler();
  }

  private manageGetTransactionDetailFor365Movil(params: ITMServiceDetailAccountOperation) {
    const { position, transactionSelected, action } = params;

    const dataToVoucher = this.tmConfirmationVoucher.buildParametersToACHMovil365Transaction({
      transaction: transactionSelected,
    });

    this.parameterManager.sendParameters({
      navigateStateParameters: {
        ...dataToVoucher,
        position,
        action,
      },
      navigationProtectedParameter: S365RouteProtected.ST_OPERATION,
    });

    this.router.navigate([EM365UrlCollection.ST_OPERATION]).finally(() => this.utils.hideLoader());
  }

  private manageGetTransactionDetailFor365(params: ITMServiceDetailAccountOperation) {
    const { position, transactionSelected, action } = params;

    const dataToVoucher = this.tmConfirmationVoucher.buildParametersToACH365Transaction({
      transaction: transactionSelected,
    });

    this.parameterManager.sendParameters({
      navigateStateParameters: {
        ...dataToVoucher,
        position,
        action,
      },
      navigationProtectedParameter: T365RouteProtected.ST_OPERATION,
    });

    this.router.navigate([E365UrlCollection.ST_OPERATION]).finally(() => this.utils.hideLoader());
  }

  private manageGetTransactionDetailForUni(params: ITMServiceDetailAccountOperation) {
    const { position, transactionSelected, action } = params;

    const dataToVoucher = this.tmConfirmationVoucher.buildParametersToACHBiesTransaction({
      transaction: transactionSelected,
    });

    this.parameterManager.sendParameters({
      navigateStateParameters: {
        ...dataToVoucher,
        position,
        action,
      },
      navigationProtectedParameter: '',
    });

    this.router.navigate([AchUniTransferUrlNavigationCollection.ST_OPERATION]).finally(() => this.utils.hideLoader());
  }
}
