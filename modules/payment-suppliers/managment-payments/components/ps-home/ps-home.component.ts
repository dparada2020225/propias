import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/service/common/util.service';
import { SPRoutes } from '../../enums/ps-routes.enum';

@Component({
  selector: 'byte-ps-home',
  templateUrl: './ps-home.component.html',
  styleUrls: ['./ps-home.component.scss']
})
export class PsHomeComponent {


  constructor(
    private utils: UtilService,
    private router: Router,
  ) { }

  loadSupplier() {
    this.utils.showLoader();
    this.router.navigate([SPRoutes.BATCH]).finally(() => this.utils.hideLoader())
  }

  paymentSupplier() {
    this.utils.showLoader();
    this.router.navigate([SPRoutes.PAYMENT]).finally()
  }
}
