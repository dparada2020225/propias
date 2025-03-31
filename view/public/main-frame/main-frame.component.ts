import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from 'ngx-spinner';
import productList from '../../../../assets/fake-data/product-list.json';
import { environment } from '../../../../environments/environment';

import { EVersionHandler } from '../../../enums/version-handler.enum';
import { StyleManagementService } from 'src/app/service/common/style-management.service';
import { ListFeaturesFixesModalComponent } from '../list-features-fixes-modal/list-features-fixes-modal.component';

@Component({
  selector: 'byte-main-frame',
  templateUrl: './main-frame.component.html',
  styleUrls: ['./main-frame.component.scss']
})
export class MainFrameComponent implements OnInit {

  isMenuCollapsed = true;
  productList;
  profile = environment.profile;
  appVersion = environment.appVersion;
  inProduction = environment.production;
  versionAssets = EVersionHandler.ASSETS;

  get isCorporateImageApplication() {
    return !this.styleManagement.corporateImageApplication() ? 'background-container' : '';
  }

  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private modalService: NgbModal,
    private styleManagement: StyleManagementService
  ) { }

  ngOnInit() {
    this.spinner.hide("main-spinner");
    this.productList = productList;

    if(!this.isMenuCollapsed){
      this.isMenuCollapsed = true;
    }
  }

  open() {
    const theme = environment["profile"] || "byte-theme";
    if(!this.inProduction){
      this.modalService.open(ListFeaturesFixesModalComponent, {
        centered: true,
        windowClass: theme + "",
        size: "lg",
      });
    }
  }

  handleCloseMainMenu(value: any) {
    this.isMenuCollapsed = value;
  }



  navigate(component: string) {
    this.router.navigate(['/' + component]);
    this.isMenuCollapsed = true;
  }
}
