import { Component, Input } from '@angular/core';
import { IConfirmationModal, ITableStructure } from '@adf/components';

@Component({
  selector: 'byte-bt-home-table-modal',
  templateUrl: './bt-proof-voucher-modal.component.html',
  styleUrls: ['./bt-proof-voucher-modal.component.scss']
})

export class BtProofVoucherModalComponent {
  @Input() data!: IConfirmationModal;
  @Input() uploadedAccountsLayout: ITableStructure | null = null;

}

