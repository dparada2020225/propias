import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {FlowErrorBuilder, IFlowError} from '../models/error.interface';
import {IIsSchedule} from '../models/isSchedule.interface';
import {MenuService} from '../service/shared/menu.service';


@Injectable({
  providedIn: 'root'
})
export class ScheduleServiceResolver implements Resolve<IIsSchedule | IFlowError> {

  constructor(
    private menuServices: MenuService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<IIsSchedule | IFlowError> {
    this.spinner.show('main-spinner');

    return new Observable((observer) => {
      this.menuServices.getSchedule(route.data['service'])
        .pipe(finalize(() => {
          observer.complete();
        }))
        .subscribe({
          next: (response) => {
            observer.next(response);
          },
          error: (error: HttpErrorResponse) => {
            const errorResponse = new FlowErrorBuilder()
              .message('error_getting_trigger_time')
              .status(error.status)
              .error(error.error)
              .build();

            observer.next(errorResponse);
          }
        })
    });
  }
}
