import { IAccount } from '../../../../../models/account.inteface';
import { IThirdTransferFormValues } from './third-transfer.interface';
import { IThirdTransfersAccounts } from '../../../interface/transfer-data-interface';

export interface ITTDForm {
  title: string;
  subtitle: string;
  accountAccreditSelected?: IThirdTransfersAccounts;
  isModifyMode?: boolean;
}

export interface  IDataToTransactionExecute {
  targetAccount: IThirdTransfersAccounts;
  sourceAccount: IAccount;
  formValues: IThirdTransferFormValues;
}

export interface IThirdTransactionSuccessResponse<T = any> {
  status: number;
  message?: string;
  data: T;
}

export interface  IThirdTransactionFailedResponse<T = any> {
  status: number;
  error: string;
  message: string;
  data?: T;
}

export interface IThirdTransferTransactionResponse {
  dateTime: string;
  reference: string;
}
