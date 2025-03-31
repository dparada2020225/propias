import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { UtilWorkFlowService } from '../service/common/util-work-flow.service';

@Injectable()
export class SecurityNavigationResolver implements Resolve<any> {

    constructor(
        private utilWorkFlowService: UtilWorkFlowService
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      this.utilWorkFlowService.handleMarkSecureNavigation(state.url);
      return "ok";
    }
}
