import { Injectable } from '@angular/core';
import { TmdConfirmationVoucherManagerService } from '../../../manager/bp/tmd-confirmation-voucher-manager.service';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { UtilService } from '../../../../../../service/common/util.service';
import { ITMNavigateHandlerParams } from '../../../../interfaces/transaction-manager-navigate.interface';
import {
  EThirdTransferNavigateParameters, EThirdTransferUrlNavigationCollection
} from '../../../../../transfer/modules/transfer-third/enums/third-transfer-navigate-parameters.enum';

@Injectable({
  providedIn: 'root'
})
export class StOpThirdPartyTransferDefinitionService {

  constructor(
    private transactionManagerConfirmation: TmdConfirmationVoucherManagerService,
    private router: Router,
    private parameterManager: ParameterManagementService,
    private utils: UtilService,
  ) { }

  navigateToOperation(params: ITMNavigateHandlerParams) {
    const {
      transactionSelected,
      transactionResponse,
      position,
      action } = params ?? {};


    const dataToVoucher = this.transactionManagerConfirmation.buildParametersToTransferThird({
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
      navigationProtectedParameter: EThirdTransferNavigateParameters.SIGNATURE_TRACKING_OPERATIONS,
    });

    this.router.navigate([EThirdTransferUrlNavigationCollection.SIGNATURE_TRACKING_OPERATION]).finally(() => this.utils.hideLoader());
  }
}
