import {Injectable} from '@angular/core';
import {
  ITTEChangeAccountDebitResponce,
  ITTEInitStep1Request,
  ITTEInitStep1Responce
} from '../../interfaces/third-transfer-execution.interface';
import {TteTransferFormService} from './tte-transfer-form.service';
import {environment} from "../../../../../../../environments/environment";
import {EProfile} from "../../../../../../enums/profile.enum";
import {TteTransferFormBisvService} from "./tte-transfer-form-bisv.service";

@Injectable({
  providedIn: 'root'
})
export class TteTransferManagerService {

  private profile: string = environment.profile;
  private profileSv: string = EProfile.SALVADOR;
  private profileHn: string = EProfile.HONDURAS;
  private profileBipa: string = EProfile.PANAMA;

  constructor(
    private transferForm: TteTransferFormService,
    private transferFormBisv: TteTransferFormBisvService
  ) {
  }

  formScreenBuilderStep1(startupParameters: ITTEInitStep1Request): ITTEInitStep1Responce {

    switch (this.profile) {
      case this.profileSv:
        return this.transferFormBisv.formScreenBuilderBisv(startupParameters)
      case this.profileHn:
      case this.profileBipa:
        return this.transferForm.formScreenBuilder(startupParameters);
      default:
        return this.transferForm.formScreenBuilder(startupParameters);
    }

  }

  changeAccountDebitedStep1(accountNumber: string): ITTEChangeAccountDebitResponce {
    switch (this.profile) {
      case this.profileSv:
        return this.transferFormBisv.changeAccountDebited(accountNumber)
      case this.profileHn:
      case this.profileBipa:
        return this.transferForm.changeAccountDebited(accountNumber);
      default:
        return this.transferForm.changeAccountDebited(accountNumber);
    }

  }

  changeAccountAccreditStep1(accountNumber: string) {

    switch (this.profile) {
      case this.profileSv:
        return this.transferFormBisv.changeAccountAccredit(accountNumber)
      case this.profileHn:
      case this.profileBipa:
        return this.transferForm.changeAccountAccredit(accountNumber);
      default:
        return this.transferForm.changeAccountAccredit(accountNumber);
    }

  }
}
