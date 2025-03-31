import { IAccount } from '../../../../../models/account.inteface';
import { IConsultDetailTPL, IThirdPartyLoanAssociate } from './crud/crud-third-party-loans-interface';
import { ITMTransaction } from '../../../../transaction-manager/interfaces/tm-transaction.interface';
import {
  ITMRequestDetailThirdPartyLoanPayment
} from '../../../../transaction-manager/interfaces/transaction-manger.interface';
import { ITPLPVoucherState } from './payment-interface';

export interface ITPLPEModifyPaymentState extends ITPLPEFormModifyPaymentStateFromST {
  data: IConsultDetailTPL;
  amount: string;
  quotasSelected: string;
  typePayment: string;
  selectedSourceAccount: IAccount;
  voucherStructure?: ITPLPVoucherState;
}

export interface ITPLPEFormModifyPaymentStateFromST {
  loanToPayment: IThirdPartyLoanAssociate;
  transaction: ITMTransaction;
  detailTransaction: ITMRequestDetailThirdPartyLoanPayment;
}

export interface ITPLPEModifyPaymentVoucherFromST extends ITPLPEFormModifyPaymentStateFromST {
  voucherStructure: ITPLPVoucherState;
  date: string;
  reference: string;
}
