import { IAMS365Account } from '../../../interfaces/am-account-list.interface';
import { IAMS365Country } from './s365-catalogs.interface';

export interface IAMS365FormValues {
  typeClient: string;
  name: string;
  documentNumber: string;
  address: string;
  city: string;
  country: string;
  bank: string;
  product: string;
  account: string;
}

export interface IAMS365AddHomeState {
  formValues: IAMS365FormValues;
  productSelected: IAMS365Country;
  bankSelected: IAMS365Country;
  typeClientSelected: any;
  countrySelected: IAMS365Country;
}


export interface IAMS365DetailState {
  account: IAMS365Account;
  formValues?: IAMS365FormValues;
}

export interface IAMS365UpdateHomeState {
  account: IAMS365Account;
  formValues: IAMS365FormValues;
}

export interface IAMS365AddConfirmState extends IAMS365AddHomeState {
  transactionResponse: any;
}

export interface IAMS365DeleteConfirmState {
  transactionResponse: any;
  account: IAMS365Account;
}

export interface IAMS365UpdateConfirmState extends IAMS365AddConfirmState {
  account: IAMS365Account;
}
