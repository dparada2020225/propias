import { Component, Input } from '@angular/core';
import { ITM365RegistersModalHelper } from '../../interfaces/file-validations.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'byte-tm365-modal-helper',
  templateUrl: './tm365-modal-helper.component.html',
  styleUrls: ['./tm365-modal-helper.component.scss']
})
export class Tm365ModalHelperComponent {
  @Input() registers: Array<ITM365RegistersModalHelper> = [];

  constructor(
    private activeModal: NgbActiveModal,
  ) { }

  closeModal() {
    this.activeModal.close();
  }

}
