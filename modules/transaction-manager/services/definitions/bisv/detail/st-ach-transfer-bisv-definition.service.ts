import { Injectable } from '@angular/core';
import { UtilService } from '../../../../../../service/common/util.service';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { ITMServiceDetail } from '../../../../interfaces/transaction-manager-navigate.interface';
import {
  TmdBisvConfirmationVoucherManagerService
} from '../../../manager/bisv/tmd-bisv-confirmation-voucher-manager.service';
import { EACHServiceMapped } from '../../../../../transfer/enum/ach-transaction.enum';
import { StBisvSplitTransactionManagerService } from '../../../manager/bisv/st-bisv-split-transaction-manager.service';
import { EM365UrlCollection } from '../../../../../transfer/modules/transfer-365-movil/enum/url-collection.enum';
import { E365UrlCollection } from '../../../../../transfer/modules/transfer-365/enum/url-collection.enum';
import {
  AchUniTransferUrlNavigationCollection
} from '../../../../../transfer/modules/transfer-ach-uni/enums/ach-uni-navigation-parameter.enum';
import { T365RouteProtected } from '../../../../../transfer/modules/transfer-365/enum/route-protected.enum';
import { S365RouteProtected } from '../../../../../transfer/modules/transfer-365-movil/enum/route-protected.enum';
import { TmCoreUtilsService } from '../../../core/utils/tm-core-utils.service';
import { TmCommonService } from '../../../tm-common.service';
import {
  StCommonTransactionService
} from '../../../../modules/signature-tracking/services/execution/st-common-transaction.service';
import { ESignatureTrackingTypeAction } from '../../../../modules/signature-tracking/enum/st-transaction-status.enum';

@Injectable({
  providedIn: 'root'
})
export class StAchTransferBisvDefinitionService {

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

  getTransactionDetail(params: ITMServiceDetail) {
    const { transactionSelected } = params ?? {};

    const { typeService } = this.splitTransactionDetail.getTransactionDetailForACHInBiesProfile(transactionSelected?.request);

    const handlerDetailTransactionMapped = {
      [EACHServiceMapped.UNI] : () => this.manageGetTransactionDetailForUni(params),
      // [EACHServiceMapped.MOVIL_365] : () => this.manageGetTransactionDetailFor365Movil(params),
      // [EACHServiceMapped.NORMAL_365] : () => this.manageGetTransactionDetailFor365(params),
    }


    const handler = handlerDetailTransactionMapped[typeService];

    if (!handler) {
      const { position, transactionSelected } = params;
      this.tmCommon.handleNavigateToEmbbededBanking({
        tabPosition: this.stCommon.getCurrentStep(position ?? 0),
        action: ESignatureTrackingTypeAction.VIEW,
        reference: transactionSelected?.reference,
        service: transactionSelected?.serviceCode,
      });
      // this.coreUtils.openModalTransactionNotConfigured();
      return;
    }

    this.utils.showLoader();
    handler();
  }

  private manageGetTransactionDetailFor365Movil(params: ITMServiceDetail) {
    const { position, isTransactionHistoryMode, transactionSelected } = params;

    const parameter = isTransactionHistoryMode ? '' : S365RouteProtected.ST_DETAIL;

    const dataToVoucher = this.tmConfirmationVoucher.buildParametersToACHMovil365Transaction({
      transaction: transactionSelected,
    });

    this.parameterManager.sendParameters({
      navigateStateParameters: {
        ...dataToVoucher,
        position,
      },
      navigationProtectedParameter: parameter,
    });


    if (isTransactionHistoryMode) {
      this.router.navigate(['']).finally(() => this.utils.hideLoader());
      return;
    }

    this.router.navigate([EM365UrlCollection.ST_DETAIL]).finally(() => this.utils.hideLoader());
  }

  private manageGetTransactionDetailFor365(params: ITMServiceDetail) {
    const { position, isTransactionHistoryMode, transactionSelected } = params;
    const parameter = isTransactionHistoryMode ? '' : T365RouteProtected.ST_DETAIL;

    const dataToVoucher = this.tmConfirmationVoucher.buildParametersToACH365Transaction({
      transaction: transactionSelected,
    });

    this.parameterManager.sendParameters({
      navigateStateParameters: {
        ...dataToVoucher,
        position,
      },
      navigationProtectedParameter: parameter,
    });


    if (isTransactionHistoryMode) {
      this.router.navigate(['']).finally(() => this.utils.hideLoader());
      return;
    }

    this.router.navigate([E365UrlCollection.ST_DETAIL]).finally(() => this.utils.hideLoader());
  }

  private manageGetTransactionDetailForUni(params: ITMServiceDetail) {
    const { position, isTransactionHistoryMode, transactionSelected } = params;

    const dataToVoucher = this.tmConfirmationVoucher.buildParametersToACHBiesTransaction({
      transaction: transactionSelected,
    });

    this.parameterManager.sendParameters({
      navigateStateParameters: {
        ...dataToVoucher,
        position,
      },
      navigationProtectedParameter: '',
    });

    if (isTransactionHistoryMode) {
      this.router.navigate(['']).finally(() => this.utils.hideLoader());
      return;
    }

    this.router.navigate([AchUniTransferUrlNavigationCollection.ST_DETAIL]).finally(() => this.utils.hideLoader());
  }
}
