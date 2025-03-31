export enum SppdFormAttributes {
  AMOUNT = 'amount',
  CREDITS = 'credits',
  DATE = 'date',
  SOURCE_ACCOUNT = 'sourceAccount',
}

export interface ISPPLDFormParameters {
  title: string;
  subtitle: string;
  date: string;
  credits: string;
  amount: string;
}
