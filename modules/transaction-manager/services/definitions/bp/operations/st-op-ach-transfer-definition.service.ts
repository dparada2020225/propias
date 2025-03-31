import { Injectable } from '@angular/core';
import { TmdConfirmationVoucherManagerService } from '../../../manager/bp/tmd-confirmation-voucher-manager.service';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { UtilService } from '../../../../../../service/common/util.service';
import { ITMServiceDetailAccountOperation } from '../../../../interfaces/transaction-manager-navigate.interface';
import {
  EACHNavigationParameters,
  EACHTransferUrlNavigationCollection
} from '../../../../../transfer/modules/transfer-ach/enum/navigation-parameter.enum';

@Injectable({
  providedIn: 'root'
})
export class StOpAchTransferDefinitionService {

  constructor(
    private transactionManagerConfirmation: TmdConfirmationVoucherManagerService,
    private router: Router,
    private parameterManager: ParameterManagementService,
    private utils: UtilService,
  ) { }


  navigateToOperation(params: ITMServiceDetailAccountOperation) {
    const { transactionSelected, position, action } = params ?? {};

    this.utils.showLoader();
    const dataToVoucher = this.transactionManagerConfirmation.buildParametersToACHTransaction({
      accountDebited: null as any,
      accountCredited: null as any,
      transaction: transactionSelected,
    });

    this.parameterManager.sendParameters({
      navigateStateParameters: {
        ...dataToVoucher,
        position,
        action,
        transactionSelected,
      },
      navigationProtectedParameter: EACHNavigationParameters.SIGNATURE_TRACKING_OPERATIONS,
    });


    this.router.navigate([EACHTransferUrlNavigationCollection.SIGNATURE_TRACKING_OPERATION]).finally(() => this.utils.hideLoader());
  }
}
