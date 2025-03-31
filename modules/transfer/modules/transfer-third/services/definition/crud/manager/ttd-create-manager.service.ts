import {IDataReading, ILayout} from '@adf/components';
import {Injectable} from '@angular/core';
import {ITTDCreateConfirm} from '../../../../interfaces/third-crud.interface';
import {IGetThirdTransferResponse} from '../../../../interfaces/third-transfer-service';
import {TTDCreateConfirmService} from '../personalization/create/ttd-create-banpais-confirm.service';
import {TTDCreateFormService} from '../personalization/create/ttd-create-banpais-form.service';
import {TTDCreateSeachService} from '../personalization/create/ttd-create-banpais-seach.service';
import {TtdCreateBisvSearchService} from '../personalization/create/ttd-create-bisv-search.service';
import {environment} from 'src/environments/environment';
import {EProfile} from 'src/app/enums/profile.enum';
import {TtdCreateBisvFormService} from '../personalization/create/ttd-create-bisv-form.service';
import {TtdCreateBisvConfirmService} from '../personalization/create/ttd-create-bisv-confirm.service';

@Injectable({
  providedIn: 'root'
})
export class TTDCreateManagerService {

  constructor(
    private createSearch: TTDCreateSeachService,
    private createBisvSearch: TtdCreateBisvSearchService,
    private createForm: TTDCreateFormService,
    private createBisvForm: TtdCreateBisvFormService,
    private createConfirm: TTDCreateConfirmService,
    private createBisvConfirm: TtdCreateBisvConfirmService,
  ) {
  }

  profile = environment.profile;

  buildConsultingLayout(): ILayout {
    switch (this.profile) {
      case EProfile.HONDURAS:
      case EProfile.PANAMA:
        return this.createSearch.buildConsultingLayout();
      case EProfile.SALVADOR:
        return this.createBisvSearch.buildConsultingLayout();
      default:
        return this.createSearch.buildConsultingLayout();
    }
  }

  buildCreateAccountLayout(account: IGetThirdTransferResponse): ILayout {
    switch (this.profile) {
      case EProfile.HONDURAS:
      case EProfile.PANAMA:
        return this.createForm.buildCreateAccountLayout(account);
      case EProfile.SALVADOR:
        return this.createBisvForm.buildCreateAccountLayout(account);
      default:
        return this.createForm.buildCreateAccountLayout(account);
    }
  }

  builderCreatedConfirmation(createConfirm: ITTDCreateConfirm): IDataReading {
    switch (this.profile) {
      case EProfile.HONDURAS:
      case EProfile.PANAMA:
        return this.createConfirm.builderCreatedConfirmation(createConfirm);
      case EProfile.SALVADOR:
        return this.createBisvConfirm.builderCreatedConfirmation(createConfirm);
      default:
        return this.createConfirm.builderCreatedConfirmation(createConfirm);
    }
  }

}
