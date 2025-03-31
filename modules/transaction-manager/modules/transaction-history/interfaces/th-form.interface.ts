import { AttributeFormTransactionHistory } from '../enums/transaction-history-control-name.enum';

export interface ITransactionHistoryFormValues {
  [AttributeFormTransactionHistory.INITIAL_DATE]: number;
  [AttributeFormTransactionHistory.FINAL_DATE]: number;
}
