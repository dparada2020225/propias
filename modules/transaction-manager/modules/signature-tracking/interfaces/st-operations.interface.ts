import { ITMTransaction } from '../../../interfaces/tm-transaction.interface';
import { IAchAccount } from '../../../../transfer/modules/transfer-ach/interfaces/ach-account-interface';
import { IACHSettings } from '../../../../transfer/modules/transfer-ach/interfaces/settings.interface';
import { IMultipleRequestResponse, ISignatureTrackingMessageOutput } from './signature-tracking.interface';
import {
  IExecuteTransactionWithToken,
  IExecuteTransactionWithTokenFailedResponse
} from '../../../../../models/token-service-response.interface';
import { ESignatureTrackingTypeAction } from '../enum/st-transaction-status.enum';

export interface ISTOperationStartupParameters {
  transactionList: ITMTransaction[];
  servicesSupported: string[];
  currentTabPosition: number;
  fn?: () => void;
}

export interface ISTProcessOperationStartupParameters extends ISTOperationStartupParameters{
  associatedAccounts: IAchAccount[];
  associatedAccountsMap: Map<string, IAchAccount>;
  achSettings: IACHSettings[];
}


export type TDonationProcessResponse = IExecuteTransactionWithToken<IMultipleRequestResponse> | IExecuteTransactionWithTokenFailedResponse | null;
export type TProcessOperationResponse = IExecuteTransactionWithToken<IMultipleRequestResponse> | IExecuteTransactionWithTokenFailedResponse | null;

export interface ISTProcessManageResponse {
  outPutResponse: ISignatureTrackingMessageOutput;
}

export interface ISTManageStepOperationParameters {
  transactionList: ITMTransaction[];
  servicesSupported: string[];
  currentTabPosition: number;
  action: ESignatureTrackingTypeAction;
}
