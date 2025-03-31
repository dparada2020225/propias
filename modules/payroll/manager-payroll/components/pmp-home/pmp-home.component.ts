import {Component} from '@angular/core';
import {UtilService} from '../../../../../service/common/util.service';
import {Router} from '@angular/router';
import {SPPMRoutes} from '../../enums/pmp-routes.enum';

@Component({
  selector: 'byte-pmp-home',
  templateUrl: './pmp-home.component.html',
  styleUrls: ['./pmp-home.component.scss']
})
export class PmpHomeComponent  {

  constructor(
    private utils: UtilService,
    private router: Router,
  ) { }

  loadPayroll() {
    this.utils.showLoader();
    this.router.navigate([SPPMRoutes.HOME_LOAD]).finally(() => this.utils.hideLoader())
  }

  paymentPayroll() {
    this.utils.showLoader();
    this.router.navigate([SPPMRoutes.HOME_PAYMENT]).finally(() => {})
  }
}
