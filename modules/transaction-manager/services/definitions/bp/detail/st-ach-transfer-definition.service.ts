import { Injectable } from '@angular/core';
import { UtilService } from '../../../../../../service/common/util.service';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { ITMServiceDetail } from '../../../../interfaces/transaction-manager-navigate.interface';
import {
  EACHNavigationParameters,
  EACHTransferUrlNavigationCollection
} from '../../../../../transfer/modules/transfer-ach/enum/navigation-parameter.enum';
import { IAchAccount } from '../../../../../transfer/modules/transfer-ach/interfaces/ach-account-interface';
import { TmdConfirmationVoucherManagerService } from '../../../manager/bp/tmd-confirmation-voucher-manager.service';

@Injectable({
  providedIn: 'root'
})
export class StAchTransferDefinitionService {

  constructor(
    private utils: UtilService,
    private router: Router,
    private parameterManager: ParameterManagementService,
    private tmConfirmationParameters: TmdConfirmationVoucherManagerService,
  ) { }

  getTransactionDetail(params: ITMServiceDetail, associatedAccounts: Array<IAchAccount> = []) {
    const { transactionSelected, isTransactionHistoryMode } = params ?? {};

    this.utils.showLoader();
    const dataToVoucher = this.tmConfirmationParameters.buildParametersToACHTransaction({
      accountDebited: null as any,
      accountCredited: null as any,
      transaction: transactionSelected,
    }, associatedAccounts);


    this.parameterManager.sendParameters({
      navigateStateParameters: {
        ...dataToVoucher,
        position: params?.position
      },
      navigationProtectedParameter: EACHNavigationParameters.VOUCHER
    });

    if (isTransactionHistoryMode) {
      this.router.navigate([EACHTransferUrlNavigationCollection.TRANSACTION_HISTORY_VOUCHER]).finally(() => this.utils.hideLoader());
      return;
    }

    this.router.navigate([EACHTransferUrlNavigationCollection.SIGNATURE_TRACKING_VOUCHER]).finally(() => this.utils.hideLoader());
  }
}
