import { EventEmitter } from '@angular/core';
import { ITM365FormValues } from './form-values.interface';
import { IAchAccount } from '../../transfer-ach/interfaces/ach-account-interface';
import { IACHSettings } from '../../transfer-ach/interfaces/settings.interface';
import { TRow } from '../../bulk-transfer/models/bulk-transfer.interface';
import { ITM365AchAccount } from './table.interface';
import { IACHBiesGeneralParameters } from '../../../../../models/ach-general-parameters.interface';

export interface ITM365LoadFileParameters {
  file: File;
  emitter: EventEmitter<any>;
  formValues: ITM365FormValues;
  settings: IACHBiesGeneralParameters;
  workSheetRawValues: Array<Array<TRow>>;
}

export interface ITM365InitLoadFileParameters extends Omit<ITM365LoadFileParameters, 'workSheetRawValues'> {}

export interface ITM365FileLoaded {
  bankCode: string;
  product: string;
  currency: string;
  account: string;
  accountName: string;
  typeClient: 'n' | 'j';
  amount: string;
  email: string;
  comment: string;
}

export enum ETM365FileLoadedKeys {
  BANK_CODE = 'bankCode',
  PRODUCT = 'product',
  CURRENCY = 'currency',
  ACCOUNT = 'account',
  ACCOUNT_NAME = 'accountName',
  TYPE_CLIENT = 'typeClient',
  AMOUNT = 'amount',
  EMAIL = 'email',
  COMMENT = 'comment',
}

export type ITM365FileLoadedList = Array<ITM365FileLoaded>;

export interface TM365FileLoadedStructure {
  accounts: Array<ITM365FileLoaded>;
}

export interface ITM365FileValidationResponse {
  fileLoaded: TM365FileLoadedStructure | null;
  fileRaw: File;
  isSuccessLoadFile: boolean;
  message: string;
}

export interface ITM365FileValidationResponseParameters extends ITM365FileValidationResponse{

}
