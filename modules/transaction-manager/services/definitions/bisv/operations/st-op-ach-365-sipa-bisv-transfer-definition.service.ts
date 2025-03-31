import { Injectable } from '@angular/core';
import { ITMServiceDetailAccountOperation } from '../../../../interfaces/transaction-manager-navigate.interface';
import { UtilService } from '../../../../../../service/common/util.service';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { ES365UrlCollection } from '../../../../../transfer/modules/transfer-365-sipa/enum/url-collection.enum';
import {
  TmdBisvConfirmationVoucherManagerService
} from '../../../manager/bisv/tmd-bisv-confirmation-voucher-manager.service';
import {
  S365TransferRouteProtected
} from '../../../../../transfer/modules/transfer-365-sipa/enum/route-protected.enum';

@Injectable({
  providedIn: 'root'
})
export class StOpAch365SipaBisvTransferDefinitionService {

  constructor(
    private utils: UtilService,
    private router: Router,
    private parameterManager: ParameterManagementService,
    private transactionManagerConfirmation: TmdBisvConfirmationVoucherManagerService
  ) { }

  navigateToOperation(params: ITMServiceDetailAccountOperation) {
    const {
      transactionSelected,
      position,
      action } = params;

    this.utils.showLoader();
    const dataToVoucher = this.transactionManagerConfirmation.buildParametersToACHSipaTransaction({
      transaction: transactionSelected,
    });

    this.parameterManager.sendParameters({
      navigateStateParameters: {
        ...dataToVoucher,
        position,
        action,
      },
      navigationProtectedParameter: S365TransferRouteProtected.ST_OPERATION,
    });

    this.router.navigate([ES365UrlCollection.ST_OPERATION]).finally(() => this.utils.hideLoader());
  }
}
