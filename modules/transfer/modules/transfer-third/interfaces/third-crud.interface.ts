import { DateTimeFormat, IConfirmationModal, IDataReading, IHeadBandAttribute } from '@adf/components';
import { IAccount } from 'src/app/models/account.inteface';
import { IPrint } from '../../../interface/print-data-interface';
import { IThirdTransfersAccounts } from '../../../interface/transfer-data-interface';
import { ICreateThird } from './crud/create-third-interface';
import { IGetThirdTransferResponse } from './third-transfer-service';

export interface IThirdTransferPdf {
  account: IAccount;
  referenceNumber: string;
  title: string;
  fileName: string;
}

export interface IAddFavoriteThird {
  number: string;
  alias: string;
}

export interface ITTDCreateConfirm {
  reference: string;
  account: ICreateThird;
  alias: string;
  email: string;
  detailAccount: IGetThirdTransferResponse;
  date?: string;
}

export interface ITTDCreateConfirmVoucher {
  reference: string;
  account: ICreateThird;
  alias: string;
  email: string;
  detailAccount: IGetThirdTransferResponse;
  date: DateTimeFormat;
}

export interface ITTDCrudLayoutRenponce {
  headBandLayout: IHeadBandAttribute[];
  layoutJsonCrud: IDataReading | null;
  layoutJsonCrudModal?: IConfirmationModal;
  pdfLayout?: IPrint;
}

export interface ITTDCrudLayoutUpdate {
  layoutJsonCrud: IDataReading | null;
  layoutJsonCrudModal?: IConfirmationModal;
  pdfLayout?: IPrint;
}

export interface ITTDUpdateConfirm {
  account: IThirdTransfersAccounts;
  formValues: IThirdTransferUpdateFormValues;
  reference: string;
  dateTime?: string;
}

export interface ITTDUpdateConfirmModal {
  formValues: IThirdTransferUpdateFormValues;
  reference: string;
  dateTime: DateTimeFormat;
}

export interface IThirdTransferUpdateFormValues {
  email?: string;
  alias: string;
}

export interface ITTDDeleteConfirm {
  account: IThirdTransfersAccounts;
  reference: string;
  date?: string;
}
