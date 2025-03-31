export interface ITMACHRegister {
  date:      string;
  operation: string;
  service:   string;
  id:        string;
  account:   string;
  name:      string;
  currency:  string;
  amount:    string;
  status:    string;
}

export interface ITMConsultACHAtomicRegisterMapped extends ITMACHRegister {
  dateParsed: string;
}

export type TLookUpACHRegister = Array<ITMACHRegister>;
export type TLookUpACHRegisterAtomicMapped = Array<ITMConsultACHAtomicRegisterMapped>;

export interface ITMConsultMultipleRegister {
  date:   string;
  lote:   string;
  amount: string;
  status: string;
}

export interface ITMConsultMultipleRegisterMapped extends ITMConsultMultipleRegister {
  dateParsed: string;
}

export type TConsultMultipleACHListRegisters = Array<ITMConsultMultipleRegisterMapped>;
