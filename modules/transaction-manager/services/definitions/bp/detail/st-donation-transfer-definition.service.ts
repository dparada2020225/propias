import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { TmdConfirmationVoucherManagerService } from '../../../manager/bp/tmd-confirmation-voucher-manager.service';
import { ITMNavigateHandlerParams } from '../../../../interfaces/transaction-manager-navigate.interface';
import {
  EDonationNavigationProtected,
  EDonationTransferUrlNavigationCollection
} from '../../../../../transfer/modules/donation/enum/donation.enum';
import { UtilService } from '../../../../../../service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class StDonationTransferDefinitionService {

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

    const dataToVoucher = this.tmConfirmationParameters.buildParametersToDonation({
      accountDebited: transactionResponse[0],
      accountCredited: transactionResponse[1],
      transaction: transactionSelected,
    });


    this.parameterManager.sendParameters({
      navigateStateParameters: {
        ...dataToVoucher,
        position: params?.position
      },
      navigationProtectedParameter: EDonationNavigationProtected.CONFIRMATION,
    });

    if (isTransactionHistoryMode) {
      this.router.navigate([EDonationTransferUrlNavigationCollection.TRANSACTION_HISTORY_VOUCHER]).finally(() => this.utils.hideLoader());
      return;
    }

    this.router.navigate([EDonationTransferUrlNavigationCollection.SIGNATURE_TRACKING_VOUCHER]).finally(() => this.utils.hideLoader());
  }
}
