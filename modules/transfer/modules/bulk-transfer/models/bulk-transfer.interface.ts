import { DateTimeFormat } from '@adf/components';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { IAccount } from '../../../../../models/account.inteface';
import {
  IExecuteTransactionWithToken,
  IExecuteTransactionWithTokenFailedResponse
} from '../../../../../models/token-service-response.interface';
import { IAchAccount, IAChBulkTransferAccount } from '../../transfer-ach/interfaces/ach-account-interface';
import { IBulTransferFormValues } from '../interfaces/bulk-transfer-parameters.interface';

export type TRow = string | number;
export interface IBTFileResponse {
  fileStatus: 'success' | 'failed';
  file: File | null;
  currentFile: ICurrentFile | null;
  message: string;
  messageStatus: 'error' | 'warning' | 'success';
  messages?: string[] | null;
}

export interface IBulkTransferForm{
  data: IDetailFile;
  schedule?: boolean;
  date?: NgbDate;
  hour?: string;
}

export interface IResponseLote{
  code: number;
  message: string;
  correlative: number;
}

export interface IPreRequestBulkT{
  sourceAccount: IAccount;
  currentFile: ICurrentFile;
}

export interface IPreRequestBulkTRequest {
  sourceProductType: string;
  sourceSubProductType: string;
  sourceAccount: string;
  sourceCurrency: string;
  amount: number;
  numberOfCredits: string;
  lotCode: string;
}


export interface IPreResponseBulkT {
  reference: string;
  dateTime: string;
  segTransactional: string;
}

export interface IHeadingFile {
  key: string;
  sourceAccount: string;
  credits: number;
  totalAmount: number;
  currency: string;
}
export interface IDetailFile {
  key: string;
  identifier: string;
  account: string;
  name: string;
  amount: number;
}


export interface ICurrentFile {
  heading: IHeadingFile;
  details: IDetailFile[];
}

export interface IBulkTransferModal {
  dateTime: DateTimeFormat;
  sourceAccount: IAccount;
  reference: string;
  currentFile: ICurrentFile;
}


export interface IBTPdfBulk {
  dateTime: DateTimeFormat;
  currentFile: ICurrentFile;
  sourceAccount: IAccount;
  reference: string;
  title: string;
  fileName: string;
}

export interface ITransactionResponse{
  dateTime: DateTimeFormat;
  accountDebited: IAchAccount;
  amount: number;
  quantityDebits: number;
  currency: string;
  reference: string;
  tableInfo: IAchAccount[];
}

export interface IParametersToExecuteTransaction {
  lote: IResponseLote;
  sourceAccount: IAccount;
  targetAccounts: IAChBulkTransferAccount[];
  formValues: IBulTransferFormValues | null;
  formatRegister: string;
  fileName: string;
}

export interface IParametersToExecutePreTransfer {
  sourceAccount: IAccount;
  transactionDetail: IHeadingFile;
  loteCode: string;

}

export interface IRequestTransaction{
  sourceAccount: string;
  targetAccount: string;
  amount: number;
  notify: boolean;
  targetBank: number;
  clientId: string;
  clientName: string;
}

export interface IBulkTransferConfirm {
  accountToCredit: IAchAccount;
  accountToDebited: IAchAccount;
  title?: string;
  subtitle?: string;
  message?: string;
}
export interface IBulkVoucherLayout {
  title: string;
  subtitle: string;
  titlePdf: string;
  fileNamePdf: string;
  formValues: IHeadingFile;
  transactionResponse: ITransactionResponse;
  message?: string;
}

export type IBulkTransactionResponse = IExecuteTransactionWithToken<ITransactionResponse> | IExecuteTransactionWithTokenFailedResponse;
