import { IPaymentExecute } from './payment-third-party-loans-interface';

export interface ITPLAccountsBodyRequest {
  loanToLocate: string;
  currency: string;
  action: string;
  advancedFilter: string
}

export interface ITPLVoucherState {
  notifyTo: string;
  comment: string;
  aliasAccountDebited: string;
  nameAccountDebited: string;
  aliasLoan: string;
  nameLoan: string;
}

export interface ITPLVoucherParameterState extends IPaymentExecute, ITPLVoucherState {

}
