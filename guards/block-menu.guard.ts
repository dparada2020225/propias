import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FeatureManagerService } from '../service/common/feature-manager.service';
import { ParameterManagementService } from '../service/navegation-parameters/parameter-management.service';


@Injectable({
  providedIn: 'root'
})
export class BlockMenuGuard implements CanActivate {


  constructor(
    private parameterManager: ParameterManagementService,
    private router: Router,
    private featureManagerService: FeatureManagerService


  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if(!this.featureManagerService.softTokenAllow()){
      return true;
    }

    const blockedMenu = this.parameterManager.getParameter('blockedMenu')
    const url = state.url;
    const allowedURL = this.allowedURL(url);


    if (!blockedMenu?.allowed) {
      if (!allowedURL) {
        let url: string = blockedMenu?.url
        this.router.navigate([`${url}`])
          .catch(() => { });
        return false;
      } else {
        return true;
      }
    }

    return true;





  }


  private allowedURL(url) {
    const arrURL = [
      '/soft-token/migration/qrcode-stoken',
      "/soft-token/migration/approve-stoken",
      "/soft-token/migration/confirmation",
      "/soft-token/change-device/qrcode-stoken",
      "/soft-token/change-device/approve-stoken",
      "/soft-token/change-device/confirmation"
    ];

    return arrURL.includes(url);
  }

}

