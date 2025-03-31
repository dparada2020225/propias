import { Component, Input } from '@angular/core';
import { IConfirmationModal, ITableStructure } from '@adf/components';

@Component({
  selector: 'byte-pmpp-proof-modal',
  templateUrl: './pmpp-proof-modal.component.html',
  styleUrls: ['./pmpp-proof-modal.component.scss']
})
export class PmppProofModalComponent {
  @Input() data!: IConfirmationModal;
  @Input() paymentRegisters: ITableStructure | null = null;
}
