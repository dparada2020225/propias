export enum ConsultACHTableKeys {
  DATE = 'datetime',
  BENEFICIARY = 'beneficiary',
  OPERATION = 'operation',
  TYPE_OPERATION = 'typeOperation',
  STATUS = 'status',
  DESTINATION_BANK = 'bank',
  CURRENCY = 'currency',
  AMOUNT = 'amount'
}

export enum EConsultACHTableActions {
  VIEW_DETAIL = 'goToDetail',
  VIEW_PROOF_VOUCHER = 'viewProofVoucher',
}


export enum AttributeFormConsultAch {
  TypeOfMovement = 'typeOfMovement',
  TypeOfOperation = 'typeOfOperation',
  InitDate = 'initDate',
  FinalDate = 'finalDate',
  MinRange = 'minRange',
  MaxRange = 'maxRange',
  FILTER_VALUE = 'filterValue'
}

export interface  IACHCForm {
  typeOfMovement: string;
  typeOfOperation: string;
  initDate: string;
  finalDate: string;
  minRange: string;
  maxRange: string;
  filterValue: string;
}

export interface ICACHFilterOperation {
  name:         string;
  value:        string;
  isSelected:   boolean;
  filterValues: ICACHFilterValue[];
}

export interface ICACHFilterValue {
  name:  string;
  value: string;
}
