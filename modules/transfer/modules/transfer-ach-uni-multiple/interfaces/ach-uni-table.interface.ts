import { IAchAccount } from '../../transfer-ach/interfaces/ach-account-interface';
import { ITMAchUniFileLoaded } from './ach-uni-load-file.interface';

export interface ITMAchUniAchAccount extends IAchAccount {
  dataFromFile: ITMAchUniFileLoaded;
}


export interface ITMAchUniTableDefinitionParameters {
  accounts: Array<ITMAchUniAchAccount>;
}

export enum ITMAchUniTableKeys {
  BANK = 'bankName',
  PRODUCT = 'productName',
  CURRENCY = 'currency',
  ACCOUNT = 'account',
  ACCOUNT_NAME = 'name',
  TYPE_PERSON = 'clientType',
  AMOUNT = 'amountFormatted',
  EMAIL = 'email',
  COMMENT = 'comment',
  NAME = 'name'
}
