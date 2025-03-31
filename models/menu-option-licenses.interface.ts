import { TableOption } from '../modules/transfer/interface/table.enum';

export interface  IMenuOptionsLicenses {
  service: string;
  description: string;
  options: IMenuOptionLicenses[];
}

export  interface  IMenuOptionLicenses {
  code: string;
  description: string;
}


export interface IMenuOptionLicensesParams {
  idClient: string;
  idService: string;
}

export interface  IMenuLicensesResponse {
  [key: string]: boolean;
}


export enum EMenuOptionLicenses {
  ADD = 'add',
  MODIFY = 'modify',
  DELETE = 'delete',
  TRANSFER = 'transfer',
  PAY = 'pay'
}

export const MENU_OPTION_LICENSES_MAP =  {
  [EMenuOptionLicenses.ADD]: TableOption.CREATE,
  [EMenuOptionLicenses.MODIFY]: TableOption.UPDATE,
  [EMenuOptionLicenses.DELETE]: TableOption.DELETE,
  [EMenuOptionLicenses.TRANSFER]: TableOption.TRANSFER,
  [EMenuOptionLicenses.PAY]: TableOption.PAYMENT,
};
