import { IDataLayoutSelect, ILayout } from '@adf/components';
import { Injectable } from '@angular/core';
import { IOTDForm } from '../../../interfaces/own-transfer-definition.interface';
import { IOwnAccount } from '../../../interfaces/own-transfer.interface';
import { OtdTransferBaseHomeService } from '../base/otd-transfer-base-home.service';
import { OtdTransferBanpaisHomeService } from '../personalization/otd-transfer-banpais-home.service';
import { OtdTransferBisvHomeService } from '../personalization/otd-transfer-bisv-home.service';
import { EProfile } from 'src/app/enums/profile.enum';
import { environment } from 'src/environments/environment';
import { OtdTransferBipaHomeService } from '../personalization/otd-transfer-bipa-home.service';

@Injectable({
  providedIn: 'root',
})
export class OtdTransferHomeManagerService {
  constructor(
    private banpaisHome: OtdTransferBanpaisHomeService,
    private bisvHome: OtdTransferBisvHomeService,
    private transferBase: OtdTransferBaseHomeService,
    private bipaHome: OtdTransferBipaHomeService
  ) {}

  profile = environment.profile;

  builderOwnTransferLayoutStep1(form: IOTDForm): ILayout {
    switch (this.profile) {
      case EProfile.HONDURAS:
        return this.banpaisHome.builderOwnTransferLayout(form);
      case EProfile.PANAMA:
        return this.bipaHome.builderOwnTransferLayout(form);
      case EProfile.SALVADOR:
        return this.bisvHome.builderOwnTransferLayout(form);
      default: return this.banpaisHome.builderOwnTransferLayout(form);
    }
  }

  buildDebitedAccountSelectAttributesStep1(account: IOwnAccount): IDataLayoutSelect[] {
    return this.transferBase.buildDebitedAccountSelectAttributes(account);

  }

  buildCreditAccountSelectAttributesStep1(account: IOwnAccount): IDataLayoutSelect[] {
    return this.transferBase.buildCreditAccountSelectAttributes(account);
  }
}
