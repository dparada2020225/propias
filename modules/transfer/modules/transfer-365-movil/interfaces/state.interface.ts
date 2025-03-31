import { IAccount } from '../../../../../models/account.inteface';
import { IACHSettings } from '../../transfer-ach/interfaces/settings.interface';
import { IM365BeneficiaryRegistered } from './transaction.interface';
import { EM365TypeLoadBeneficiary } from '../enum/form-control.enum';
import { IM365BaseFormValues, IM365FormValues } from './form.interface';
import { ITMTransaction } from '../../../../transaction-manager/interfaces/tm-transaction.interface';
import {
  ITMRequestDetailACHBiesTransaction
} from '../../../../transaction-manager/interfaces/transaction-manager-bies.interface';
import { IACHBiesGeneralParameterBank } from '../../../../../models/ach-general-parameters.interface';
import {
  AM365Account
} from '../../../../accounts-management/modules/t365-movil/interfaces/associated-account.interface';

export interface M365StateHome {
  sourceAccountSelected: IAccount;
  bankSettingSelected: IACHBiesGeneralParameterBank;
  beneficiarySelected: AM365Account | undefined;
  typeLoadBeneficiary: EM365TypeLoadBeneficiary;
  formValues: IM365FormValues;
  baseFormValues: IM365BaseFormValues;
}

export interface M3635StateConfirmation extends M365StateHome {
  transactionResponse: any;
  message: string | undefined;
  typeTransaction: string;
}

export interface M365StDetail {
  sourceAccountSelected: IAccount;
  bankSettingSelected: IACHBiesGeneralParameterBank;
  transactionManagerDetail: ITMRequestDetailACHBiesTransaction;
  transactionSelected: ITMTransaction;
  transactionResponse: any;
  typeTransaction: string;
  formValues: IM365FormValues;
  position: number;
}

export interface M365StOperation extends M365StDetail {
  action: string;
}
