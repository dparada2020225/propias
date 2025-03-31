import { IAchAccount } from '../ach-account-interface';

export interface IATDDeleteVoucher {
  deletedAccount: IAchAccount;
  datetime: string;
  reference: string;
}
