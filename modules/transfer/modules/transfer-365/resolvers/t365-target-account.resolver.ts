import { Injectable } from '@angular/core';
import { Resolve, } from '@angular/router';
import { Observable } from 'rxjs';
import { TransferACHService } from '../../transfer-ach/services/transaction/transfer-ach.service';
import { UtilService } from '../../../../../service/common/util.service';
import { V3IAchAccount } from '../../transfer-ach/interfaces/ach-account-interface';
import { FlowErrorBuilder, IFlowError } from '../../../../../models/error.interface';
import { finalize } from 'rxjs/operators';
import { M365StorageService } from '../../transfer-365-movil/services/execution/m365-storage.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';

@Injectable({
  providedIn: 'root'
})
export class T365TargetAccountResolver implements Resolve<Observable<V3IAchAccount[] | IFlowError>> {
  constructor(
    private transfer: TransferACHService,
    private utils: UtilService,
    private m365StorageService: M365StorageService,
    private persistStepStateService: ParameterManagementService,
  ) {}

  getClientCode(): string {
    return this.persistStepStateService.getParameter('userInfo')?.customerCode;
  }

  resolve(): Observable<V3IAchAccount[] | IFlowError> {
    this.utils.showLoader();

    /*
    if (this.m365StorageService.getAchAccountList.length > 0) {
      return new Observable((observer) => observer.next(this.m365StorageService.getAchAccountList));
    }
      */

    return new Observable((observer) => {
      this.transfer.associatedAccountsV3(this.getClientCode())
        .pipe(finalize(() => observer.complete()))
        .subscribe({
          next: (associatedAccounts) => {
            if(associatedAccounts === null || associatedAccounts === undefined){
              associatedAccounts = [];
            }
            associatedAccounts.forEach(account => {
              account.status = (account.status === 'A' || account.status === 'ACTIVA' || account.status === 'ACTIVE')
                  ? 'ACTIVA'
                  : 'INACTIVA';
            });
            this.m365StorageService.setAchAccountList(associatedAccounts);
            observer.next(associatedAccounts ?? []);
          },
          error: (error) => {
            const errorResponse = new FlowErrorBuilder()
              .status(error?.status)
              .message(error.error?.message ?? 'error_getting_associated_ach_accounts')
              .error(error?.error)
              .build();

            observer.next(errorResponse);
          },
        });
    });
  }
}
