import { IM365FormValues } from './form.interface';
import { IAccount } from '../../../../../models/account.inteface';
import { IACHBiesGeneralParameterBank } from '../../../../../models/ach-general-parameters.interface';
import {
  AM365Account
} from '../../../../accounts-management/modules/t365-movil/interfaces/associated-account.interface';

export interface IM365VoucherDefinitionParameters {
  bankSettingSelected: IACHBiesGeneralParameterBank;
  beneficiarySelected: AM365Account | undefined;
  formValues: IM365FormValues;
}

export interface M365VoucherLayoutParameters extends IM365VoucherDefinitionParameters {
  sourceAccountSelected: IAccount;
}

export interface M365ModalLayoutParameters extends M365VoucherLayoutParameters {
  transactionResponse: any;
}
