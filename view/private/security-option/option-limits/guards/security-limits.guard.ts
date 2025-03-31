import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { StorageService } from '@adf/security';
import { ParameterManagementService } from '../../../../../service/navegation-parameters/parameter-management.service';
import { environment } from '../../../../../../environments/environment';
import { EProfile } from '../../../../../enums/profile.enum';
import { ISettingData } from '../../../../../models/setting-interface';
import { ETSPLimitsNavParameter } from '../interfaces/sp-limits.interface';
import { IUserInfo } from '../../../../../models/user-info.interface';

@Injectable({
  providedIn: 'root'
})
export class SecurityLimitsGuard implements CanActivate {
  constructor(
    private router: Router,
    private storage: StorageService,
    private parameterManager: ParameterManagementService,

  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const isSvProfile: boolean = environment.profile === EProfile.SALVADOR;
    const userInfo: IUserInfo = this.parameterManager.getParameter('userInfo');
    const settings: ISettingData = JSON.parse(this.storage.getItem('securityParameters'));
    const isFullUsers = settings.fullUsersByProfile.includes(userInfo.profile);
    const securityParam = this.parameterManager.getParameter('parameterStateNavigation') === ETSPLimitsNavParameter.SECURITY_PARAMETER;
    const isTokenRequired = this.parameterManager.getParameter('isTokenRequired');


    const isAllowed = isSvProfile && isFullUsers && securityParam && isTokenRequired;

    if (!isAllowed) {
      this.router.navigate(['home']);
    }

    return isAllowed;
  }

}
