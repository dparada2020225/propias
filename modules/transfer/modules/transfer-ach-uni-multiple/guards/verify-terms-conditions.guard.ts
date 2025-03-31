import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}


@Injectable({
  providedIn: 'root'
})
export class VerifyTermsConditionsGuard implements CanDeactivate<CanComponentDeactivate> {

  constructor(private storage: ParameterManagementService) {}

  canDeactivate(
    component: CanComponentDeactivate
  ): Observable<boolean> | Promise<boolean> | boolean {
    this.storage.sendParameters({
      AcceptedeStateParametersTC: null,
    });
    const navigateStateParametersTC = this.storage.getParameter('AcceptedeStateParametersTC');
    return true;
  }

}
