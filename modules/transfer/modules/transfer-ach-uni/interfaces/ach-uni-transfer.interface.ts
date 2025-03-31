import { IDataReading } from "@adf/components";
import { ACHUniAccount } from "./ach-uni-account-interface";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";


export enum AchUniTypeTransfer {
  CRUD = 'crud',
  TRANSACTION = 'transaction',
}

export interface AchUniFormStorageLayout {
  typeTransfer?: any;
  action?: string;
  accountSelected?: ACHUniAccount;
  debitedAccountSelected?: any;
  formValues?: AchUniFormValues | any;
  voucherConfirmation?: IDataReading;
}


export interface AchUniFormValues {
  originAccount: string;
  amount: string;
  bank: string;
  destinationAccount: string;
  purpose: string;
  comment: string;
  commission: string;
}
