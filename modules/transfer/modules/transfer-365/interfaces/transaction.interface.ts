import { IACHSettings } from '../../transfer-ach/interfaces/settings.interface';
import { IAccount } from '../../../../../models/account.inteface';
import { IAchAccount, V3IAchAccount } from '../../transfer-ach/interfaces/ach-account-interface';
import { I365FormValues } from './state.interface';
import { IUserInfo } from '../../../../../models/user-info.interface';
import { IACHBiesGeneralParameterBank } from '../../../../../models/ach-general-parameters.interface';

export interface I365AcceptTermsAndConditionRequest {
  codeClient: string;
}

export interface I365AcceptTermsAndConditionResponse {
  acceptedUniTerms:  string;
  acceptedT365Terms: string;
  acceptedT365MovilTerms: string;
  acceptedSipaTerms: string;
}

export interface I365TransactionParameters {
  formValues: I365FormValues;
  bankSelected: IACHBiesGeneralParameterBank;
  sourceAccountSelected: IAccount;
  targetAccountSelected: V3IAchAccount;
  userInfo: IUserInfo;
}
