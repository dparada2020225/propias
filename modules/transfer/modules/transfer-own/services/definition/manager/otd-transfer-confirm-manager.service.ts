import { IDataReading } from '@adf/components';
import { Injectable } from '@angular/core';
import { IOTDConfirm } from '../../../interfaces/own-transfer-definition.interface';
import { OtdTransferBanpaisConfirmService } from '../personalization/otd-transfer-banpais-confirm.service';
import {OtdTransferBisvConfirmService} from '../personalization/otd-transfer-bisv-confirm.service';
import { EProfile } from 'src/app/enums/profile.enum';
import { environment } from 'src/environments/environment';
import { OtdTransferBipaConfirmService } from '../personalization/otd-transfer-bipa-confirm.service';

@Injectable({
  providedIn: 'root'
})
export class OtdTransferConfirmManagerService {

  profile = environment.profile;

  constructor(
    private banpaisConfirm: OtdTransferBanpaisConfirmService,
    private bisvConfirm: OtdTransferBisvConfirmService,
    private bipaConfirm: OtdTransferBipaConfirmService
  ) { }

  builderLayoutConfirmationStep2(confirm: IOTDConfirm): IDataReading {
    switch (this.profile) {
      case EProfile.HONDURAS:
        return this.banpaisConfirm.builderLayoutConfirmation(confirm);
      case EProfile.PANAMA:
        return this.bipaConfirm.builderLayoutConfirmation(confirm);
      case EProfile.SALVADOR:
        return this.bisvConfirm.builderLayoutConfirmation(confirm);
      default:
        return this.banpaisConfirm.builderLayoutConfirmation(confirm);
    }
  }
}
