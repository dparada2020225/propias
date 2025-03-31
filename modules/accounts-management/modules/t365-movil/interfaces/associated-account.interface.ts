export interface AM365Account {
  name:           string;
  alias:          string;
  currency:       string;
  favorite:       boolean;
  useAnyCurrency: boolean;
  account:        string;
  bank:           string;
  email:          string;
  number:         string;
  status: string;
  bankName: string;
}

export interface IAM365AddAccountRequest {
  clientNumber: string;
  numberPhone: string;
  bank: string;
  email: string;
  name: string;
}

export type AM365AccountList = Array<AM365Account>;
