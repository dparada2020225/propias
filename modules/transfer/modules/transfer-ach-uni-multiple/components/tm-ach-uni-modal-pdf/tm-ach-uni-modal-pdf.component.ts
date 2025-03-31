import { Component, Input } from '@angular/core';
import { IConfirmationModal, ITableStructure } from '@adf/components';

@Component({
  selector: 'byte-tm-ach-uni-modal-pdf',
  templateUrl: './tm-ach-uni-modal-pdf.component.html',
  styleUrls: ['./tm-ach-uni-modal-pdf.component.scss']
})
export class TmAchUniModalPdfComponent {

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
