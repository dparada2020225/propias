import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export interface ITMLookUpACHTransferenceAtomicRequest {
  service: string;
  typeService: string;
  typeTransaction: string;
  initialDate: NgbDate;
  finalDate: NgbDate;
  clientCode: string;
}

export interface ITMLookUpUniTransactionDetailRequest {
  transactionId: string;
  service?: string;
}

export interface ITMLookUpACHTransferenceResponse {
  achConsultItemList: Array<IAchLookUpRegisterResponseRaw>;
}

interface IAchLookUpRegisterResponseRaw {
  fecha:             string;
  hora:              string;
  tipoTrx:           string;
  transferencia:     string;
  cuenta:            string;
  nombre:            string;
  moneda:            string;
  monto:             number;
  estado:            string;
  tipoTransferencia: string;
}

export interface ITMLookUpACHUniIncomingTransferenceResponse {
  items: Array<IAchLookUpUniIncomingRegisterResponseRaw>;
}

interface IAchLookUpUniIncomingRegisterResponseRaw {
  fecha:             string;
  hora:              string;
  tipoTrx:           string;
  transferencia:     string;
  cuenta:            string;
  moneda:            string;
  monto:             number;
  estado:            string;
  tipoTransferencia: string;
}



export interface ITMConsultACHLoteResponsea {
  account:     string;
  accountName: string;
  registers:   TTMConsultACHListOfRegistersInLote;
}

export interface ITMConsultACHLoteRegisters {
  idTransference: string;
  bankName:       string;
  product:        string;
  currency:       string;
  account:        string;
  amount:         string;
  comment:        string;
}

export type TTMConsultACHListOfRegistersInLote = Array<ITMConsultACHLoteRegisters>
