import { HttpErrorResponse } from "@angular/common/http";

export interface IGetDataSupplier{
  responseCode: number;
  errorMessage: string;
  details: PSParticipant[];
}
export interface ISupplierPaymentError extends HttpErrorResponse {
  developerCode: string
}

export interface PSParticipant {
  company:       number;
  type:          number;
  numParti:      number;
  correlativo:   number;
  cuentaDestino: string;
  nombreCuenta:   string;
  correo?:         string;
  details?:       string;
  detalle?:       string;
  montoDestino:  any;
  estadoCuenta: string;
  fechaCreacion:  string;
}


export interface PSDetailTrack {
  company:       number;
  type:          number;
  numParti:      number;
  correlativo:   number;
  cuentaDestino: string;
  nombreCuenta:   string;
  correo?:         string;
  details?:       string;
  detalle?:       string;
  monto:  number;
  statusCuenta: string;
  fechaCreacion:  string;
}


export interface IPaySupplier {
  sourceAccount:          string;
  accountsQuantity:       string;
  amount:                 number;
  signatureType:          string;
  principalClient:        string;
  appliesSupplierSameDay: string;
  supplierSaveRequest:     ISupplierSaveRequest;
}

export interface ISupplierSaveRequest {
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
  records:          IRecordSupplier[];
}

export interface IRecordSupplier {
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
