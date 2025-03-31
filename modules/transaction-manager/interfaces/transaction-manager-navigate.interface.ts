import { ITransactionManagerAccountDetail } from './transaction-manger.interface';
import { ITMTransaction } from './tm-transaction.interface';
import { IAchAccount } from '../../transfer/modules/transfer-ach/interfaces/ach-account-interface';

export interface ITMNavigateHandlerParams {
  transactionResponse: ITransactionManagerAccountDetail[];
  transactionSelected: ITMTransaction;
  isTransactionHistoryMode: boolean;
  position: number;
  action?: string;
}

export interface ITMServiceDetailAccount {
  isTransactionHistoryMode: boolean;
  transactionSelected: ITMTransaction;
  navigateHandler?: (params: ITMNavigateHandlerParams) => void;
  position: number;
  action?: string;
  sourceAccount?: string;
  targetAccount?: string;
}

export interface ITMServiceDetail {
  isTransactionHistoryMode: boolean;
  transactionSelected: ITMTransaction;
  position: number | null;
}

export interface ITMNavigateHandlerExtendedParams extends ITMServiceDetail {
  achAssociatedAccounts: IAchAccount[]
}

export interface ITMServiceTransactionOperationExtended extends ITMServiceDetailAccountOperation {
  achAssociatedAccounts: IAchAccount[]

}


export interface ITMOperationHandlerParamsToSpecialTransaction {
  transactionSelected: ITMTransaction;
  position: number;
  action: string;
}

export interface ITMServiceDetailAccountOperation {
  transactionSelected: ITMTransaction;
  position: number;
  action: string;
}

export interface ITMServiceDetailStepOperation extends  ITMServiceDetailAccountOperation {
  transactionResponse: ITransactionManagerAccountDetail[];
}

