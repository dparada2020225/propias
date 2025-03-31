import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { StyleManagementService } from 'src/app/service/common/style-management.service';
import { environment } from 'src/environments/environment';
import { EVersionHandler } from '../../../enums/version-handler.enum';
import { ParameterManagementService } from '../../../service/navegation-parameters/parameter-management.service';
import { StorageService } from '@adf/security';

@Component({
  selector: 'byte-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  profile = environment.profile;
  mainImage!: string;
  secondaryImage!: string;
  logoutUrl = `${environment.urlOnlineBankingLegacy}service=logout`;
  safeUrl!: SafeResourceUrl;

  constructor(
    private router: Router,
    private styleManagement: StyleManagementService,
    private persistStepStateService: ParameterManagementService,
    private storage: StorageService,
    private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.logoutUrl);
    this.logoutBuilder();

    setTimeout(this.navigateToLogin.bind(this), 3000);
  }

  logoutBuilder() {
    if (this.styleManagement.corporateImageApplication()) {
      this.newLogoutStructure();
    } else {
      this.oldLogoutStructure();
    }
  }

  newLogoutStructure(): void {
    this.mainImage = `assets/images/gif/LoaderBR/Loader_${this.profile}_${EVersionHandler.ASSETS}.png`;
    this.secondaryImage = `assets/images/gif/LoaderBR/Loader_${this.profile}_${EVersionHandler.ASSETS}.gif`;
  }

  oldLogoutStructure(): void {
    this.mainImage = `assets/images/gif/LoaderBR/Loader_${this.profile}_${EVersionHandler.ASSETS}.gif`;
  }

  navigateToLogin() {
    this.router.navigate(['/login']).then(() => {});
  }



  login() {
    this.router.navigate(['/login']).then(() => {});
  }
}
