import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilService } from '../../../../../service/common/util.service';
import { ParameterManagementService } from '../../../../../service/navegation-parameters/parameter-management.service';
import { IUserInfo } from '../../../../../models/user-info.interface';
import { AchUniTransferService } from '../../transfer-ach-uni/services/transaction/ach-uni-transfer.service';
import { ServiceTypeStatusTermsConditions } from '../../../enum/service-type-status-terms-conditions.enum';
import { PROTECTED_PARAMETER_ROUTE } from '../../../../../enums/common-value.enum';

@Injectable({
  providedIn: 'root'
})
export class S365TermConditionsGuard implements CanActivate {
  constructor(
    private transfer: AchUniTransferService,
    private utils: UtilService,
    private router: Router,
    private parameterManagement: ParameterManagementService,
  ) {
  }
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean>  {
    this.utils.showLoader();
    const protectedParameter = route.data['protectedParameter'] ?? '';
    const routeTerms = route.data['routeForTermsCondition'] ?? '';
    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');

    return new Observable(observer => {
      this.transfer.getStatusTermsConditions(ServiceTypeStatusTermsConditions.SIPA, userInfo.customerCode)
        .subscribe({
          next: (response) => {
            const isTermsAccepted = response.result === 'S';

            if (isTermsAccepted) {
              observer.next(true);
              return true;
            }

            this.parameterManagement.sendParameters({
              [PROTECTED_PARAMETER_ROUTE]: protectedParameter,
            });

            this.router.navigate([routeTerms]).finally(() => {});
            observer.next(false);
            return false;
          },
          error: () => {
            observer.next(false);
            this.utils.hideLoader();
            this.router.navigate(['home']).finally(() => {})
            return false;
          }
        })
    })
  }


}
