export interface IConsulAch365MultipleResponse {
  batch: LotElement[];
}

interface LotElement {
  date:              string;
  time:              string;
  lotNumber:         string;
  bankCode:          string;
  accountOrigin:     string;
  accountHolderName: string;
  currency:          string;
  contractNumber:    string;
  amount:            string;
  status:            string;
  transactionCode:   string;
  process:           string;
  period:            string;
  email:             string
  detail:           Det;
}

interface Det {
  transactions: I365MultipleTransactionRegister[];
}

export interface I365MultipleTransactionRegister {
  transactionId:            string;
  transactionType:          string;
  transactionNumber:        string;
  bankCode:                 string;
  productCode:              string;
  mandateNumber:            string;
  accountNumber:            string;
  beneficiaryAccountNumber: string;
  amount:                   string;
  commission:               string;
  transactionStatus:        string;
  period:                   string;
  email:                    string;
}


export interface ILookUpTransfer368LoteMappedResponse {
  date:          string;
  dateParsed:    string;
  hour:          string;
  lote:          number;
  bankName:      string;
  account:       string;
  accountName:   string;
  typeOperation: string;
  currency:      string;
  product:       string;
  total:         string;
  amount:        string;
  status:        string;
  productName:   string;
  email:         string;
  registers:     ILookUpMultiple365RegisterInLote[];
}

export interface ILookUpMultiple365RegisterInLote {
  id:           string;
  operation:    string;
  operationRaw: string;
  comment:      string;
  bankName:     string;
  email:        string;
  productName:  string;
  product:  string;
  account:      string;
  name:         string;
  currency:     string;
  amount:       string;
  status:       string;
  typeClientParsed: string;
}
