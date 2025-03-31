import { IBTSaveTransactionRequest } from './bt-transaction.interface';
import { IFlowError } from '../../../../../models/error.interface';
import { IAchAccount } from '../../transfer-ach/interfaces/ach-account-interface';

export interface IBTParsedTargetAccountParameters {
  response: IBTSaveTransactionRequest | IFlowError;
  currency: string;
  associatedAccounts: Map<string, IAchAccount>;
}
