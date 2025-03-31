import { DateTimeFormat, IConfirmationModal, IDataReading, IHeadBandAttribute } from '@adf/components';
import { IAccount } from 'src/app/models/account.inteface';
import { IPrint } from '../../../interface/print-data-interface';
import { IDonationAccount, IDonationFormValues } from './donation-account.interface';

export interface IDTDFormRequest {
  title: string;
  subtitle: string;
  message?: string;
  typeAlert?: string;
}

export interface IDTDConfirmationRequest {
  title: string;
  subtitle: string;
  accountDebited: IAccount;
  fundationAccount: IDonationAccount;
  amount: number;
  isAmountFromST?: boolean;
}


export interface IDTDModal {
  accountDebited: IAccount;
  fundationAccount: IDonationAccount;
  amount: number;
  dateTime: DateTimeFormat;
  reference: string;
}

export interface IDTDPdf {
  accountDebited: IAccount;
  fundationAccredit: IDonationAccount;
  formValues: IDonationFormValues;
  date: DateTimeFormat;
  referenceNumber: string;
  title: string;
  fileName: string;
}

export interface IDTDVoucherBuilder {
  date: string;
  titlePdf: string;
  reference: string;
  fileNamePdf: string;
  fundationAccount: IDonationAccount;
  accountDebited: IAccount;
  formValues: IDonationFormValues;
  title: string;
  subtitle: string;
  isAmountFromST?: boolean;
}

export interface IDTDVoucherSample {
  accountDebited: IAccount;
  fundationAccount: IDonationAccount;
  referenceNumber: string;
  dateTime: string;
  amount: number;
  title: string;
  subtitle: string;
  isAmountFromST?: boolean;
}


export interface IDonationVoucherBuilder {
  layoutVoucher: IDataReading;
  headBandLayout: IHeadBandAttribute[];
  layoutVoucherModal: IConfirmationModal;
  pdfLayout: IPrint;
}

export interface IDonationDataExecute {
  fundationAccount: IDonationAccount;
  debitedAccount: IAccount;
  formValues: IDonationFormValues;
}


export interface IDonationPropertiesPersists extends IDonationDataExecute {
  reference?: string;
  dateTime?: DateTimeFormat;
}
