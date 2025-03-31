import { Injectable } from '@angular/core';
import { UtilService } from '../../../../../../service/common/util.service';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { TmdConfirmationVoucherManagerService } from '../../../manager/bp/tmd-confirmation-voucher-manager.service';
import { ITMNavigateHandlerParams } from '../../../../interfaces/transaction-manager-navigate.interface';
import {
  EOwnTransferProtectedNavigation, EOwnTransferUrlNavigationCollection
} from '../../../../../transfer/modules/transfer-own/enum/navigation-parameter.enum';

@Injectable({
  providedIn: 'root'
})
export class StOwnTransferDefinitionService {

  constructor(
    private utils: UtilService,
    private router: Router,
    private parameterManager: ParameterManagementService,
    private tmConfirmationParameters: TmdConfirmationVoucherManagerService,
  ) { }

  getTransactionDetail(params: ITMNavigateHandlerParams) {
    const {
      transactionSelected,
      transactionResponse,
      isTransactionHistoryMode } = params ?? {};

    const dataToVoucher = this.tmConfirmationParameters.buildParametersToTransferOwn({
      accountDebited: transactionResponse[0],
      accountCredited: transactionResponse[1],
      transaction: transactionSelected,
    });

    this.parameterManager.sendParameters({
      navigateStateParameters: {
        ...dataToVoucher,
        position: params?.position
      },
      navigationProtectedParameter: EOwnTransferProtectedNavigation.CONFIRMATION,
    });

    if (isTransactionHistoryMode) {
      this.router.navigate([EOwnTransferUrlNavigationCollection.TRANSACTION_HISTORY_VOUCHER]).finally(() => this.utils.hideLoader());
      return;
    }


    this.router.navigate([EOwnTransferUrlNavigationCollection.SIGNATURE_TRACKING_VOUCHER]).finally(() => this.utils.hideLoader());
  }
}
