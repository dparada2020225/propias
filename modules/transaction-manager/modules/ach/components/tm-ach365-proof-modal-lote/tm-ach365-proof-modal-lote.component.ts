import { Component, Input, OnInit } from '@angular/core';
import { IConfirmationModal, ITableStructure } from '@adf/components';

@Component({
  selector: 'byte-tm-ach365-proof-modal-lote',
  templateUrl: './tm-ach365-proof-modal-lote.component.html',
  styleUrls: ['./tm-ach365-proof-modal-lote.component.scss']
})
export class TmAch365ProofModalLoteComponent implements OnInit {
  @Input() subTitile = '';
  @Input() tableClassName = '';
  @Input() credits = 0;
  @Input() total = '';
  @Input() currency = '';
  @Input() data!: IConfirmationModal;
  @Input() uploadedAccountsLayout!: ITableStructure;

  get userVirtualScrollInTableMultiple() {
    return this.uploadedAccountsLayout.items.length > 8;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
