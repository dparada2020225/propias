import { IAccount } from '../../../../../models/account.inteface';
import { IDonationAccount, IDonationExecuteDescription, IDonationFormValues } from './donation-account.interface';
import { EDonationTypeTransaction } from '../enum/donation.enum';
import {
  ITransactionManagerAccountDetail,
  ITransactionManagerRequestDetail
} from '../../../../transaction-manager/interfaces/transaction-manger.interface';
import { ITMTransaction } from '../../../../transaction-manager/interfaces/tm-transaction.interface';

export interface IDonationState {
  debitedAccount: IAccount;
  fundationAccount: IDonationAccount;
  formValues: IDonationFormValues;
  transactionResponse?: IDonationExecuteDescription;
  message?: string | null;
  typeTransaction?: EDonationTypeTransaction;
  transactionManagerDetail?: ITransactionManagerRequestDetail;
  transactionSelected?: ITMTransaction;
  position?: number;
  fundationDetailAccount?: ITransactionManagerAccountDetail;
}

