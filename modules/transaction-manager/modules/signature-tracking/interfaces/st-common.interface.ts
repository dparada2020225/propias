
import { ITMTransaction } from '../../../interfaces/tm-transaction.interface';
import { ETransactionStatus } from '../enum/st-common.enum';
import { ISignatureTrackingServiceResponse, ISignatureTrackingTable } from './signature-tracking.interface';
import { ITableStructure } from '@adf/components';

export interface ISTFailedTransactionModalParameters {
  transactionResponseList: ISignatureTrackingServiceResponse[];
  fn?: (n: ISignatureTrackingServiceResponse[]) => void;
}

export interface ISendStartupParameters {
  transaction: ITMTransaction;
  signatureType: string;
  transactionStatus: ETransactionStatus;
}

export interface ISignatureTrackingCheckedAccountsState {
  structure: ITableStructure<ISignatureTrackingTable>,
  accounts: ITMTransaction[],
  position: string
  action?: string
}
