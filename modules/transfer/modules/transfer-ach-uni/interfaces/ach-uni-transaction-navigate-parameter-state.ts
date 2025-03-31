import { IAccount } from "src/app/models/account.inteface";
import { IACHTransactionResponse } from "../../transfer-ach/interfaces/ach-transfer.interface";
import { AchUniBank } from "./ach-uni-bank";
import { AchUniPurpose } from "./ach-uni-purpose";
import { AchUniFormValues } from "./ach-uni-transfer.interface";


export interface AchUniTransactionNavigateParameterState {
  accountDebited: IAccount;
  accountDestination: IAccount;
  bank: AchUniBank;
  purpose: AchUniPurpose;
  formValues?: AchUniFormValues;
  transactionResponse?: any;
  // transactionResponse?: IACHTransactionResponse;
  message?: string;
  // typeTransaction?: EACHTypeTransaction;
  // accountSelected?: IAccount;
  position?: number;
  action?: string;
  transactionManagerDetail?: any;
  commission: number;
  typeTransaction?: any;
  response?: any;
}


