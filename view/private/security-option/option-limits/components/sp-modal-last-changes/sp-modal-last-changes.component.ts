import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'byte-sp-modal-last-changes',
  templateUrl: './sp-modal-last-changes.component.html',
  styleUrls: ['./sp-modal-last-changes.component.scss']
})
export class SpModalLastChangesComponent {
  result: boolean = false;

  @Input() message: string = '';

  constructor(public activeModal: NgbActiveModal) {}
  passBack() {
    this.result = true;
    this.activeModal.close(this.result);
  }

  close() {
    this.activeModal.close(this.result);
  }

}
