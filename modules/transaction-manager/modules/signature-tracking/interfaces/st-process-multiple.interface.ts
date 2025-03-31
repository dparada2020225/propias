import { ITMTransaction } from '../../../interfaces/tm-transaction.interface';
import {
  ITMRequestDetailBulkTransaction, ITMRequestDetailThirdPartyLoanPayment,
} from '../../../interfaces/transaction-manger.interface';
import { IMultipleRequestResponse } from './signature-tracking.interface';
import { IAccount } from '../../../../../models/account.inteface';
import {
  IBTSaveTransactionRequest
} from '../../../../transfer/modules/bulk-transfer/interfaces/bt-transaction.interface';
import { IProcessSTOperations } from './st-transfer.interface';
import { IACHSettings } from '../../../../transfer/modules/transfer-ach/interfaces/settings.interface';
import { IAchAccount } from '../../../../transfer/modules/transfer-ach/interfaces/ach-account-interface';
import {
  IBulTransferFormValues
} from '../../../../transfer/modules/bulk-transfer/interfaces/bulk-transfer-parameters.interface';

export interface ISTProcessMultipleDonationParameters<T = any> {
  transactionSelected: ITMTransaction;
  transactionDetail: T;
}

export interface ISTProcessTPLPaymentParameters extends ISTProcessMultipleDonationParameters<ITMRequestDetailThirdPartyLoanPayment> {
}

export interface ISTProcessExecuteMultipleDonationParameters extends ISTProcessMultipleDonationParameters {
  processTransactionResponse: IMultipleRequestResponse;
}

export interface IHandleProcessMultipleDonationTransaction {
  startupProcessParameters: IProcessSTOperations;
  transactionSelected: ITMTransaction;
  isTokenRequired?: boolean;
  tokenValue?: string;
}

export interface ISTProcessExecuteMultipleBulkTransferParameters {
  transactionSelected: ITMTransaction;
  transactionDetail: ITMRequestDetailBulkTransaction;
  sourceAccount: IAccount;
  accountsToTransaction: IBTSaveTransactionRequest;
}

export interface IStartupParametersToMultipleProcessTransaction {
  transactionSelected: ITMTransaction;
  signatureType: string;
  achSettings: IACHSettings[];
  achAssociatedAccounts: IAchAccount[]
  achAssociatedAccountsMap: Map<string, IAchAccount>;
}

export interface IStartupParametersToExecuteRetryProcessPaymentOfPayroll {
  transactions: any[];
  signatureType: string;
}

export interface IBTProcessStartupParameters {
  transactionSelected: ITMTransaction;
  achSettings: IACHSettings[];
  achAssociatedAccounts: IAchAccount[];
  achAssociatedAccountsLoaded?: IBTSaveTransactionRequest;
  sourceAccountLoaded?: IAccount;
  formValues?: IBulTransferFormValues | null;
}

export interface IStProcessMultipleCoreParameters {
  signatureType: string;
  achSettings: IACHSettings[];
  achAssociatedAccounts: IAchAccount[]
  achAssociatedAccountsMap: Map<string, IAchAccount>;
  transactionList: ITMTransaction[]
}

export interface IBTProcessStartupParametersExtended extends Omit<IBTProcessStartupParameters, 'achAssociatedAccounts'> {
  achAssociatedAccounts: Map<string, IAchAccount>;
}
