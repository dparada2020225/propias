import {Injectable} from '@angular/core';
import {catchError} from "rxjs/operators";
import { HttpClient } from '@angular/common/http';
import { ISPPCorrelativePayroll } from 'src/app/modules/payroll/manager-payroll/interfaces/pmp-state.interface';
import { PSCorrelativeSupplier } from '../interfaces/sp-state.interface';
import { IGetDataSupplier } from '../interfaces/ps-payment-home.interface';
import { UtilTransactionService } from 'src/app/service/common/util-transaction.service';


@Injectable({
  providedIn: 'root'
})
export class SpLoadSupplierTransactionService {
  private readonly SUPPLIER_SERVICE = '/v1/vendor-management';

  constructor(
    private httpClient: HttpClient,
    private utilTransaction: UtilTransactionService
  ) {
  }
  generateCorrelative(){
    //return this.httpClient.get<PSCorrelativeSupplier>(`${this.SUPPLIER_SERVICE}/generate-payroll-correlative`, {});
    return this.httpClient.get<PSCorrelativeSupplier>(`${this.SUPPLIER_SERVICE}/generate-providers-correlative`, {});
  }

  getSupplierByPaymentMethod(body){
    console.log('body', body)
    return this.httpClient.post<any>(`${this.SUPPLIER_SERVICE}/get-planilla`, body);
  }

  generateCorrelativeParti(mainClient: string){
    const body: any = {
      mainClient: mainClient
    }
    //return this.httpClient.get<PSCorrelativeSupplier>(`${this.SUPPLIER_SERVICE}/generate-participante-correlative`, {});
    return this.httpClient.post<PSCorrelativeSupplier>(`${this.SUPPLIER_SERVICE}/generate-participante-correlative`, body);
  }

  fileTransferFTP(bodyRequest) {
    const { uploadFile } = bodyRequest;

    return this.httpClient.post<any>('/v1/file-transfer/upload-file', uploadFile, {
      params: {
        mnemonic: 'PAGPRO',
      }
    });
  }

  saveLote(bodyRequest) {
    bodyRequest;

    return this.httpClient.post<any>(`${this.SUPPLIER_SERVICE}/create-payment`, bodyRequest);
  }

  payLote(bodyRequest) {
    bodyRequest;
    return this.httpClient.post<any>(`${this.SUPPLIER_SERVICE}/execute-payment`, bodyRequest);
  }

  paymentWithToken (isTokenRequired: boolean, data, tokenValue: string | null) {
    const headers = this.utilTransaction.addHeaderByToken({
      service: `${this.SUPPLIER_SERVICE}/execute-payment`,
      typeTransaction: 'AUTHENTICATION',
      token: tokenValue as string,
      isTokenRequired,
    });

    return this.httpClient.post<any>(`${this.SUPPLIER_SERVICE}/execute-payment`, data, {
      headers,
    });
  }
  getSupplierToPayment(mainClient: string) {
    return this.httpClient.post<IGetDataSupplier>(`${this.SUPPLIER_SERVICE}/find-last-payment`, {mainClient});
  }

  validateAccounts (accounts) {
    console.log('{accounts: accounts}', {accounts: accounts})
    return this.httpClient.post<any>(`${this.SUPPLIER_SERVICE}/validate-accounts`, {accounts: accounts});
  }

/*   execute(parameters: IPayrollLoadParticipantsExecuteLoadParameters) {
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
  } */

/*   private loadParticipants(parameters: PayrollLoadParticipantsParameters) {

    const dto:IloadParticipant[] = this.buildBodyRequest.buildDataToLoadPayroll(parameters);

    return this.pmpTransactionService.payrollLoadParticipants(dto).pipe(
    catchError((error) => {
        console.error(error);
        return throwError(() => error);
      })
    )
  } */

/* 

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
  } */
}
