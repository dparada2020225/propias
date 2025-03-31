import { StorageService } from '@adf/security';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { environment } from '../../environments/environment';
import { IMenuOption } from '../models/menu.interface';
import { FindServiceCodeService } from '../service/common/find-service-code.service';

@Injectable({
  providedIn: 'root',
})
export class MenuPermissionEvaluatorGuard implements CanActivate {
  profile = environment.profile;

  constructor(
    private storage: StorageService,
    private findServiceCode: FindServiceCodeService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url = state.url.substring(1).split('?')[0];
    const serviceCode = this.findServiceCode.getServiceCode(url);

    if (!serviceCode) {
      this.router.navigate(['/home']).then(() => {});
      return false;
    }

    const menuList: IMenuOption[] = JSON.parse(this.storage.getItem('userMenu'));
    const found = this.findServiceCode.searchMenuEquivalence(serviceCode, menuList);

    if (!found) {
      this.router.navigate(['/home']).then(() => {});
      this.router.navigate(['/home'])
      .catch((error) => console.error(error));
    }

    return found;
  }

}
