import { IAchAccount } from '../../transfer-ach/interfaces/ach-account-interface';
import { ITM365FileLoaded, ITM365FileLoadedList } from './load-file.interface';

export interface ITM365AchAccount extends IAchAccount {
  dataFromFile: ITM365FileLoaded;
}


export interface ITM365TableDefinitionParameters {
  accounts: ITM365FileLoadedList;
}

export enum ITM365TableKeys {
  BANK = 'bankName',
  PRODUCT = 'productName',
  CURRENCY = 'currency',
  ACCOUNT = 'account',
  ACCOUNT_NAME = 'name',
  TYPE_PERSON = 'clientTypeFormatted',
  AMOUNT = 'amountFormatted',
  EMAIL = 'email',
  COMMENT = 'comment'
}
