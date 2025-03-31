import {TCACH_MOVEMENTS} from "../const/cach-common.enum";

export interface ICADDetailTransactionParameters {
  detailTransaction: ICOResponseAccount | null;
  reference: string;
}

export interface ICADDetailTransactionPDFParameters {
  detailTransaction: ICOResponseAccount | null;
  reference: string;
}

export interface ICADDetailTransactionModalParameters {
  detailTransaction: ICOResponseAccount | null;
  reference: string;
}


export interface ICOTransactionCredit {
  typeOperation: string;
  filterValue: string;
  initDate: any;
  finalDate: any;
}

export interface ICOTransactionDebits {
  initDate: any;
  finalDate: any;
}




export interface ICOResponseDebits {
  code:    number;
  message: string;
  debits:  ICACHDebitRegisters[];
}

export interface ICACHDebitRegisters {
  date:          string;
  operation:     string;
  operationType: string;
  beneficiary:   string;
  remitter:      string;
  issuingBank:   string;
  receivingBank: string;
  status:        string;
  description?:  string;
  currency:      string;
  amount:        string;
  sourceAccount: string;
  targetAccount: string;
  customer:      string;
  reference:     string;
}

export interface ICOResponseCredits {
  code: number;
  message: string;
  credits: TCACHCreditsTable
}

export interface ICOResponseAccount {
  id: number;
  creationDate: string;
  operation: string;
  transfer: string;
  senderBeneficiary: string;
  issuingDestination: string;
  status: string;
  currency: string;
  amount: string;
}

export type ICACHTableType = ICOResponseAccount[] | ICACHDebitRegisters[];

export type TCACHCreditsTable = ICOResponseAccount[];

export type TACHDebitsTable = ICACHDebitRegisters[];

export interface ICACHTableParameters {
  operations: ICACHTableType;
  typeOperation: TCACH_MOVEMENTS;
}
