import { Injectable } from '@angular/core';
import { UtilService } from '../../../../../../service/common/util.service';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { TmdConfirmationVoucherManagerService } from '../../../manager/bp/tmd-confirmation-voucher-manager.service';
import { ITMServiceDetail } from '../../../../interfaces/transaction-manager-navigate.interface';
import {
  IBTDetailState
} from '../../../../../transfer/modules/bulk-transfer/interfaces/bulk-transfer-parameters.interface';
import {
  EBulkTransactionNavigationProtected
} from '../../../../../transfer/modules/bulk-transfer/models/bulk-transfer.enum';
import { EBTUrlNavigateCollection } from '../../../../../transfer/modules/bulk-transfer/enum/bt-navigation.enum';

@Injectable({
  providedIn: 'root'
})
export class StAchMassiveTransferDefinitionService {

  constructor(
    private utils: UtilService,
    private router: Router,
    private parameterManager: ParameterManagementService,
    private tmConfirmationParameters: TmdConfirmationVoucherManagerService,
  ) { }

  getTransactionDetail(params: ITMServiceDetail) {
    const { transactionSelected, isTransactionHistoryMode } = params ?? {};
    this.utils.showLoader();

    const parametersToBullTransferFlow: IBTDetailState  = {
      transactionSelected,
      transactionDetail: this.tmConfirmationParameters.buildParametersToBulkTransaction(transactionSelected),
      position: params?.position as number,
    };

    this.parameterManager.sendParameters({
      navigateStateParameters: parametersToBullTransferFlow,
      navigationProtectedParameter: EBulkTransactionNavigationProtected.VOUCHER,
    });



    if (!isTransactionHistoryMode) {
      this.router.navigate([EBTUrlNavigateCollection.SIGNATURE_TRACKING_VOUCHER]).finally(() => this.utils.hideLoader());
    } else {
      this.router.navigate([EBTUrlNavigateCollection.TRANSACTION_HISTORY_VOUCHER]).finally(() => this.utils.hideLoader());
    }
  }
}
