export interface IMovementOperationResponse {
  code: string;
  description: string;
}

export interface ITypeOperationResponse {
  code: string;
  description: string;
}

export interface IConsultingACHDetail {
  account: string;
  amount: string;
  issuingDestination: string;
  senderBeneficiary: string;
  currency: string;
  creationDate: string;
  operation: string;
  status: string;
  transfer: string;
}

export interface IConsultingACHTransactionDetail {
  reference: string;
  datetime: string;
  sourceAccount: string;
  user: string;
  currency: string;
  typeTransaction: string;
}
