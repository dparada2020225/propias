export enum SpFormAttributes {
  AMOUNT = 'amount',
  CREDITS = 'credits',
  DATE = 'date',
  SOURCE_ACCOUNT = 'sourceAccount',
}

export interface SPFormParameters {
  title: string;
  subtitle?: string;
  date: string;
  credits: string;
  amount: string;
}

export enum SpFormVoucherAttributes {
  AMOUNT = 'amount',
  CREDITS = 'credits',
  DATE = 'date',
  ACCOUNT_NUMBER = 'sourceAccountNumber',
  ACCOUNT_NAME = 'sourceAccountName',

}