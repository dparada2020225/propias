import { IAccount } from "src/app/models/account.inteface";
import { IDonationAccount } from '../../../../transfer/modules/donation/interfaces/donation-account.interface';
import { ITMTransaction } from '../../../interfaces/tm-transaction.interface';
import {
  ITMRequestDetailACHTransaction,
  ITMRequestDetailThirdPartyLoanPayment, ITransactionManagerAccountDetail
} from '../../../interfaces/transaction-manger.interface';
import { ETransactionStatus } from '../enum/st-common.enum';
import { IThirdTransfersAccounts } from '../../../../transfer/interface/transfer-data-interface';
import { IOwnAccount } from '../../../../transfer/modules/transfer-own/interfaces/own-transfer.interface';
import { IAchAccount } from '../../../../transfer/modules/transfer-ach/interfaces/ach-account-interface';
import { IAchFormValues } from '../../../../transfer/modules/transfer-ach/interfaces/ach-transfer.interface';
import { IACHScheduleResponse } from '../../../../transfer/modules/transfer-ach/interfaces/ach-transaction.interface';

export interface ISTOperationHandlerParameter {
  transaction: ITMTransaction
  signatureType: string;
  message: string | null;
  position: number;
}

export interface IProcessSTOperations extends ISTOperationHandlerParameter {
  transactionStatus: ETransactionStatus;
  action: string;
}

export interface IProcessSTOperationsWithToken {
  isTokenRequired: boolean;
  token: string;
  typeTransaction: string;
  processProperties: IProcessSTOperations;
}

export interface ISTBodyUpdateTransactionBase<T = any, H = any, D = any> {
  sourceAccount: T;
  targetAccount: H;
  detailAccountToUpdate: D;
  amount?: number;
  comment?: string;
  email?: string;
}

export type ISTBodyUpdateTransaction = ISTBodyRequestOwnTransaction | ISTBodyRequestDonationTransaction | ISTBodyRequestThirdTransaction;

export interface ISTBodyRequestOwnTransaction extends ISTBodyUpdateTransactionBase<IOwnAccount, IOwnAccount> {}
export interface ISTBodyRequestThirdTransaction extends ISTBodyUpdateTransactionBase<IAccount, IThirdTransfersAccounts> {}
export interface ISTBodyRequestDonationTransaction extends ISTBodyUpdateTransactionBase<IAccount, IDonationAccount> {
  fundationAccount: ITransactionManagerAccountDetail;
}
export interface ISTBodyRequestACHTransaction extends ISTBodyUpdateTransactionBase<IAccount, IAchAccount, ITMRequestDetailACHTransaction> {
  formValues: IAchFormValues;
  hourSelected: IACHScheduleResponse | null;
}
export interface ISTBodyRequestThirdPartyLoanTransaction extends ISTBodyUpdateTransactionBase<IAccount, IAccount, ITMRequestDetailThirdPartyLoanPayment> {
  receiptNumber?: string;
  typePayment?: string;
  quotasSelected?: string;
}
