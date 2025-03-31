export enum ETransactionStatus {
  AUTHORIZED = 'A',
  PENDING = 'P',
  TO_AUTHORIZE = 'F',
  ENTERED = 'I'
}

export enum ETransactionParams {
  TRANSACTION_STATUS = 'transactionStatus',
  SIGNATURE_TYPE = 'signatureType',
  TRANSACTION_CODE = 'transactionCode',
  MULTIPLE_TRANSACTION = 'multiple'
}

export enum ESTButtonMessage {
  SEND = 'send',
  PROCESS = 'process',
  AUTHORIZE = 'option.authorized',
  SEND_BACK = 'option.send_back',
  DELETE = 'delete',
  RETURN = 'reject'
}

export enum ESTTransactionStatus {
  FAILED = 'failed',
  SUCCESS = 'success'
}

export const mapEmbeddedStatus = {
  SUCCESS: 'success',
  FAILED: 'error'
}


export enum ESTUpdateValueAllowProcessPaymentOfPayroll {
  NOT = 'N',
  YES = 'S',
}
