import { Injectable } from '@angular/core';
import { UtilService } from '../../../../../../service/common/util.service';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { ITMServiceDetail } from '../../../../interfaces/transaction-manager-navigate.interface';
import { ITransactionManagerAccountDetail } from '../../../../interfaces/transaction-manger.interface';
import { IFlowError } from '../../../../../../models/error.interface';
import { TmCommonService } from '../../../tm-common.service';
import { SPPMRoutes } from '../../../../../payroll/manager-payroll/enums/pmp-routes.enum';
import {
  TmdBisvConfirmationVoucherManagerService
} from '../../../manager/bisv/tmd-bisv-confirmation-voucher-manager.service';
import { StBisvSplitTransactionManagerService } from '../../../manager/bisv/st-bisv-split-transaction-manager.service';

@Injectable({
  providedIn: 'root'
})
export class StPayrollPaymentBisvDefinitionService {

  constructor(
    private utils: UtilService,
    private router: Router,
    private parameterManager: ParameterManagementService,
    private tmCommonService: TmCommonService,
    private tmConfirmationVoucherService: TmdBisvConfirmationVoucherManagerService,
    private splitTransactionDetail: StBisvSplitTransactionManagerService,
  ) { }

  getTransactionDetail(params: ITMServiceDetail) {
    const { transactionSelected, isTransactionHistoryMode, position } = params;

    this.utils.showLoader();
    const transactionDetail = this.splitTransactionDetail.getDetailTransactionPaymentOfPayroll(transactionSelected?.request);
    this.tmCommonService.getSourceAccount(transactionDetail?.sourceAccountNumber)
      .subscribe({
        next: (response) => {
          const dataToVoucher = this.tmConfirmationVoucherService.buildParametersToPaymentOfPayroll({
            sourceAccount: response as ITransactionManagerAccountDetail,
            message: (response as IFlowError)?.message ?? '',
            transaction: transactionSelected,
            isTHMode: isTransactionHistoryMode,
          });

          this.parameterManager.sendParameters({
            navigateStateParameters: {
              sourceAccount: dataToVoucher?.sourceAccount,
              position: position,
              transactionSelected: dataToVoucher?.transactionSelected,
              transactionDetail: dataToVoucher?.transactionDetail,
            },
            navigationProtectedParameter: null, // NOTE:  Should change
          });
          if (isTransactionHistoryMode) {
            this.router.navigate([SPPMRoutes.ST_PAYMENT_DETAIL_HISTORY_TRANSACTION]).finally(() => this.utils.hideLoader());
            return;
          }

          this.router.navigate([SPPMRoutes.ST_PAYMENT_DETAIL]).finally(() => this.utils.hideLoader());
        },
      });
  }
}
