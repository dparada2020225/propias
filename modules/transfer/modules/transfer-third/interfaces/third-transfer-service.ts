import { HttpStatusCode } from '../../../../../enums/http-status-code.enum';
import {
  ITransactionFailedResponse,
  ITransactionSuccessResponse
} from '../../../../../models/utils-transaction.interface';
import { ITMTransaction } from '../../../../transaction-manager/interfaces/tm-transaction.interface';
import {
  ITransactionManagerRequestDetail
} from '../../../../transaction-manager/interfaces/transaction-manger.interface';


export interface ICrateAccountThirdTransferResponse {
  reference: string;
  account: string;
  product: number;
  name: string;
  status: string;
  currency: string;
  alias: string;
  email: string;
  favorite: boolean;
  dateTime: string
}

export interface IGetThirdTransferResponse {
  account: string;
  productType: string;
  product: number;
  name: string;
  mask: string,
  status: string;
  currency: string;
  subProductType: string,
  currencyCode: string,
  currencyName: string
}

export interface ITransferThird {
  email: string,
  description: string,
  reference: string,
  date: string,
  rate: number,
  targetAccount: ITargetAccount,
  sourceAccount: ISourceAccount
}

export interface ITargetAccount {
  currency: string,
  type: string,
  account: string,
  alias: string
  amount: number
}

export interface ISourceAccount {
  currency: string,
  type: string,
  account: string,
  alias: string,
  amount: number,
  balanceGeneralInformation: IBalanceGeneralInformation
}

export interface IBalanceGeneralInformation {
  countableBalance: string,
  authorizedOverdraft: string,
  locks: string,
  reservation: string,
  availableBalance: string
}

export interface  IThirdTransferToSignatureTransfer {
  status: HttpStatusCode.SIGNATURE_TRACKING;
  message: string;
}


export interface IThirdTransferTransactionResponse {
  dateTime: string;
  reference: string;
}

export type TThirdTransferAddAccount = ITransactionSuccessResponse<ICrateAccountThirdTransferResponse> | ITransactionFailedResponse;

export interface IThirdTransferNotifyRequest {
  reference: string;
  amount: string;
  sourceAccount: string;
  sourceAccountName: string;
  targetAccount: string;
  targetAccountName: string;
  email: string;
}

export interface ISTThirdPartyTransferNotifyParameters {
  transactionSelected: ITMTransaction;
  transactionDetail: ITransactionManagerRequestDetail;
  sourceAccount: IGetThirdTransferResponse;
  targetAccount: IGetThirdTransferResponse;
}

export interface ISTThirdPartyTransferProcess {
  transactionSelected: ITMTransaction;
  signatureType: string;
  sourceAccountName: string;
  targetAccountName: string;
  transactionDetail?: ITransactionManagerRequestDetail;
}
