export interface ITMLookUpUniMultipleRawResponse {
  achLoteItemList: Array<ITMLookUpUniMultipleRegisterRawResponse>;
}

interface ITMLookUpUniMultipleRegisterRawResponse {
  fecha:         string;
  hora:          string;
  lote:          string;
  cuenta:        string;
  nombre:        string;
  total:         number;
  estado:        string;
  transacciones: TLookUpAchMultipleListResponse;
}

export type TLookUpAchMultipleListResponse = Array<ITMLookUpAchUniMultipleRegisterMapped>;

export interface ITMLookUpAchUniMultipleRegisterMapped {
  date: string;
  hour: string;
  lote: string;
  account: string;
  name: string;
  total: string;
  status: string;
  dateParsed: string;
  transactions: Array<any>;
}

export interface ILookUpUniTransactionLoteDetailRawResponse {
  fecha:         string;
  hora:          string;
  lote:          string;
  cuenta:        string;
  nombre:        string;
  total:         number;
  estado:        string;
  transacciones: Transaccione[];
}

export type IUniMultipleListRegisters = Array<Transaccione>;

interface Transaccione {
  id:                string;
  tipo:              string;
  banco:             string;
  producto:          string;
  moneda:            string;
  cuenta:            string;
  nombre:            string;
  monto:             number;
  comentario:        string;
  descripcionEstado: string;
  transaccion: string;
}


export interface ILookUpUniTransactionLoteDetailResponseMapped {
  date:         string;
  hour:          string;
  lote:          string;
  account:        string;
  name:        string;
  total:         number;
  status:        string;
  transactions: ILookUpUniTransactionInLoteRegisterMapped[];
}

export interface ILookUpUniTransactionInLoteRegisterMapped {
  idTransference:                string;
  id:                string;
  type:              string;
  bank:             string;
  product:          string;
  currency:            string;
  account:            string;
  name:            string;
  amount:             string;
  comment:        string;
  statusDescription: string;
  bankName: string;
}
