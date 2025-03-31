import { IGetDataPayroll } from './pmp-payment-home.interface';
import { HttpErrorResponse } from '@angular/common/http';

export interface IPayrollPaySuccess {
  dateTime: string,
  reference: string,
  fileName: string
}

export interface ISaveDataPayrollResponse {
  code: number,
  message: string
}


export interface IPayrollPaymentSendFileParameters {
  response: IPayrollPaySuccess;
  paymentDetail: IGetDataPayroll;
  signatureTrackingResponse: null | HttpErrorResponse;
}
