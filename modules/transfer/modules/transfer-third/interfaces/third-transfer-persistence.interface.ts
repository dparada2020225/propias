import { IThirdTransfersAccounts } from '../../../interface/transfer-data-interface';
import { ICrudCreateFormValues, IThirdTransferFormValues } from './third-transfer.interface';
import { IAccount } from '../../../../../models/account.inteface';
import { IGetThirdTransferResponse, IThirdTransferTransactionResponse } from './third-transfer-service';
import { ICreateThird } from './crud/create-third-interface';
import {
  ITransactionManagerRequestDetail
} from '../../../../transaction-manager/interfaces/transaction-manger.interface';
import { ITMTransaction } from '../../../../transaction-manager/interfaces/tm-transaction.interface';



export interface IThirdTransferTransactionState {
  targetAccount: IThirdTransfersAccounts;
  sourceAccount: IAccount | null;
  message?: string | null;
  typeTransaction?: string;
  formValues?: IThirdTransferFormValues;
  error?: boolean;
  transactionResponse?: any;
  transactionManagerDetail?: ITransactionManagerRequestDetail;
  transactionSelected?: ITMTransaction;
  position?: number;
}

export interface IThirdTransferCreateState {
  accountToAdd: IGetThirdTransferResponse;
  transactionResponse?: IThirdTransferTransactionResponse;
  formValues?: ICrudCreateFormValues;
  currentAccount?: ICreateThird;
}

export interface IThirdTransferDeleteState {
  accountToDelete: IThirdTransfersAccounts;
  transactionResponse: IThirdTransferTransactionResponse;
}

export interface IThirdTransferUpdateState {
  accountToUpdate: IThirdTransfersAccounts;
  transactionResponse?: IThirdTransferTransactionResponse;
  formValues?: ICrudCreateFormValues;
  currentAccount?: ICreateThird;
}
