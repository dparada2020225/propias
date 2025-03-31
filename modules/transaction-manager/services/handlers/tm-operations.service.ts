import { Injectable } from '@angular/core';
import { UtilService } from '../../../../service/common/util.service';
import { EProfile } from '../../../../enums/profile.enum';
import { ITMServiceDetailAccountOperation } from '../../interfaces/transaction-manager-navigate.interface';
import { IAchAccount } from '../../../transfer/modules/transfer-ach/interfaces/ach-account-interface';
import { TmdNavigateOperationService } from '../core/bp/tmd-navigate-operation.service';
import { TmNavigateOperationBisvService } from '../core/bisv/tm-navigate-operation-bisv.service';

@Injectable({
  providedIn: 'root'
})
export class TmOperationsService {

  constructor(
    private bpDetailHandlerService: TmdNavigateOperationService,
    private bisvDetailHandlerService: TmNavigateOperationBisvService,
    private utils: UtilService,
  ) { }

  manageOperationTransferNavigation(params: ITMServiceDetailAccountOperation, achAssociatedAccounts: IAchAccount[] = []) {
    if (this.utils.getProfile() === EProfile.SALVADOR) {
      this.bisvDetailHandlerService.goToOperationTransaction(params, achAssociatedAccounts);
      return;
    }

    this.bpDetailHandlerService.goToOperationTransaction(params, achAssociatedAccounts);
  }

}
