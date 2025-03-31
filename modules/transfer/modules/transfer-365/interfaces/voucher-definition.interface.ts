import { IACHSettings } from '../../transfer-ach/interfaces/settings.interface';
import { IAccount } from '../../../../../models/account.inteface';
import { IAchAccount, V3IAchAccount } from '../../transfer-ach/interfaces/ach-account-interface';
import { I365FormValues } from './state.interface';
import { IACHBiesGeneralParameterBank } from '../../../../../models/ach-general-parameters.interface';

export interface I365VoucherConfirmationLayoutParameters {
  formValues: I365FormValues;
  bankSelected: IACHBiesGeneralParameterBank;
  sourceAccountSelected: IAccount;
  targetAccountSelected: V3IAchAccount;
}

export interface I365ModalLayoutParameters extends I365VoucherConfirmationLayoutParameters {
  transactionResponse: {
    reference: string;
    dateTime: string;
  }
}
