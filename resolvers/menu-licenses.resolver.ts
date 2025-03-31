import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';
import {ParameterManagementService} from '../service/navegation-parameters/parameter-management.service';
import {FlowErrorBuilder, IFlowError} from '../models/error.interface';
import {finalize} from 'rxjs/operators';
import {MenuOptionLicensesService} from '../service/common/menu-option-licenses.service';
import {HttpErrorResponse} from '@angular/common/http';
import {IMenuOptionsLicenses} from '../models/menu-option-licenses.interface';
import {environment} from "../../environments/environment";
import {EProfile} from "../enums/profile.enum";

@Injectable({
  providedIn: 'root'
})
export class MenuLicensesResolver implements Resolve<Observable<IMenuOptionsLicenses | IFlowError>> {
  constructor(
    private spinner: NgxSpinnerService,
    private menuOptionsLicenses: MenuOptionLicensesService,
    private parameterManagementService: ParameterManagementService,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IMenuOptionsLicenses | IFlowError> {

    let service: string;

    if ((environment.profile === EProfile.SALVADOR) && state.url === '/transfer/third/home') {
      service = 'ttr-admin'
    } else {
      service = route.data['service'];
    }

    this.spinner.show('main-spinner');
    return new Observable((observer) => {
      this.menuOptionsLicenses.getMenuLicenses({
        idClient: this.parameterManagementService.getParameter('userInfo')?.customerCode,
        idService: service,
      })
        .pipe(finalize(() => observer.complete()))
        .subscribe({
          next: (menuOptions) => {
            const errorResponse = new FlowErrorBuilder()
              .status(200)
              .message('error:getting_menu_options_licenses')
              .error('error')
              .build();

            observer.next((menuOptions ?? errorResponse) as never);
          },
          error: (error: HttpErrorResponse) => {
            const message = error?.status === 500 ? 'internal_server_error' : error?.error?.message ?? 'error:getting_menu_options_licenses';

            const errorResponse = new FlowErrorBuilder()
              .status(error.status)
              .message(message)
              .error(error.error)
              .build();

            observer.next(errorResponse);
          }
        })
    });
  }
}
