import { IAccount } from '../../../../../models/account.inteface';

export interface ITM365VoucherParameters {
  sourceAccount: IAccount;
}

export interface ITM365VoucherModalParameters extends ITM365VoucherParameters {
  transactionResponse: any,
}
