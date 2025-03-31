export enum EThirdPartyLoanTypeMethod {
  QUOTA = 'C',
  PARTIAL = 'P',
}

export enum EAccountDebitPaymentTPL {
  ACTIVE = 'Activa',
  INACTIVE = 'Inactiva'
}

export enum ECurrencyAccountDebitTPL {
  US_$ = 'US$',
  US_D = 'USD',
  HNL = 'HNL'
}

export enum ETypePaymenteSelected {
  QUOTA = '1',
  PARTIAL = '2'
}

export enum EConfirmationAction {
  CREATE = 'create',
  DELETE = 'delete',
  PAYMENT = 'payment',
  ERROR_PAYMENT = 'error_payment',
}

export enum ETypeAccount {
  LOANS = 4
}
