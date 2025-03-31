export const ACH_SERVICE_CODE = 'ach-cnsadm';

export type TAMSipaAccountList = Array<IAMS365Account>;

export interface IAMS365Account {
  id:                     string;
  name:                   string;
  alias:                  string;
  currency:               string;
  clientType:             string;
  favorite:               boolean;
  useAnyCurrency:         boolean;
  account:                string;
  registry:               string;
  country:                string;
  countryName:            string;
  bank:                   string;
  bankName:               string;
  city:                   string;
  address:                string;
  type:                   string;
  accountType:            string;
  descriptionAccountType: string;
  documentNumber:         string;
  number:                 string;
  product:                string;
}

