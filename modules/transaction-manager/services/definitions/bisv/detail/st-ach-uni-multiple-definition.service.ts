import { Injectable } from '@angular/core';
import { ITMServiceDetail } from '../../../../interfaces/transaction-manager-navigate.interface';
import { Router } from '@angular/router';
import { UtilService } from '../../../../../../service/common/util.service';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { TmCommonService } from '../../../tm-common.service';
import { StBisvSplitTransactionManagerService } from '../../../manager/bisv/st-bisv-split-transaction-manager.service';
import { ITransactionManagerAccountDetail } from '../../../../interfaces/transaction-manger.interface';
import { IFlowError } from '../../../../../../models/error.interface';
import {
  TmdBisvConfirmationVoucherManagerService
} from '../../../manager/bisv/tmd-bisv-confirmation-voucher-manager.service';
import {
  ETmAchUniProtectedNavigation,
  ETmAchUniUrlCollection
} from '../../../../../transfer/modules/transfer-ach-uni-multiple/enum/ach-uni-url-collection';
import {
  IStAchUniState
} from '../../../../../transfer/modules/transfer-ach-uni-multiple/interfaces/st-uni-operations.interface';

@Injectable({
  providedIn: 'root'
})
export class StAchUniMultipleDefinitionService {

  constructor(
    private router: Router,
    private utils: UtilService,
    private parameterManager: ParameterManagementService,
    private tmCommonService: TmCommonService,
    private splitTransactionDetail: StBisvSplitTransactionManagerService,
    private tmConfirmationVoucherService: TmdBisvConfirmationVoucherManagerService,
  ) { }

  getTransactionDetail(params: ITMServiceDetail) {
    const { transactionSelected, isTransactionHistoryMode, position } = params;

    this.utils.showLoader();
    const transactionDetail = this.splitTransactionDetail.getDetailTransactionMultipleUniACH(transactionSelected?.request);
    this.tmCommonService.getSourceAccount(transactionDetail.sourceAccount)
      .subscribe({
        next: (response) => {
          const dataToVoucher = this.tmConfirmationVoucherService.buildParametersToAchMultipleUni({
            sourceAccount: response as ITransactionManagerAccountDetail,
            message: (response as IFlowError)?.message ?? '',
            transaction: transactionSelected,
            isTHMode: isTransactionHistoryMode,
          });

          this.parameterManager.sendParameters({
            navigateStateParameters: {
              sourceAccount: dataToVoucher.sourceAccount,
              position: position,
              transactionSelected,
              transactionDetail,
            } as IStAchUniState,
            navigationProtectedParameter: ETmAchUniProtectedNavigation.ST_DETAIL,
          });

          if (isTransactionHistoryMode) {
            this.router.navigate([ETmAchUniUrlCollection.ST_DETAIL]).finally(() => this.utils.hideLoader());
            return;
          }

          this.router.navigate([ETmAchUniUrlCollection.ST_DETAIL]).finally(() => this.utils.hideLoader());
        },
      });
  }
}
