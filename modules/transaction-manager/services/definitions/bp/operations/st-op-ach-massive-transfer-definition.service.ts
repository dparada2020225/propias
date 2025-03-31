import { Injectable } from '@angular/core';
import { TmdConfirmationVoucherManagerService } from '../../../manager/bp/tmd-confirmation-voucher-manager.service';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { UtilService } from '../../../../../../service/common/util.service';
import { ITMServiceDetailAccountOperation } from '../../../../interfaces/transaction-manager-navigate.interface';
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
export class StOpAchMassiveTransferDefinitionService {

  constructor(
    private transactionManagerConfirmation: TmdConfirmationVoucherManagerService,
    private router: Router,
    private parameterManager: ParameterManagementService,
    private utils: UtilService,
  ) { }

  navigateToOperation(parameters: ITMServiceDetailAccountOperation) {
    const { transactionSelected, position, action} = parameters ?? {};
    this.utils.showLoader();

    const parametersToBullTransferFlow: IBTDetailState  = {
      transactionSelected,
      transactionDetail: this.transactionManagerConfirmation.buildParametersToBulkTransaction(transactionSelected),
      action,
      position,
    };

    this.parameterManager.sendParameters({
      navigateStateParameters: parametersToBullTransferFlow,
      navigationProtectedParameter: EBulkTransactionNavigationProtected.VOUCHER_OPERATION,
    });



    this.router.navigate([EBTUrlNavigateCollection.SIGNATURE_TRACKING_OPERATIONS]).finally(() => this.utils.hideLoader());
  }
}
