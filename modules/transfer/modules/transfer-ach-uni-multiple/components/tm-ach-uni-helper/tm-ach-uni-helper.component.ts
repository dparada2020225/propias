import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ITMAchUniRegistersModalHelper } from '../../interfaces/ach-uni-file-validations.interface';

@Component({
  selector: 'byte-tm-ach-uni-helper',
  templateUrl: './tm-ach-uni-helper.component.html',
  styleUrls: ['./tm-ach-uni-helper.component.scss']
})
export class TmAchUniHelperComponent {
  @Input() registers: Array<ITMAchUniRegistersModalHelper> = [];

  constructor(
    private activeModal: NgbActiveModal) { }

  closeModal() {
    this.activeModal.close();
  }

}
