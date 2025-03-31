import {
  IAchAccount,
  IAChBulkTransferAccount
} from '../../../../transfer/modules/transfer-ach/interfaces/ach-account-interface';
import { ITMTransaction } from '../../../interfaces/tm-transaction.interface';
import { IAccount } from '../../../../../models/account.inteface';
import { IACHSettings } from '../../../../transfer/modules/transfer-ach/interfaces/settings.interface';
import { ISTProcessExecuteMultipleBulkTransferParameters } from './st-process-multiple.interface';
import {
  IBulTransferFormValues
} from '../../../../transfer/modules/bulk-transfer/interfaces/bulk-transfer-parameters.interface';

export interface IACHProcessSingleTransactionParameters {
  associatedAccounts: IAchAccount[];
  transaction: ITMTransaction;
  sourceAccount: IAccount;
  achSettings: IACHSettings[];
}

export interface IMassiveACHTransferProcessParameters {
  parameters: ISTProcessExecuteMultipleBulkTransferParameters;
  targetAccount: IAChBulkTransferAccount[];
  formValues: IBulTransferFormValues | null;
}
