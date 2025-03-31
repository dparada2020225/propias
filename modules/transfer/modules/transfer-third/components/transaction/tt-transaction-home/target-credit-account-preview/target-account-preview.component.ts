import {Component, Input} from '@angular/core';
import {IThirdTransfersAccounts} from "../../../../../../interface/transfer-data-interface";
import {UtilService} from "../../../../../../../../service/common/util.service";

@Component({
  selector: 'byte-target-account-preview',
  templateUrl: './target-account-preview.component.html',
  styleUrls: ['./target-account-preview.component.scss']
})
export class TargetAccountPreviewComponent {

  constructor(
    private util: UtilService
  ) {
  }

  @Input() selectedAccount!: IThirdTransfersAccounts;

  get account() {
    return this.selectedAccount?.account || '';
  }

  get nameAccount() {
    return this.selectedAccount?.name || '';
  }

  get typeAccount() {
    return this.util.getProductKeyTranslation(Number(this.selectedAccount?.type || 0)) || '';
  }

  get statusAccount() {
    return this.util.getLabelStatus(this.selectedAccount?.status || '')?.toUpperCase() || '';
  }

  get getAliasAccount() {
    return this.selectedAccount?.alias || '';
  }


  get currencyAccount() {
    return this.util.getLabelCurrency(this.selectedAccount?.currency || '')?.toUpperCase() || '';
  }

  get emailAccount() {
    return this.selectedAccount?.email || '';
  }

}
