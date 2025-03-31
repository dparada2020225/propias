import { Component, Input } from '@angular/core';
import { IConfirmationModal, ITableStructure } from '@adf/components';

@Component({
  selector: 'byte-ps-proof-modal',
  templateUrl: './ps-proof-modal.component.html',
  styleUrls: ['./ps-proof-modal.component.scss']
})
export class PSProofModalComponent {
  @Input() data!: IConfirmationModal;
  @Input() paymentRegisters: ITableStructure | null = null;
}
