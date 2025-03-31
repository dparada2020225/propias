export enum AttributeFormCrudAch {
  TYPE_CLIENT = 'typeClient',
  NAME = 'name',
  IDENTIFY_BENEFICIARY = 'identifyBeneficiary',
  ALIAS = 'alias',
  BANK_NAME = 'bankName',
  TYPE_ACCOUNT = 'typeAccount',
  CURRENCY = 'currency',
  NUMBER_ACCOUNT = 'numberAccount',
  EMAIL = 'email',
  COMPANY_IDENTIFIER = 'companyIdentifier',
  TARGET_BANK = 'targetBank',
  STATUS = 'status'
}

export enum ECrudAchTypeClient  {
  NATURAL = 'NATURAL',
  LEGAL = 'LEGAL',
}

export const ACCOUNT_CLIENT_TYPE = {
  [ECrudAchTypeClient.NATURAL]: 'N',
  [ECrudAchTypeClient.LEGAL]: 'J',
} as const;

export const ACH_TRANSACTION_TYPE = {
  ACH: 'ACH',
  LBTR: 'LBTR',
} as const;

export type TACHTransactionType = typeof ACH_TRANSACTION_TYPE[keyof typeof ACH_TRANSACTION_TYPE];

export enum EACHAccountStatus {
  I = 'disabled',
  A = 'active',
}

