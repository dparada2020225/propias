export interface TMConsultACHMultiple365 {
  date:          string;
  typeOperation: string;
  lote:          string;
  account:       string;
  accountName:   string;
  currency:      string;
  amount:        string;
  status:        string;
}

export interface ITMConsultACHMultiple365Mapped extends TMConsultACHMultiple365 {
  dateParsed: string;
}

export type TTMConsultACHMultiple365List = Array<ITMConsultACHMultiple365Mapped>;

export interface ITMConsultACHMultiple365Lote {
  registers: TListConsultACHMultiple365Lote
}

export interface ITMConsultACHMultiple365LoteRegister {
  idTransference:    string;
  bankName:          string;
  product:           string;
  currency:          string;
  account:           string;
  targetAccountName: string;
  typeClient:        string;
  email:             string;
  amount:            string;
  comment:           string;
}

export interface ITMConsultACHMultiple365LoteRegisterMapped extends ITMConsultACHMultiple365LoteRegister {
  productParsed: string;
  typeClientParsed: string;
}

export type TListConsultACHMultiple365Lote = Array<ITMConsultACHMultiple365LoteRegisterMapped>
