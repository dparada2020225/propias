import { ICrudAchForm } from './crud-form.interface';
import { IACHSettingsToAccounts } from '../settings.interface';
import { ICreateAch } from '../create-account-ach-interface';

export interface IATDCrudCreateVoucher {
  formValues: ICrudAchForm;
  bankSelected: IACHBank;
}

export interface IATDCrudCreateConfirmation {
  formValues: ICrudAchForm;
  datetime: string;
  reference: string;
  bankSelected: IACHBank;
}


export interface IAchCrudTransactionResponse {
  dateTime: string;
  reference: string;
}

export interface IACHBank {
  id: number;
  name: string;
  toAccounts: IACHSettingsToAccounts;
}

export interface IACHAddAccountRequestParameters {
  bodyRequest: ICreateAch;
  isTokenRequired: boolean;
  token?: string;
}
