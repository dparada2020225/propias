import { Injectable } from '@angular/core';
import { UtilService } from '../../../../service/common/util.service';
import { ITMServiceDetail } from '../../interfaces/transaction-manager-navigate.interface';
import { IAchAccount } from '../../../transfer/modules/transfer-ach/interfaces/ach-account-interface';
import { TmDetailHandlerService } from '../core/bp/tm-detail-handler.service';
import { EProfile } from '../../../../enums/profile.enum';
import { TmNavigateDetailBisvService } from '../core/bisv/tm-navigate-detail-bisv.service';

@Injectable({
  providedIn: 'root'
})
export class TmDetailService {

  constructor(
    private utils: UtilService,
    private bpDetailHandlerService: TmDetailHandlerService,
    private bisvDetailHandlerService: TmNavigateDetailBisvService,
  ) { }

  manageDetailTransferNavigation(params: ITMServiceDetail, achAssociatedAccounts: IAchAccount[] = []) {
    if (this.utils.getProfile() === EProfile.SALVADOR) {
      this.bisvDetailHandlerService.goToDetailTransaction(params);
      return;
    }

    this.bpDetailHandlerService.goToDetailTransaction(params, achAssociatedAccounts);
  }
}
