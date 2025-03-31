import { ITMTransaction } from '../../../interfaces/tm-transaction.interface';

export interface STOperationHandlerParameters {
  transactionSelected: ITMTransaction;
  position: number;
  action: string;
}
