import { IAccount } from '../../../../../models/account.inteface';
import { IT365MFormValues } from './state.interface';

export interface IT365MVoucherParameters {
  account: IAccount;
  email: string;
  formValues: IT365MFormValues;
}
