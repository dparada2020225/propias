import { Injectable } from '@angular/core';
import { UtilService } from '../../../../../../service/common/util.service';
import { Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { ITMServiceDetail } from '../../../../interfaces/transaction-manager-navigate.interface';
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
export class StAch365SipaBisvDefinitionService {

  constructor(
    private utils: UtilService,
    private router: Router,
    private parameterManager: ParameterManagementService,
    private tmConfirmationVoucherService: TmdBisvConfirmationVoucherManagerService,
  ) { }

  getTransactionDetail(params: ITMServiceDetail) {
    const {
      transactionSelected,
      position,
      isTransactionHistoryMode } = params;

    this.utils.showLoader();
    const dataToVoucher = this.tmConfirmationVoucherService.buildParametersToACHSipaTransaction({
      transaction: transactionSelected,
    });

    this.parameterManager.sendParameters({
      navigateStateParameters: {
        ...dataToVoucher,
        position,
      },
      navigationProtectedParameter: S365TransferRouteProtected.ST_DETAIL,
    });

    if (isTransactionHistoryMode) {
      this.router.navigate([ES365UrlCollection.HOME]).finally(() => this.utils.hideLoader());
      return;
    }

    this.router.navigate([ES365UrlCollection.ST_DETAIL]).finally(() => this.utils.hideLoader());

  }

}
