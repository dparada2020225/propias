import { ACHUniAccount } from "./ach-uni-account-interface";
import { AchUniBank } from "./ach-uni-bank";
import { AchUniPurpose } from "./ach-uni-purpose";
import { IFlowError } from '../../../../../models/error.interface';
import { IAchAccount } from "../../transfer-ach/interfaces/ach-account-interface";
import { IConfirmationModal, IDataReading, IDataSelect, IHeadBandAttribute, ILayout } from "@adf/components";
import { FormGroup } from "@angular/forms";
import { IAccount } from "src/app/models/account.inteface";
import { AchUniFormValues } from "./ach-uni-transfer.interface";
import { AchUniExecuteTransaccionResponse } from "./ach-uni-execute-transaccion-response";
import { IPrint } from "../../../interface/print-data-interface";

export interface AchUniDefinition {
}

export interface HeaderTransferACHUNIForm {
  title: string;
  subtitle: string;
  message?: string;
}

export interface AchUniTransferInitForm {

  title: string;
  subtitle: string;
  sourceAccountList: ACHUniAccount[] | IFlowError;
  // nameAccount: string;
  // available: string;
  // amount: string;
  bankList: AchUniBank[] | IFlowError;
  accountCredit: IAchAccount | undefined;
  // typeAccount: string;
  targetAccountList: IAccount[] | IFlowError;
  purposeList: AchUniPurpose[] | IFlowError;
  // comment: string;
  commission: string;
  isModify?: boolean;
}

export interface AchUniFormStartupParameters {
  title: string;
  subtitle: string;
  isModify: boolean;
  targetAccountSelected?: IAccount;
  commission: string;
}

export interface AchUniInitFormResponse {
  transferFormLayout: ILayout;
  transferForm: FormGroup;
  optionList: IDataSelect[];
  error: string | undefined;
}

export interface IAchUniVoucherLayout {
  title?: string;
  subtitle: string;
  titlePdf: string;
  fileNamePdf: string;
  formValues: AchUniFormValues;
  sourceAccount: ACHUniAccount;
  targetAccount: IAccount;
  purpose: AchUniPurpose;
  bank: AchUniBank;
  commission: string;
  reference: string;
  dateTime: string;
}

export interface IAchUniDVoucher {
  transactionResponse: AchUniExecuteTransaccionResponse;
  formValues: AchUniFormValues;
  title: string;
  subtitle: string;
  sourceAccount: IAccount;
  targetAccount: IAccount;
  purpose: AchUniPurpose;
  bank: AchUniBank;
  commission: string;
  reference: string;
  dateTime: string;
  transactionSelected?: any;
}

export interface IAchUniDPdf {
  transactionResponse: AchUniExecuteTransaccionResponse;
  formValues: AchUniFormValues;
  title: string;
  fileName: string;
  sourceAccount: IAccount;
  targetAccount: IAccount;
  purpose: AchUniPurpose;
  bank: AchUniBank;
  commission: string;
  reference: string;
  dateTime: string;
}

export interface IAchUniModalLayout {
  transactionResponse: AchUniExecuteTransaccionResponse;
  formValues: AchUniFormValues;
  sourceAccount: IAccount;
  targetAccount: IAccount;
  purpose: AchUniPurpose;
  bank: AchUniBank;
  commission: string;
  reference: string;
  dateTime: string;
}


export interface IAchUniMainLayoutResponse {
  voucherLayout: IDataReading | null;
  headBandLayout: IHeadBandAttribute[];
  voucherModalLayout: IConfirmationModal | null;
  pdfLayout: IPrint | null;
}
