export enum ERequestTypeTransaction {
  AUTHENTICATION = 'AUTHENTICATION',
  REQUEST_BACK_TO_BACK = 'REQUEST_BACK_TO_BACK',
  LOANS = 'LOAN_PAYMENT',
  THIRD_PARTY_TRANSFER = 'THIRD_PARTY_TRANSFER',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  DONATIONS_TRANSFER = 'DONATION_TRANSFERENCE',
  ACH_TRANSFER = 'ACH_TRANSFER',
  ACH_UNI_TRANSFER = 'ACH_UNI_TRANSFER',
  THIRD_LOAN_PAYMENT = 'THIRD_LOAN_PAYMENT',
  PAYMENT_OF_PAYROLL = 'PAYMENT_OF_PAYROLL',
}
export const REQUEST_TYPE_TRANSACTION_MAP= {
  [ERequestTypeTransaction.AUTHENTICATION]: ERequestTypeTransaction.AUTHENTICATION,
  [ERequestTypeTransaction.REQUEST_BACK_TO_BACK]: ERequestTypeTransaction.REQUEST_BACK_TO_BACK,
  [ERequestTypeTransaction.LOANS]: ERequestTypeTransaction.LOANS,
  [ERequestTypeTransaction.THIRD_PARTY_TRANSFER]: ERequestTypeTransaction.THIRD_PARTY_TRANSFER,
  [ERequestTypeTransaction.CHANGE_PASSWORD]: ERequestTypeTransaction.CHANGE_PASSWORD,
  [ERequestTypeTransaction.DONATIONS_TRANSFER]: ERequestTypeTransaction.DONATIONS_TRANSFER,
  [ERequestTypeTransaction.ACH_TRANSFER]: ERequestTypeTransaction.ACH_TRANSFER,
  [ERequestTypeTransaction.THIRD_LOAN_PAYMENT]: ERequestTypeTransaction.THIRD_LOAN_PAYMENT,
  [ERequestTypeTransaction.PAYMENT_OF_PAYROLL]: ERequestTypeTransaction.PAYMENT_OF_PAYROLL,
}

export const getTypeTransaction = (type: string) => {
  return REQUEST_TYPE_TRANSACTION_MAP[type] ?? ERequestTypeTransaction.AUTHENTICATION;
}

export enum ERequestTypeHeader {
  TYPE_TRANSACTION = 'X-8070a',
  TOKEN_VALUE = 'X-8070',
  PARAMETER = 'X-7235'
}


