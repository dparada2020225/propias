import { IACHScheduleResponse } from './ach-transaction.interface';

export interface IACHSettings {
  id: number;
  name: string;
  toAccounts: IACHSettingsToAccounts;
}

export interface IACHSettingsToAccounts {
  CHECKING?: IACHCurrencies[];
  SAVINGS: IACHCurrencies[];
  LOAN?: IACHCurrencies[];
  CREDIT_CARD?: IACHCurrencies[];
}

export interface IACHCurrencies {
  toCurrency: ToCurrency;
  fromAccounts: FromAccounts;
  length: Length;
  routeCode: string;
  internalProduct: string;
}

interface FromAccounts {
  LOAN: { [key: string]: CHECKINGValue };
  CHECKING: { [key: string]: CHECKINGValue };
  SAVINGS: { [key: string]: CHECKINGValue };
  FIXED: { [key: string]: CHECKINGValue };
  CREDIT_CARD: { [key: string]: CHECKINGValue };
}

interface CHECKINGValue {
  juridical: Juridical;
  singular: Juridical;
}

interface Juridical {
  min: string;
  max: string;
}

interface Length {
  min: number;
  max: number;
}

export enum ToCurrency {
  Hnl = 'HNL',
  Usd = 'USD',
}

export interface  IDataToSettingsACH {
  routeCode: string;
  internalProduct: string;
}

export interface IBuildScheduleParameter {
  listSchedule: IACHScheduleResponse[];
  controlName: string;
}
