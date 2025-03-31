import { DateTimeFormat } from '@adf/components';
import { IAccount } from 'src/app/models/account.inteface';
import { ILayoutVoucherSimple } from './own-transfer.interface';

export interface IOTDForm {
  title: string;
  subtitle: string;
  message?: string;
}


export interface IOTDConfirm {
  accountDebited: IAccount;
  accountCredit: IAccount;
  amount: number;
  comment: string;
  title: string;
  subtitle: string;
  reference?: string;
  isSignatureTrackingMode?: boolean;
}

export interface IOTDVoucher {
  accountDebited: IAccount;
  accountCredit: IAccount;
  reference: string;
  dateTime: string;
  formValues: ILayoutVoucherSimple;
  title: string;
  subtitle: string;
}

export interface IOTDVoucherPdf {
  accountToDebited: IAccount;
  accountToCredit: IAccount;
  formValues: ILayoutVoucherSimple;
  date: DateTimeFormat;
  reference: string;
  title: string;
  fileName: string;
}

export interface IOTDVoucherModal {
  accountDebited: IAccount;
  accountAccredit: IAccount;
  dateTime: DateTimeFormat;
  amount: number;
  reference: string;
  comment: string;
}
