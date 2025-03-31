import { Injectable } from '@angular/core';
import { UtilService } from '../../../../../../service/common/util.service';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import {
  TmdBisvConfirmationVoucherManagerService
} from '../../../manager/bisv/tmd-bisv-confirmation-voucher-manager.service';
import { TmCommonService } from '../../../tm-common.service';
import { StBisvSplitTransactionManagerService } from '../../../manager/bisv/st-bisv-split-transaction-manager.service';
import { ITMServiceDetailAccountOperation } from '../../../../interfaces/transaction-manager-navigate.interface';
import { ITransactionManagerAccountDetail } from '../../../../interfaces/transaction-manger.interface';
import { IFlowError } from '../../../../../../models/error.interface';
import {
  ETmAchUniProtectedNavigation,
  ETmAchUniUrlCollection
} from '../../../../../transfer/modules/transfer-ach-uni-multiple/enum/ach-uni-url-collection';

@Injectable({
  providedIn: 'root'
})
export class StOpAchUniMultipleDefinitionService {
  constructor(
    private router: Router,
    private utils: UtilService,
    private parameterManager: ParameterManagementService,
    private tmCommonService: TmCommonService,
    private splitTransactionDetail: StBisvSplitTransactionManagerService,
    private tmConfirmationVoucherService: TmdBisvConfirmationVoucherManagerService,
  ) { }

  navigateToOperation(parameters: ITMServiceDetailAccountOperation) {
    const { transactionSelected, action, position  } = parameters;

    this.utils.showLoader();
    const transactionDetail = this.splitTransactionDetail.getDetailTransactionMultipleUniACH(transactionSelected?.request);

    this.tmCommonService.getSourceAccount(transactionDetail?.sourceAccount)
      .subscribe({
        next: (response) => {
          const dataToVoucher = this.tmConfirmationVoucherService.buildParametersToAchMultipleUni({
            sourceAccount: response as ITransactionManagerAccountDetail,
            message: (response as IFlowError)?.message ?? '',
            transaction: transactionSelected,
          });

          this.parameterManager.sendParameters({
            navigateStateParameters: {
              position,
              action,
              sourceAccount: dataToVoucher.sourceAccount,
              transactionSelected,
              transactionDetail,
            },
            navigationProtectedParameter: ETmAchUniProtectedNavigation.ST_OPERATION,
          });

          this.router.navigate([ETmAchUniUrlCollection.ST_OPERATION]).finally(() => this.utils.hideLoader());
        },
      });
  }
}
