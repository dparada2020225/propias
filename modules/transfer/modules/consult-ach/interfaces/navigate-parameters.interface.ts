import { ICOResponseAccount } from './consult-ach-definition.interface';

export interface IConsultingACHState {
  consultingACHState: IParamsHomeToDetail | null;
}

export interface IParamsHomeToDetail {
  transactionItem: ICOResponseAccount;
  parameterDetail?: ICOTransactionCreditDetail;
}

export interface ICOTransactionCreditDetail {
  code: number;
  message: string;
  id: number;
  operation: string;
  transfer: string;
  currency: string;
  reference: string;
  creationDate: string;
  senderBeneficiary: string;
  issuingDestination: string;
  status: string;
  amount: string;
  operationDate: string;
  user: string;
  debitAccount: string;
  debitAccountName: string;
  product: string;
  beneficiaryAccount: string;
  lot: number;
  scheduledDate: string;
}
