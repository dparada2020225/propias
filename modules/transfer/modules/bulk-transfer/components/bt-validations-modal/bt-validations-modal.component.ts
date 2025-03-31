import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'byte-bt-validations-modal',
  templateUrl: './bt-validations-modal.component.html',
  styleUrls: ['./bt-validations-modal.component.scss'],
})
export class BtValidationsModalComponent {
  @Input() listOfErrors: string[] = [];

  constructor(private activeModal: NgbActiveModal) {}

  closeModal() {
    this.activeModal.close();
  }
}
