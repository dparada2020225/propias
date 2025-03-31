import { Injectable } from '@angular/core';
import { TmdConfirmationVoucherManagerService } from '../../../manager/bp/tmd-confirmation-voucher-manager.service';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { UtilService } from '../../../../../../service/common/util.service';
import {
  EOwnTransferProtectedNavigation, EOwnTransferUrlNavigationCollection
} from '../../../../../transfer/modules/transfer-own/enum/navigation-parameter.enum';
import { ITMNavigateHandlerParams } from '../../../../interfaces/transaction-manager-navigate.interface';

@Injectable({
  providedIn: 'root'
})
export class StOpOwnTransferDefinitionService {

  constructor(
    private transactionManagerConfirmation: TmdConfirmationVoucherManagerService,
    private router: Router,
    private parameterManager: ParameterManagementService,
    private utils: UtilService,
  ) { }

  navigateToOperation(params: ITMNavigateHandlerParams) {
    const { transactionSelected, transactionResponse, position, action } = params ?? {};

    const dataToVoucher = this.transactionManagerConfirmation.buildParametersToTransferOwn({
      accountDebited: transactionResponse[0],
      accountCredited: transactionResponse[1],
      transaction: transactionSelected,
    });

    this.parameterManager.sendParameters({
      navigateStateParameters: {
        ...dataToVoucher,
        position,
        action,
        transactionSelected,
      },
      navigationProtectedParameter: EOwnTransferProtectedNavigation.SIGNATURE_OPERATION,
    });


    this.router.navigate([EOwnTransferUrlNavigationCollection.SIGNATURE_TRACKING_OPERATION]).finally(() => this.utils.hideLoader());
  }
}
