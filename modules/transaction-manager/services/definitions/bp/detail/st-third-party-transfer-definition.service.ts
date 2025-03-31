import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from '../../../../../../service/common/util.service';
import { TmCommonService } from '../../../tm-common.service';
import { SplitTransactionDetailService } from '../../../manager/bp/split-transaction-detail.service';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { TmdConfirmationVoucherManagerService } from '../../../manager/bp/tmd-confirmation-voucher-manager.service';
import { ITMServiceDetail } from '../../../../interfaces/transaction-manager-navigate.interface';
import {
  ENavigateProtectionParameter, ETPLPaymentUrlNavigationCollection
} from '../../../../../loan/modules/third-party-loans/enum/navigate-protection-parameter.enum';
import { ITransactionManagerAccountDetail } from '../../../../interfaces/transaction-manger.interface';
import { IFlowError } from '../../../../../../models/error.interface';

@Injectable({
  providedIn: 'root'
})
export class StThirdPartyTransferDefinitionService {

  constructor(
    private router: Router,
    private tmConfirmationParameters: TmdConfirmationVoucherManagerService,
    private parameterManager: ParameterManagementService,
    private utils: UtilService,
    private splitTransactionDetail: SplitTransactionDetailService,
    private tmCommonService: TmCommonService,

  ) { }

  getTransactionDetail(params: ITMServiceDetail) {
    const {
      transactionSelected,
      isTransactionHistoryMode,
      position } = params ?? {};
    const transactionDetail = this.splitTransactionDetail.getTransactionDetailForThirdPartyPaymentLoan(transactionSelected?.request);
    const parameter = isTransactionHistoryMode ? ENavigateProtectionParameter.VOUCHER_HISTORY_TRANSACTION : ENavigateProtectionParameter.VOUCHER_ST_TRANSACTION_DETAIL;

    this.utils.showLoader();
    this.tmCommonService.getSourceAccount(transactionDetail?.sourceAccount)
      .subscribe(response => {
        const dataToVoucher = this.tmConfirmationParameters.buildParametersToThirdPartyLoanPayment({
          sourceAccount: response as ITransactionManagerAccountDetail,
          message: (response as IFlowError)?.message ?? '',
          transaction: transactionSelected,
          isTHMode: isTransactionHistoryMode,
        });

        this.parameterManager.sendParameters({
          navigateStateParameters: {
            detail: dataToVoucher?.transactionDetail,
            data: dataToVoucher?.structure,
            position: position,
            transactionSelected: dataToVoucher?.transactionSelected,
          },
          navigationProtectedParameter: parameter,
        });

        if (isTransactionHistoryMode) {
          this.router.navigate([ETPLPaymentUrlNavigationCollection.TRANSACTION_HISTORY_VOUCHER]).finally(() => this.utils.hideLoader());
          return;
        }

        this.router.navigate([ETPLPaymentUrlNavigationCollection.SIGNATURE_TRACKING_VOUCHER]).finally(() => this.utils.hideLoader());
      });
  }
}
