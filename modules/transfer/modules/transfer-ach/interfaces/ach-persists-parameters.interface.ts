import { IAchAccount } from './ach-account-interface';
import { IAccount } from '../../../../../models/account.inteface';
import { IAchFormValues, IACHTransactionResponse } from './ach-transfer.interface';
import { EACHTypeTransaction } from '../enum/transfer-ach.enum';
import { ITMTransaction } from '../../../../transaction-manager/interfaces/tm-transaction.interface';
import { IACHScheduleResponse } from './ach-transaction.interface';

export interface  IACHTransactionNavigateParametersState {
  targetAccount: IAchAccount;
  associatedAccount?: IAchAccount;
  sourceAccount?: IAccount;
  formValues?: IAchFormValues;
  transactionResponse?: IACHTransactionResponse;
  message?: string;
  typeTransaction?: EACHTypeTransaction;
  accountSelected?: IAchAccount;
  position?: number;
  action?: string;
  transactionManagerDetail?: any;
  transactionSelected?: ITMTransaction;
  hourSelected?: IACHScheduleResponse | string | null;
}
