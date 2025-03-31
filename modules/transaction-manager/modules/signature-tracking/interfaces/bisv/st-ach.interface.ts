import { ITMTransaction } from '../../../../interfaces/tm-transaction.interface';
import {
  TBisvMassiveAchLoteDetailMappedResponse
} from '../../../../../transfer/modules/transfer-ach-uni-multiple/interfaces/lote-detail.interface';
import {
  AchUniStatusTermsResponse
} from '../../../../../transfer/modules/transfer-ach-uni/interfaces/ach-uni-status-terms-response';
import {
  IOwnAccount,
} from '../../../../../transfer/modules/transfer-own/interfaces/own-transfer.interface';
import { IAccount } from '../../../../../../models/account.inteface';
import { IT365TermAndConditionResponse } from '../../../../../accounts-management/interfaces/terms-condition.interface';


export interface IStBisvAchMassiveTransferStartupParameters {
  transaction: ITMTransaction;
  signatureType: string;
  loteDetail: TBisvMassiveAchLoteDetailMappedResponse | undefined;
  sourceAccount: IAccount | undefined;
  token?: string
  isTokenRequired?: boolean;
}

export interface IStBisvAchMassiveTransferAccountResponse extends IStBisvAchMassiveTransferStartupParameters {
  sourceAccountResponse: IOwnAccount;
}

export interface IStBisvAchMassiveTransferTermsResponse extends IStBisvAchMassiveTransferStartupParameters {
  response: AchUniStatusTermsResponse;
}

export interface IStBisvAchMassiveLoteDetailTransferResponse extends  IStBisvAchMassiveTransferStartupParameters {
  responseLote: TBisvMassiveAchLoteDetailMappedResponse;
  sourceAccountResponse: IOwnAccount;
}

export interface STACHMassiveNotificationRequest {
  lot: string;
  accountDebit: string;
  accountDebitName: string;
  creditsQuantity: string;
  currency: string;
  totalCreditAmount: string;
}

export interface IStACHGenericNotifyRequest {
  sourceAccount: string;
  dateTime:      string;
  amount:        string;
  reference:     string;
  currency:      string;
}
export interface IBiesHandleTransaction {
  transaction: ITMTransaction;
  signatureType: string;
  isTokenRequired?: boolean;
  token?: string;
}

export interface IBiesHandleResponseTermsAndCondition extends IBiesHandleTransaction {
  response: IT365TermAndConditionResponse;
}
