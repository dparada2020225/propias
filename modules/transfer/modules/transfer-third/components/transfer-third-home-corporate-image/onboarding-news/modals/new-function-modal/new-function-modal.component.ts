import {Component} from '@angular/core';

@Component({
  selector: 'byte-new-function-modal',
  templateUrl: './new-function-modal.component.html',
  styleUrls: ['./new-function-modal.component.scss'],
})
export class NewFunctionModalComponent {
  imgMobile: string = 'assets/images/private/transfer-third/onboarding/BIES_NewFunction_MOB.gif';
  imgTablet: string = 'assets/images/private/transfer-third/onboarding/BIES_NewFunction_TBT.gif';
  imgDesktop: string = 'assets/images/private/transfer-third/onboarding/BIES_NewFunction_DSK.gif';
}
