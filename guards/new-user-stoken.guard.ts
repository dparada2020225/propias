import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { lastValueFrom, Observable } from 'rxjs';
import { ParameterManagementService } from '../service/navegation-parameters/parameter-management.service';
import { AuthenticationService } from '@adf/security';
import { TokenService } from '../service/private/token/token.service';

@Injectable({
  providedIn: 'root'
})
export class NewUserStokenGuard implements CanActivate {

  constructor(
    private parameterManager: ParameterManagementService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private tokenService: TokenService
  ){
    
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
     const validNewUser= this.parameterManager.getParameter('newUserValidation')
     if(!validNewUser) return true;
     const logOutService = this.authenticationService.logout();
      lastValueFrom(logOutService).finally(() => {});
     return false;
  }
  
}
