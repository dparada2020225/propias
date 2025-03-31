import { Injectable } from '@angular/core';
import { ITMNavigateHandlerParams } from '../../../../interfaces/transaction-manager-navigate.interface';
import {
  EDonationNavigationProtected,
  EDonationTransferUrlNavigationCollection
} from '../../../../../transfer/modules/donation/enum/donation.enum';
import { TmdConfirmationVoucherManagerService } from '../../../manager/bp/tmd-confirmation-voucher-manager.service';
import { Router } from '@angular/router';
import { UtilService } from '../../../../../../service/common/util.service';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';

@Injectable({
  providedIn: 'root'
})
export class StOpDonationTransferDefinitionService {

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
      action,
      position } = params ?? {};

    const dataToVoucher = this.transactionManagerConfirmation.buildParametersToDonation({
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
      navigationProtectedParameter: EDonationNavigationProtected.SIGNATURE_TRACKING_OPERATION,
    });


    this.router.navigate([EDonationTransferUrlNavigationCollection.SIGNATURE_TRACKING_OPERATION]).finally(() => this.utils.hideLoader());
  }
}
