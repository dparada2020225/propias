import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { StorageService, SmartidNavigationService, KeepAliveService } from '@adf/security';
import { HomePrivateService } from '../service/private/home-private.service';
import { UtilWorkFlowService } from '../service/common/util-work-flow.service';


@Injectable({
    providedIn: 'root'
})
export class KeepAlive2Resolver implements Resolve<any> {

    constructor(private homePrivateService: HomePrivateService,
        private keepAliveService: KeepAliveService,
        private storage: StorageService,
        private smartIdNavigationService: SmartidNavigationService,
        private utilWorkFlowService: UtilWorkFlowService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return new Observable((observer) => {
        this.keepAliveService.keepAlive()
          .pipe(finalize(() => observer.complete()))
          .subscribe({
            next: (result) => {
              this.utilWorkFlowService.handleMarkSecureNavigation(state.url);
              observer.next(result);
            },
          error: (error) => {
            console.error(error);
            observer.next([]);
          }});
      });
    }

}
