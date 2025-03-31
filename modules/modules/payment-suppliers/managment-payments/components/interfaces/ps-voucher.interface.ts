import { DateTimeFormat } from '@adf/components';

export interface PSVoucherParameters {
  title: string;
  amount: string;
  credits: string;
}
/* 
export interface SPPDVoucherParameters {
  title: string;
  subtitle: string;
  amount: string;
  credits: string;
  date: string;
  sourceAccount: IAccount;
}

export interface SPPVoucherModalParameters extends Omit<SPPDVoucherParameters, 'title' | 'subtitle'> {
  reference: string;
}

export interface SPPEVoucherParameters {
  amount: string;
  credits: string;
  date: string;
  sourceAccount: IAccount;
  reference: string;
  registers: Array<any>
}

export interface SPPESignatureTrackingParameters extends Omit<SPPEVoucherParameters, 'reference' | 'date'> {}

export interface PdfLayoutSpp extends Omit<SPPEVoucherParameters, 'date'> {
  label: string;
  date: DateTimeFormat
}

export type SPPEVoucherBuilder =
  | { view: typeof SPPPaymentView.DEFAULT, payload: SPPEVoucherParameters }
  | { view: typeof SPPPaymentView.ST_VOUCHER, payload: SPPESignatureTrackingParameters }
 */