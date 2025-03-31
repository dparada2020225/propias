import { ITMTransaction } from '../../../../transaction-manager/interfaces/tm-transaction.interface';
import { IOwnAccount } from '../../transfer-own/interfaces/own-transfer.interface';

export interface IStAchUniTransactionDetail {
  lote: string
  sourceAccount: string
  sourceAccountCurrency: string
  formattedAmount: string
  totalAmount: string
  fileName: string
  clientCode: string
  credits: string
}

export interface IStAchUniState {
  transactionDetail: IStAchUniTransactionDetail
  sourceAccount: IOwnAccount,
  position: number,
  transactionSelected: ITMTransaction,
}

export interface IStOperationAchUniState extends IStAchUniState {
  action: string;
}
