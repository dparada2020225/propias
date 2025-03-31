import { HttpErrorResponse } from "@angular/common/http";

export interface IGetDataPayroll{
  code: number;
  message: string;
  participants: Participant[];
}
export interface IPayrollPaymentError extends HttpErrorResponse {
  developerCode: string
}

export interface Participant {
  company:       number;
  type:          number;
  numParti:      number;
  correlative:   number;
  targetAccount: string;
  accountName:   string;
  email?:         string;
  details?:       string;
  targetAmount:  number;
  statusAccount: string;
  dateCreation:  string;
}


export interface IPayPayroll {
  sourceAccount:          string;
  accountsQuantity:       string;
  amount:                 number;
  signatureType:          string;
  principalClient:        string;
  appliesPayrollsSameDay: string;
  payrollSaveRequest:     IPayrollSaveRequest;
}

export interface IPayrollSaveRequest {
  company:          string;
  currency:         string;
  statusRecord:     string;
  type:             number;
  userCreation:     string;
  userModification: string;
  dateCreation:     string;
  dateModification: string;
  status:           string;
  sourceAccount:    string;
  sourceAmount:     number;
  debits:           number;
  records:          IRecordPayroll[];
}

export interface IRecordPayroll {
  company:         number;
  type:            number;
  nameAccountReal: string;
  email:           string;
  detail:          string;
  accountStatus:   string;
  correlative:     number;
  targetAccount:   string;
  accountName:     string;
  targetAmount:    number;
}
