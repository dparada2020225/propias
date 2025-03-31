import { IAccount } from '../../../../../models/account.inteface';
import { IM365AffiliationAccount } from './affiliation.interface';

export interface IT365MFormValues {
  account: string;
  numberPhone: string;
}

export interface IT365MHomeState {
  account: IAccount;
  formValues: IT365MFormValues;
}

export interface  IT365UpdateHomeState extends IT365MHomeState {
  affiliation: IM365AffiliationAccount;
}
