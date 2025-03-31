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
import { SPRoutes } from '../../../../../payment-suppliers/managment-payments/enums/ps-routes.enum';

@Injectable({
  providedIn: 'root'
})
export class StOpSupplierPaymentBisvService {

  constructor(
    private utils: UtilService,
    private router: Router,
    private parameterManager: ParameterManagementService,
    private transactionManagerConfirmation: TmdBisvConfirmationVoucherManagerService,
    private tmCommonService: TmCommonService,
    private stSplitService: StBisvSplitTransactionManagerService,
  ) { }

  navigateToOperation(parameters: ITMServiceDetailAccountOperation) {
    const { transactionSelected, action, position  } = parameters;

    this.utils.showLoader();
    const transactionDetail = this.stSplitService.getDetailTransactionPaymentOfPayroll(transactionSelected?.request);

    this.tmCommonService.getSourceAccount(transactionDetail?.sourceAccountNumber)
      .subscribe({
        next: (response) => {
          const dataToVoucher = this.transactionManagerConfirmation.buildParametersToPaymentOfPayroll({
            sourceAccount: response as ITransactionManagerAccountDetail,
            message: (response as IFlowError)?.message ?? '',
            transaction: transactionSelected,
          });

          this.parameterManager.sendParameters({
            navigateStateParameters: {
              position,
              action,
              sourceAccount: dataToVoucher?.sourceAccount,
              transactionSelected: dataToVoucher?.transactionSelected,
              transactionDetail: dataToVoucher?.transactionDetail,
            },
            navigationProtectedParameter: null,
          });

          this.router.navigate([SPRoutes.ST_PAYMENT_SUPPLIER_OPERATION]).finally(() => this.utils.hideLoader());
        },
      });
  }
}
