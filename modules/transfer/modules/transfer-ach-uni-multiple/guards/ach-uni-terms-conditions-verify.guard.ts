import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AchUniTransferService } from '../../transfer-ach-uni/services/transaction/ach-uni-transfer.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { AchUniStatusTermsResponse } from '../../transfer-ach-uni/interfaces/ach-uni-status-terms-response';
import { catchError, map } from 'rxjs/operators';
import { ETmAchUniProtectedNavigation, ETmAchUniUrlCollection } from '../enum/ach-uni-url-collection';
import { ServiceTypeStatusTermsConditions } from '../../../enum/service-type-status-terms-conditions.enum';


@Injectable({
  providedIn: 'root'
})
export class AchUniTermsConditionsVerifyGuard implements CanActivate {
  constructor(
    private achUniTransferService: AchUniTransferService,
    private router: Router,
    private persistStepStateService: ParameterManagementService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const clientCode = this.persistStepStateService.getParameter('userInfo')?.customerCode;
    const serviceType = ServiceTypeStatusTermsConditions.UNI;

    if (route.queryParams['redirected'] === 'true') {
      return of(true);
    }

    return this.achUniTransferService.getStatusTermsConditions(serviceType, clientCode).pipe(
      map((res: AchUniStatusTermsResponse) => this.handleResponse(res)),
      catchError((error) => this.handleError(error))
    );
  }

  private handleResponse(res: AchUniStatusTermsResponse): boolean {
    console.log('res', res);
    if (res.result === 'S' && res.errorCode === '0') {
      return true;
    } else {
      this.redirectToTermsConditions(res);
      return false;
    }
  }

  private handleError(error: any): Observable<boolean> {
    this.redirectToTermsConditions({
      result: error,
      errorCode: '500',
      errorDescription: error?.error?.errorDescription ? error.error.errorDescription : error.error.message
    });
    return of(false);
  }

  private redirectToTermsConditions(res: AchUniStatusTermsResponse): void {
    this.persistStepStateService.sendParameters({
      navigateStateParametersTC: {
        result: res.result,
        errorCode: res.errorCode,
        errorDescription: res.errorDescription
      },
      navigationProtectedParameter: ETmAchUniProtectedNavigation.TERMS_CONDITIONS,
    });
    this.router.navigate([ETmAchUniUrlCollection.TERMS_CONDITIONS]);
  }


}
