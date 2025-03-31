import { IAccount } from '../../../../../models/account.inteface';

export interface ITMAchUniVoucherParameters {
  sourceAccount: IAccount;
}

export interface ITMAchUniVoucherModalParameters extends ITMAchUniVoucherParameters {
  transactionResponse: any,
}

export interface CorrelativeResponse {
  responseCode: string;
  errorMessage: string;
  correlative: string;
}
