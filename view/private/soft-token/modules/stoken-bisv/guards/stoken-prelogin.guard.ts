import { StorageService } from '@adf/security';
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { Location } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class StokenPreloginGuard implements CanActivate {

  constructor(
    private parameterManager: ParameterManagementService,
    private storage: StorageService,
    private router: Router,
    private location: Location

  ) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const stokenPreLogin = this.parameterManager.getParameter('stokenPreLogin') ?? false;
    const prelogedIn = this.storage.getItem('userPreLoggedIn') ?? false;

    if (!prelogedIn || !stokenPreLogin.stokenPreLog) {
      this.location.back();
      return false;
    }

    return true;
  }


}