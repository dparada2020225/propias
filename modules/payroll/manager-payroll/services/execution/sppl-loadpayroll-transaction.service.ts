import {Injectable} from '@angular/core';
import {SPPView} from "../../enums/pmp-view.enum";
import {concatMap, Observable, of, throwError} from "rxjs";
import {
  IloadParticipant,
  IPayrollLoadParticipantsExecuteLoadParameters,
  ISPPFileResponseMasiveAccounts, PayrollLoadParticipantsParameters
} from '../../interfaces/pmp-state.interface';
import {PmpTransactionService} from "../transaction/pmp-transaction.service";
import {catchError} from "rxjs/operators";
import {SpplBuilddataTransactionService} from "./sppl-builddata-transaction.service";


@Injectable({
  providedIn: 'root'
})
export class SpplLoadpayrollTransactionService {

  constructor(
    private pmpTransactionService: PmpTransactionService,
    private buildBodyRequest: SpplBuilddataTransactionService,
  ) {
  }

  execute(parameters: IPayrollLoadParticipantsExecuteLoadParameters) {
    return this.validateAccounts(parameters)
      .pipe(
        concatMap((accountsValidated: ISPPFileResponseMasiveAccounts[]) => {
          return this.loadParticipants({
            ...parameters,
            accountsValidated,
          })
        }),
        catchError((error) => {
          console.error(error);
          return throwError(() => error);
        })
      )
  }

  private loadParticipants(parameters: PayrollLoadParticipantsParameters) {

    const dto:IloadParticipant[] = this.buildBodyRequest.buildDataToLoadPayroll(parameters);

    return this.pmpTransactionService.payrollLoadParticipants(dto).pipe(
    catchError((error) => {
        console.error(error);
        return throwError(() => error);
      })
    )
  }



  private validateAccounts(parameters: IPayrollLoadParticipantsExecuteLoadParameters): Observable<ISPPFileResponseMasiveAccounts[]> {
    const { fileParsed, currentView, registers} = parameters;
    if (currentView === SPPView.MANUAL) {
      const responseEqualsToServiceConsult: ISPPFileResponseMasiveAccounts[] = registers.map(account => {
        return {
          account: account.accountNumber ?? '',
          accountName: account.accountName ?? '',
          status: account.status ?? 'Error'
        }
      })
      return of(responseEqualsToServiceConsult)
    }

    const accounts: string[] = fileParsed?.accounts?.map((account) => account.accountNumber) ?? []
    return this.pmpTransactionService.consultMultipliAccounts(accounts)
  }
}
