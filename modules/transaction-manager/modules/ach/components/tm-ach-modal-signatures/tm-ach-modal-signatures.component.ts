import { Component, Input } from '@angular/core';
import { IConfirmationModal, ITableStructure } from '@adf/components';

@Component({
  selector: 'byte-tm-ach-modal-signatures',
  templateUrl: './tm-ach-modal-signatures.component.html',
  styleUrls: ['./tm-ach-modal-signatures.component.scss']
})
export class TmAchModalSignaturesComponent  {
  @Input() data!: IConfirmationModal;
  @Input() uploadedAccountsLayout: ITableStructure | null = null;
}
