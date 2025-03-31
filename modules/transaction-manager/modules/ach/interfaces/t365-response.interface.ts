export interface ItmAch365ServiceResponse {
  operation: Operation;
}

interface Operation {
  transactions: Trx[];
}

interface Trx {
  date:  string;
  hour:  string;
  type:  string;
  transactionNumber: string;
  account:  string;
  name:  string;
  currency:  string;
  amount:  string;
  status:  string;
  transactionType: string;
}

export interface ITransferAch365DetailResponse {
  detail: Det[];

}

export interface ITransferACH365DetailMapped {
  id: string,
  bankName: string,
  targetAccount: string,
  comment: string,
  error: string,
  date: string,
  targetAccountName: string,
  targetProductName: string,
}

interface Det {
  authorization:   string;
  bank:   string;
  comment:   string;
  date:   string;
  errorCode:  string;
  errorDescription:  string;
  origin:  string;
  targetAccount:  string;
  targetName:  string;
  transactionId:  string;
  type:   string;
}

