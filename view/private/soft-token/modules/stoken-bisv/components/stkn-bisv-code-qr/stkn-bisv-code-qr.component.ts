import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from 'src/app/service/common/util.service';
import { StknBisvCodeQrZoomComponent } from './stkn-bisv-code-qr-zoom/stkn-bisv-code-qr-zoom.component';

@Component({
  selector: 'byte-stkn-bisv-code-qr',
  templateUrl: './stkn-bisv-code-qr.component.html',
  styleUrls: ['./stkn-bisv-code-qr.component.scss']
})
export class StknBisvCodeQrComponent {

  @Input() qrCode: string | null = null;
  @Input() qrCodeErrorLoading: boolean = false;
  @Input() isInInvitationFlow: boolean = true;
  qrCodeError: string = 'assets/images/private/stkn-bisv/qr-error.png';

  @Output() updateQR = new EventEmitter<boolean>;

  showShadowControl: boolean = true;

  constructor(
    private modalService: NgbModal,
    private utils: UtilService,

  ) { }
 
  openModalZoom() {


    if(!this.qrCode) return;

    const modal = this.modalService.open(StknBisvCodeQrZoomComponent, {
      centered: true,
      windowClass: `${this.utils.getProfile() || 'byte-theme'} stoken-zoomQR`,
      size: `lg`,
    });

    modal.componentInstance.qrCode = this.qrCode;
  }

  hideShadow($event: Event): void{
    if($event.type === 'load'){
      this.utils.hideLoader();
      this.showShadowControl = false;
    }

  }

  showShadow(): void{
  this.showShadowControl = true;
  }

  clickOnRetryMessage(): void{
    this.updateQR.emit(true);
  }



}
