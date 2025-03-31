import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { TransferACHService } from '../services/transaction/transfer-ach.service';
import { IACHSettings } from '../interfaces/settings.interface';
import { FlowErrorBuilder, IFlowError } from 'src/app/models/error.interface';
import { UtilService } from '../../../../../service/common/util.service';

@Injectable({
  providedIn: 'root',
})
export class AchConfigurationResolver implements Resolve<Observable<IACHSettings[] | IFlowError>> {
  constructor(
    private transfer: TransferACHService,
    private utils: UtilService,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IACHSettings[] | IFlowError> {
    const isEnabled = route.data['isSignatureTrackingAchServiceEnabled'];

    if (!isEnabled && route.data.hasOwnProperty('isSignatureTrackingAchServiceEnabled')) {
      return new Observable((observer) => observer.next([]))
    }

    this.utils.showLoader();

    return new Observable((observer) => {
      this.transfer
        .achSettings()
        .pipe(finalize(() => observer.complete()))
        .subscribe({
          next: (settings) => {
            observer.next(settings ?? []);
          },
          error: (error) => {
            const errorResponse = new FlowErrorBuilder()
              .status(error?.status ?? 400)
              .message(error?.error?.message ?? 'fatal-error:error_getting_ach_settings')
              .error(error?.error)
              .build();

            observer.next(errorResponse);
          },
        });
    });
  }
}
