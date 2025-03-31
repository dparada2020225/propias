import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'byte-stkn-bisv-code-qr-zoom',
  templateUrl: './stkn-bisv-code-qr-zoom.component.html',
  styleUrls: ['./stkn-bisv-code-qr-zoom.component.scss']
})
export class StknBisvCodeQrZoomComponent  {
  @Input() qrCode: string | null = null;

  constructor(
    private activeModal: NgbActiveModal,
  ) { }

  close() {
    this.activeModal.close('close');
  }

  return(){
    this.activeModal.close(false);
  }

  continue(){
    this.activeModal.close(true);
  }

}
