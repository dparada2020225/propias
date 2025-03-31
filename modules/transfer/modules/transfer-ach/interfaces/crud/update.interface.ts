import { IUpdateAchForm } from './crud-form.interface';
import { IAchAccount } from '../ach-account-interface';

export interface  IAtdConfirmationVoucher {
  formValues: IUpdateAchForm;
  accountToUpdate: IAchAccount;
  reference: string;
}
