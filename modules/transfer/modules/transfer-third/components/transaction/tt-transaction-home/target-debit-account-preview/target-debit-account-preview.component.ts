import {Component, Input} from '@angular/core';
import {IAccount} from "../../../../../../../../models/account.inteface";
import {AdfFormatService} from "@adf/components";

@Component({
  selector: 'byte-target-debit-account-preview',
  templateUrl: './target-debit-account-preview.component.html',
  styleUrls: ['./target-debit-account-preview.component.scss']
})
export class TargetDebitAccountPreviewComponent {

  constructor(private adfFormatService: AdfFormatService) {
  }

  @Input() debitAccount!: IAccount;

  get account(): string {
    return this.debitAccount?.account || '';
  }

  get nameAccount(): string {
    return this.debitAccount?.name || '';
  }

  get availableAmount(): string {
    const currency = this.debitAccount?.currency || '';
    const amount = this.adfFormatService.formatAmount(this.debitAccount?.availableAmount || 0)
    return `${currency} ${amount}`;
  }

}
