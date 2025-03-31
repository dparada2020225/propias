import { IConfirmationModal, IDataReading, IDataSelect, IHeadBandAttribute, ILayout } from '@adf/components';
import { IAccount } from '../../../../../models/account.inteface';
import { IFlowError } from '../../../../../models/error.interface';
import { IAchAccount } from './ach-account-interface';
import { IAchFormValues, IACHTransactionResponse } from './ach-transfer.interface';
import { FormGroup } from '@angular/forms';
import { IPrint } from '../../../interface/print-data-interface';

export interface IATDPdf {
  transactionResponse: IACHTransactionResponse;
  formValues: IAchFormValues;
  title: string;
  fileName: string;
  sourceAccount: IAccount;
  targetAccount: IAchAccount;
}

export interface IATDConfirm {
  accountToDebited: IAccount;
  accountToCredit: IAchAccount;
  formValues: IAchFormValues;
  title?: string;
  subtitle?: string;
  message?: string;
}

export interface IATDVoucher {
  transactionResponse: IACHTransactionResponse;
  formValues: IAchFormValues;
  title: string;
  subtitle: string;
  sourceAccount: IAccount;
  targetAccount: IAchAccount;
}

export interface IATEInitForm {
  title: string;
  subtitle: string;
  accountDebitedList: IAccount[] | IFlowError;
  accountCreditList?: IAchAccount[] | IFlowError;
  accountCredit: IAchAccount;
  isModify?: boolean;
}

export interface IATEVoucherLayout {
  title: string;
  subtitle: string;
  titlePdf: string;
  fileNamePdf: string;
  formValues: IAchFormValues;
  sourceAccount: IAccount;
  reference: string;
  dateTime: string;
  targetAccount: IAchAccount;
}

export interface IATEModalLayout {
  transactionResponse: IACHTransactionResponse;
  formValues: IAchFormValues;
  sourceAccount: IAccount;
  targetAccount: IAchAccount;
}

export interface IATEFormStartupParameters {
  title: string;
  subtitle: string;
  isModify: boolean;
  targetAccountSelected?: IAchAccount;
}

export interface IATEChangeDebitedAccountResponse {
  transferFormLayout: ILayout;
  accountDebited?: IAccount;
}

export interface ITTEInitFormResponse {
  transferFormLayout: ILayout;
  transferForm: FormGroup;
  optionList: IDataSelect[];
  error: string | undefined;
}

export interface IATEMainLayoutResponse {
  voucherLayout: IDataReading | null;
  headBandLayout: IHeadBandAttribute[];
  voucherModalLayout: IConfirmationModal | null;
  pdfLayout: IPrint | null;
}
