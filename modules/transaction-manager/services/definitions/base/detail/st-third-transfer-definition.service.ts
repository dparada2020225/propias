import { Injectable } from '@angular/core';
import { UtilService } from '../../../../../../service/common/util.service';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { TmdConfirmationVoucherManagerService } from '../../../manager/bp/tmd-confirmation-voucher-manager.service';
import { ITMNavigateHandlerParams } from '../../../../interfaces/transaction-manager-navigate.interface';
import {
  EThirdTransferNavigateParameters, EThirdTransferUrlNavigationCollection
} from '../../../../../transfer/modules/transfer-third/enums/third-transfer-navigate-parameters.enum';

@Injectable({
  providedIn: 'root'
})
export class StThirdTransferDefinitionService {

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


    const dataToVoucher = this.tmConfirmationParameters.buildParametersToTransferThird({
      accountDebited: transactionResponse[0],
      accountCredited: transactionResponse[1],
      transaction: transactionSelected,
    });

    this.parameterManager.sendParameters({
      navigateStateParameters: {
        ...dataToVoucher,
        position: params?.position
      },
      navigationProtectedParameter: EThirdTransferNavigateParameters.TRANSFER_VOUCHER,
    });

    if (isTransactionHistoryMode) {
      this.router.navigate([EThirdTransferUrlNavigationCollection.TRANSACTION_HISTORY_VOUCHER]).finally(() => this.utils.hideLoader());
      return;
    }


    this.router.navigate([EThirdTransferUrlNavigationCollection.SIGNATURE_TRACKING_VOUCHER]).finally(() => this.utils.hideLoader());
  }
}
