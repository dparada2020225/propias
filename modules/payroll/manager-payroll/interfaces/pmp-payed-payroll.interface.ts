import { IGetDataPayroll } from './pmp-payment-home.interface';
import { IAccount } from '../../../../models/account.inteface';

export interface PayedPayrollDetailResponse {
  code:             number;
  message:          string;
  company:          number;
  currency:         string;
  statusRecord:     string;
  type:             number;
  payrollCode:      number;
  userCreation:     string;
  userModification: string;
  dateCreation:     string;
  dateModification: string;
  file:             string;
  status:           string;
  sourceAccount:    string;
  sourceAmount:     number;
  debits:           number;
  records:          Array<PayedDetailPayroll>
}

export interface PayedDetailPayroll {
  company:         number;
  type:            number;
  nameAccountReal: string;
  email:           string;
  detail:          string;
  accountStatus:   string;
  payrollCode:     number;
  correlative:     number;
  targetAccount:   string;
  accountName:     string;
  targetAmount:    number;
}

export interface PayrollManagerPaymentExecuteParameters {
  paymentDetail: IGetDataPayroll;
  sourceAccountSelected: IAccount;
}

export interface PayrollPaymentSendFileParameters {
  paymentDetail: IGetDataPayroll;
  fileName: string;
}
