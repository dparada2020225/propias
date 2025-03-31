import { Injectable } from '@angular/core';
import { Resolve, } from '@angular/router';
import { Observable } from 'rxjs';
import { TransferACHService } from '../../transfer-ach/services/transaction/transfer-ach.service';
import { UtilService } from '../../../../../service/common/util.service';
import { IACHSettings } from '../../transfer-ach/interfaces/settings.interface';
import { FlowErrorBuilder, IFlowError } from '../../../../../models/error.interface';
import { finalize } from 'rxjs/operators';
import { M365StorageService } from '../../transfer-365-movil/services/execution/m365-storage.service';

@Injectable({
  providedIn: 'root'
})
export class T365GeneralParametersResolver implements Resolve<Observable<IACHSettings[] | IFlowError>> {
  constructor(
    private transfer: TransferACHService,
    private utils: UtilService,
    private m365StorageService: M365StorageService,
  ) {}

  resolve(): Observable<IACHSettings[] | IFlowError> {
    this.utils.showLoader();

    if (this.m365StorageService.getSettings.length > 0) {
      return new Observable((observer) => observer.next(this.m365StorageService.getSettings));
    }

    return new Observable((observer) => {
      this.transfer
        .achSettings()
        .pipe(finalize(() => observer.complete()))
        .subscribe({
          next: (settings) => {
            this.m365StorageService.setSettings(settings);
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
