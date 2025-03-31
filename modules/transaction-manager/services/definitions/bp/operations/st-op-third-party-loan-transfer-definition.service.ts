import { Injectable } from '@angular/core';
import {
  ITMOperationHandlerParamsToSpecialTransaction
} from '../../../../interfaces/transaction-manager-navigate.interface';
import { TmdConfirmationVoucherManagerService } from '../../../manager/bp/tmd-confirmation-voucher-manager.service';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { SplitTransactionDetailService } from '../../../manager/bp/split-transaction-detail.service';
import { TmCommonService } from '../../../tm-common.service';
import { UtilService } from '../../../../../../service/common/util.service';
import { ITransactionManagerAccountDetail } from '../../../../interfaces/transaction-manger.interface';
import { IFlowError } from '../../../../../../models/error.interface';
import {
  ENavigateProtectionParameter, ETPLPaymentUrlNavigationCollection
} from '../../../../../loan/modules/third-party-loans/enum/navigate-protection-parameter.enum';

@Injectable({
  providedIn: 'root'
})
export class StOpThirdPartyLoanTransferDefinitionService {

  constructor(
    private transactionManagerConfirmation: TmdConfirmationVoucherManagerService,
    private router: Router,
    private parameterManager: ParameterManagementService,
    private splitTransactionDetail: SplitTransactionDetailService,
    private transactionManagerCommon: TmCommonService,
    private utils: UtilService,
  ) { }

  navigateToOperation(params: ITMOperationHandlerParamsToSpecialTransaction) {
    const {
      transactionSelected,
      position,
      action } = params ?? {};
    const transactionDetail = this.splitTransactionDetail.getTransactionDetailForThirdPartyPaymentLoan(transactionSelected?.request);

    this.utils.showLoader();
    this.transactionManagerCommon.getSourceAccount(transactionDetail?.sourceAccount)
      .subscribe(response => {
        const dataToVoucher = this.transactionManagerConfirmation.buildParametersToThirdPartyLoanPayment({
          sourceAccount: response as ITransactionManagerAccountDetail,
          message: (response as IFlowError)?.message ?? '',
          transaction: transactionSelected,
        });

        this.parameterManager.sendParameters({
          navigateStateParameters: {
            detail: dataToVoucher?.transactionDetail,
            data: dataToVoucher?.structure,
            position,
            operation: action,
            transactionSelected,
          },
          navigationProtectedParameter: ENavigateProtectionParameter.VOUCHER_ST_OPERATIONS,
        });

        this.router.navigate([ETPLPaymentUrlNavigationCollection.SIGNATURE_TRACKING_OPERATION]).finally(() => this.utils.hideLoader());
      });
  }
}
