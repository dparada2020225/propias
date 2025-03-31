import {IConfirmationModal, IDataReading, IDataSelect, IHeadBandAttribute, ILayout} from '@adf/components';
import {FormGroup} from '@angular/forms';
import {IPrint} from '../../../interface/print-data-interface';
import {ILayoutVoucherSimple, IOwnAccount, IOwnTransferFormValues} from './own-transfer.interface';
import {IFlowError} from '../../../../../models/error.interface';
import {IAccount} from 'src/app/models/account.inteface';
import {
  ITransactionFailedResponse,
  ITransactionSuccessResponse
} from '../../../../../models/utils-transaction.interface';
import {IResponseOwnTransfers} from './own-transfer-respoce.interface';
import {
  IMultipleRequestResponse
} from '../../../../transaction-manager/modules/signature-tracking/interfaces/signature-tracking.interface';

export interface IOTEInitStep1Request {
  title: string;
  subtitle: string;
  accountDebitList: IOwnAccount[] | IFlowError;
  accountCreditList: IOwnAccount[] | IFlowError;
}

export interface IOTEInitStep1Responce {
  layoutOwnTransfer: ILayout;
  ownTransferForm: FormGroup;
  optionsList: IDataSelect[];
  error: string;
}

export interface IOTEChangeAccountDebitedResponce {
  accountDebitedSelected: IOwnAccount;
  layoutOwnTransfer: ILayout;
  optionsList: IDataSelect[];
}

export interface IOTEChangeAccountCreditResponce {
  accountCreditSelected: IOwnAccount;
  layoutOwnTransfer: ILayout;
  optionsList: IDataSelect[];
}

export interface IOTEVoucherLayoutRequest {
  title: string;
  subtitle: string;
  date: string;
  titlePdf: string;
  reference: string;
  fileNamePdf: string;
  accountCredit: IAccount;
  accountDebited: IAccount;
  formValues: ILayoutVoucherSimple;
  isAmountFromST?: boolean;
}

export interface IOTEVoucherLayoutRenponce {
  pdfLayout: IPrint;
  headBandLayout: IHeadBandAttribute[];
  layoutJsonVoucher: IDataReading | null;
  layoutJsonVoucherModal: IConfirmationModal;
}


export interface IOTExecuteTransaction {
  formValues: IOwnTransferFormValues;
  sourceAccount: IOwnAccount;
  targetAccount: IOwnAccount;
}

export type TOwnTransactionResponse =
  ITransactionSuccessResponse<IResponseOwnTransfers>
  | ITransactionFailedResponse<IResponseOwnTransfers>;
export type TOwnTransactionModifyResponse =
  ITransactionSuccessResponse<IMultipleRequestResponse>
  | ITransactionFailedResponse<IResponseOwnTransfers>;

export const TYPE_OWN_TRANSFERENCE = 'OWN_TRANSFER';
export const TYPE_OWN_MODIFY_TRANSFERENCE = 'OWN_MODIFY_TRANSFER';

