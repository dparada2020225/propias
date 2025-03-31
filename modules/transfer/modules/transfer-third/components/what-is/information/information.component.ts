import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'byte-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
})
export class InformationComponent {

  @Output() requestNavigation = new EventEmitter<void>();
  @Input() showButton!: boolean;


  imgMobile: string = 'assets/images/private/transfer-third/what-is/BIES_INFORMATION_MOB.png'
  imgTablet: string = 'assets/images/private/transfer-third/what-is/BIES_INFORMATION_TBT.png'
  imgDesktop: string = 'assets/images/private/transfer-third/what-is/BIES_INFORMATION_DSK.png'

  navigateToTransferThird(): void {
    this.requestNavigation.emit();
  }
}
