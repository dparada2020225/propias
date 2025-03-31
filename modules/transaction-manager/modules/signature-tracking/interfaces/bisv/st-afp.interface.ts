export interface IBisvNotifyAfpCrecerNpeRequest {
  npe:         string;
  id:          string;
  delinquency: string;
  currency:    string;
  amount:      string;
  reference:   string;
  dueDate:     string;
  account:     string;
  accountName: string;
}

export interface IBisvFileTransferAfpRequest {
  file: FormData;
}
