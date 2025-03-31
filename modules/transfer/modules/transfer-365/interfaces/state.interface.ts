import { IACHSettings } from '../../transfer-ach/interfaces/settings.interface';
import { IAccount } from '../../../../../models/account.inteface';
import { IAchAccount, V3IAchAccount } from '../../transfer-ach/interfaces/ach-account-interface';
import {
  ITMRequestDetailACHBiesTransaction
} from '../../../../transaction-manager/interfaces/transaction-manager-bies.interface';
import { ITMTransaction } from '../../../../transaction-manager/interfaces/tm-transaction.interface';
import { IACHBiesGeneralParameterBank } from '../../../../../models/ach-general-parameters.interface';

export interface I365FormValues {
  sourceAccount: string;
  amount: string;
  bank: string;
  isShowFavorites: boolean;
  targetAccount: string;
  comment: string;
}

export interface I365HomeState {
  formValues: I365FormValues;
  bankSelected: IACHBiesGeneralParameterBank;
  sourceAccountSelected: IAccount;
  targetAccountSelected: V3IAchAccount;
}

export interface I365ConfirmationState extends I365HomeState {
  transactionResponse: any;
  message: string | undefined;
  typeTransaction: string;
}

export interface I365StDetailSTate {
  sourceAccountSelected: IAccount;
  targetAccountSelected: V3IAchAccount;
  bankSelected: IACHBiesGeneralParameterBank;
  transactionManagerDetail: ITMRequestDetailACHBiesTransaction;
  transactionSelected: ITMTransaction;
  transactionResponse: any;
  typeTransaction: string;
  formValues: I365FormValues;
  position: number;
}

export interface I365StOperationState extends I365StDetailSTate {
  action: string;
}
