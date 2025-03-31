import {IAlert, IDataReading, ILayout} from '@adf/components';
import {Injectable} from '@angular/core';
import {ITTDUpdateConfirm} from '../../../../interfaces/third-crud.interface';
import {TTDUpdateConfirmService} from '../personalization/update/ttd-update-banpais-confirm.service';
import {TTDUpdateFormService} from '../personalization/update/ttd-update-banpais-form.service';
import {IThirdTransfersAccounts} from '../../../../../../interface/transfer-data-interface';
import {UtilWorkFlowService} from '../../../../../../../../service/common/util-work-flow.service';
import {environment} from 'src/environments/environment';
import {EProfile} from 'src/app/enums/profile.enum';
import {TtdUpdateBisvFormService} from '../personalization/update/ttd-update-bisv-form.service';
import {TtdUpdateBisvConfirmService} from '../personalization/update/ttd-update-bisv-confirm.service';

@Injectable({
    providedIn: 'root'
})
export class TTDUpdateManagerService {

    constructor(
        private updateForm: TTDUpdateFormService,
        private updateBisvForm: TtdUpdateBisvFormService,
        private updateConfirm: TTDUpdateConfirmService,
        private updateBisvConfirm: TtdUpdateBisvConfirmService,
        private utilWorkFlow: UtilWorkFlowService,
    ) {
    }

    profile = environment.profile;

    buildUpdateAccountLayout(account: IThirdTransfersAccounts): ILayout {
        switch (this.profile) {
            case EProfile.HONDURAS:
            case EProfile.PANAMA:
                return this.updateForm.buildUpdateAccountLayout(account);
            case EProfile.SALVADOR:
                return this.updateBisvForm.buildUpdateAccountLayout(account);
            default:
                return this.updateForm.buildUpdateAccountLayout(account);
        }
    }

    buildUpdateAlert(): IAlert {
        return this.utilWorkFlow.buildAlertToUpdate();
    }

    builderUpdateConfirmation(updateConfirm: ITTDUpdateConfirm): IDataReading {

        switch (this.profile) {
            case EProfile.HONDURAS:
            case EProfile.PANAMA:
                return this.updateConfirm.builderUpdateConfirmation(updateConfirm);
            case EProfile.SALVADOR:
                return this.updateBisvConfirm.builderUpdateConfirmation(updateConfirm);
            default:
                return this.updateConfirm.builderUpdateConfirmation(updateConfirm);
        }

    }

}
