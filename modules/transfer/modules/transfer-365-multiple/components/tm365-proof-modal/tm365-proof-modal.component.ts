import { Component, Input } from '@angular/core';
import { IConfirmationModal, ITableStructure } from '@adf/components';

@Component({
  selector: 'byte-tm365-proof-modal',
  templateUrl: './tm365-proof-modal.component.html',
  styleUrls: ['./tm365-proof-modal.component.scss']
})
export class Tm365ProofModalComponent {
  @Input() data!: IConfirmationModal;
  @Input() uploadedAccountsLayout!: ITableStructure;
  @Input() currency!: string;
  @Input() total!: string;
  @Input() credits!: number;


  constructor() { }

  get userVirtualScrollInTable() {
    return this.uploadedAccountsLayout.items.length > 8
  }
}
