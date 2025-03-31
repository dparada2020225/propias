import { EventEmitter } from '@angular/core';
import { ITMAchUniFormValues } from './ach-uni-form-values.interface';
import { IAchAccount } from '../../transfer-ach/interfaces/ach-account-interface';
import { IACHSettings } from '../../transfer-ach/interfaces/settings.interface';
import { TRow } from '../../bulk-transfer/models/bulk-transfer.interface';
import { ITMAchUniAchAccount } from './ach-uni-table.interface';

export interface ITMAchUniLoadFileParameters {
  file: File;
  emitter: EventEmitter<any>;
  formValues: ITMAchUniFormValues;
  targetAccountList: Array<IAchAccount>;
  targetAccountListMap: Map<string, IAchAccount>;
  settings: Array<IACHSettings>;
  workSheetRawValues: Array<Array<TRow>>;
}

export interface ITMAchUniInitLoadFileParameters extends Omit<ITMAchUniLoadFileParameters, 'workSheetRawValues'> {}

export interface ITMAchUniFileLoaded {
  bankCode: string;
  product: string;
  currency: string;
  accountNumber: string;
  accountName: string;
  typeClient: 'n' | 'j';
  amount: string;
  email: string;
  description: string;
  lineNumber: number
}

export enum ETMAchUniFileLoadedKeys {
  BANK_CODE = 'bankCode',
  PRODUCT = 'product',
  CURRENCY = 'currency',
  ACCOUNT = 'accountNumber',
  AMOUNT = 'amount',
  COMMENT = 'description',
  NUMBER_LINE = 'lineNumber'
  // ACCOUNT_NAME = 'accountName',
  // TYPE_CLIENT = 'typeClient',
  // EMAIL = 'email',
}

export type ITMAchUniFileLoadedList = Array<ITMAchUniFileLoaded>;

export interface TMAchUniFileLoadedStructure {
  accounts: Array<ITMAchUniAchAccount>;
}

export interface ITMAchUniFileValidationResponse {
  fileLoaded: TMAchUniFileLoadedStructure | null;
  fileRaw: File;
  isSuccessLoadFile: boolean;
  message: string;
  dataInvalid: any;
}

export interface ITMAchUniFileValidationResponseParameters extends ITMAchUniFileValidationResponse{}


export interface ITMAchiUniValidateDataFile{
  clientNumber: string;
  creditCount: string;
  amount: string;
  credits: ITMAchUniCreditInfo[];
}

export interface ITMAchUniCreditInfo{
  bankCode: string;
  product: string;
  currency: string;
  accountNumber: string;
  amount: string;
  description: string;
  lineNumber: number;
}
