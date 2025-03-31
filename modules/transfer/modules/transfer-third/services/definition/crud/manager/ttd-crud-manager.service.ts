import {IAlert, IDataReading, ILayout} from '@adf/components';
import {Injectable} from '@angular/core'
import {ITTDCreateConfirm, ITTDDeleteConfirm, ITTDUpdateConfirm} from '../../../../interfaces/third-crud.interface';
import {IGetThirdTransferResponse} from '../../../../interfaces/third-transfer-service';
import {TTDCreateManagerService} from './ttd-create-manager.service';
import {TTDUpdateManagerService} from './ttd-update-manager.service';
import {IThirdTransfersAccounts} from '../../../../../../interface/transfer-data-interface';
import {TtdDeleteManagerService} from './ttd-delete-manager.service';

@Injectable({
  providedIn: 'root'
})
export class TTDCRUDManagerService {

  constructor(
    private createManager: TTDCreateManagerService,
    private updateManager: TTDUpdateManagerService,
    private deleteManager: TtdDeleteManagerService,
  ) {
  }

  //====================================== START CREATE ===================================

  buildConsultingLayoutTTC(): ILayout {
    return this.createManager.buildConsultingLayout();
  }

  buildCreateAccountLayoutTTC(account: IGetThirdTransferResponse): ILayout {
    return this.createManager.buildCreateAccountLayout(account);
  }

  builderCreatedConfirmationTTC(createConfirm: ITTDCreateConfirm): IDataReading {
    return this.createManager.builderCreatedConfirmation(createConfirm);
  }

  //====================================== END CREATE =====================================

  //====================================== START UPDATE ===================================

  buildUpdateAccountLayoutTTU(account: IThirdTransfersAccounts): ILayout {
    return this.updateManager.buildUpdateAccountLayout(account);
  }

  buildUpdateAlertTTU(): IAlert {
    return this.updateManager.buildUpdateAlert();
  }

  builderUpdateConfirmationTTU(updateConfirm: ITTDUpdateConfirm): IDataReading {
    return this.updateManager.builderUpdateConfirmation(updateConfirm);
  }

  //====================================== END UPDATE =====================================

  //====================================== START DELETE ===================================

  builderDeleteConfirmationTTD(deleteConfirm: ITTDDeleteConfirm): IDataReading {
    return this.deleteManager.buildDeleteAccountLayout(deleteConfirm)
  }

  //====================================== END DELETE =====================================
}
