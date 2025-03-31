import {Injectable} from '@angular/core';
import {IGetThirdTransferResponse} from '../../../../transfer/modules/transfer-third/interfaces/third-transfer-service';
import {HttpClient} from '@angular/common/http';
import {
  IloadParticipant,
  ISaveDataPayroll,
  ISPPCorrelativePayroll,
  ISPPFileResponseMasiveAccounts
} from "../../interfaces/pmp-state.interface";
import {GetPayedPayrollDetailBodyRequest} from '../../interfaces/pmp-load-form.interface';
import {PayedPayrollDetailResponse} from '../../interfaces/pmp-payed-payroll.interface';
import {IGetDataPayroll, IPayPayroll} from "../../interfaces/pmp-payment-home.interface";
import {IPayrollPaySuccess, ISaveDataPayrollResponse} from "../../interfaces/pmpe-transaction.interface";
import {IBodyRequest} from "../../../../../models/token.interface";
import {ERequestTypeTransaction} from "../../../../../enums/transaction-header.enum";
import {UtilTransactionService} from "../../../../../service/common/util-transaction.service";


@Injectable({
  providedIn: 'root'
})
export class PmpTransactionService {

  private readonly PAYROLL_SERVICE = '/v1/payroll-payment';


  constructor(
    private httpClient: HttpClient,
    private utilTransaction: UtilTransactionService,
  ) { }

  consult(account: string) {
    return this.httpClient.post<IGetThirdTransferResponse>(`/v1/thirdparties/general-info`, {
      account
    });
  }

  consultMultipliAccounts(accounts: string[]){
    return this.httpClient.post<ISPPFileResponseMasiveAccounts[]>(`${this.PAYROLL_SERVICE}/accounts-validation`, {accounts})
  }

  generateCorrelative(){
    return this.httpClient.post<ISPPCorrelativePayroll>(`${this.PAYROLL_SERVICE}/correlative`, {});
  }

  saveParticipantPayroll(participants:ISaveDataPayroll){
    return this.httpClient.post<ISaveDataPayrollResponse>(`${this.PAYROLL_SERVICE}/save-participants`, participants)
  }

  getPayrollToPayment(mainClient: string) {
    return this.httpClient.post<IGetDataPayroll>(`${this.PAYROLL_SERVICE}/get-participants`, {mainClient});
  }

  getPayedPayrollDetail(bodyRequest: GetPayedPayrollDetailBodyRequest) {
    return this.httpClient.post<PayedPayrollDetailResponse>(`${this.PAYROLL_SERVICE}/get`, bodyRequest);
  }

  getHistoryPayrollPayment(payrollNumber: string) {
    return this.httpClient.post(`${this.PAYROLL_SERVICE}/inquiry`, {payrollNumber})
  }

  getOperatedPayroll(mainClient:number, authorization:number){
    return this.httpClient.post(`${this.PAYROLL_SERVICE}/get`, {mainClient, authorization})
  }

  sendFTPFile(uploadFile: FormData){
    return this.httpClient.post(`/v1/file-transfer/upload-file`, uploadFile, {
      params: {mnemonic: "PLA"}
    })
  }


  payrollLoadParticipants(participants: IloadParticipant[]) {
    return this.httpClient.post('/v1/payroll-payment/load-participants', {participants})
  }

  payPayroll(payPayroll1: IBodyRequest<IPayPayroll>){

    const { isTokenRequired, token, bodyRequest } = payPayroll1

    const headers = this.utilTransaction.addHeaderByToken({
      typeTransaction: ERequestTypeTransaction.AUTHENTICATION,
      token,
      isTokenRequired,
      service: this.PAYROLL_SERVICE,
    });

    return this.httpClient.post<IPayrollPaySuccess>(this.PAYROLL_SERVICE, bodyRequest, {
      headers
    })
  }

}
