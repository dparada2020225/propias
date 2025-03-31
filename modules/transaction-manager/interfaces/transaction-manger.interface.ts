import { ITMTransaction } from './tm-transaction.interface';

export interface ITMThirdTransferParameters {
  accountDebited: ITransactionManagerAccountDetail;
  accountCredited: ITransactionManagerAccountDetail;
  transaction: ITMTransaction;
  message?: string;
}

export interface ITMAchSipaTransferParameters {
  transaction: ITMTransaction;
}

export interface ITMACH365TransferParameters {
  transaction: ITMTransaction;
  useFormValues?: boolean;
}

export interface ITMThirdPartyLoanPaymentParameters {
  sourceAccount: ITransactionManagerAccountDetail;
  transaction: ITMTransaction;
  message?: string;
  isTHMode?: boolean;
}


export interface INavigateEmbbededParams {
  reference: string;
  tabPosition: string;
  action: string;
  service: string;
}


export interface ITransactionManagerAccountDetail {
  account: string;
  currency: string;
  mask: string;
  name: string;
  productType: string;
  status: string;
  subProductType: string;
  amount: string;
}

export interface ITransactionManagerRequestDetail {
  productOrigin: string;
  subProductOrigin: string;
  accountOrigin: string;
  currencyOrigin: string;
  amountOrigin: string;
  productTarget: string;
  subProductTarget: string;
  accountTarget: string;
  currencyTarget: string;
  amountTarget: string;
  description: string;
  rateExchange: string;
  email?: string;
  notify?: any;
  targetAlias?: string;
}

export interface ITMRequestDetailThirdPartyLoanPayment {
  dummy: string;
  receiptNumber: string;
  dummy2: string;
  sourceProduct: string;
  sourceSubProduct: string;
  sourceAccount: string;
  sourceCurrency: string;
  sourceAmount: string;
  targetProduct: string;
  targetSubProduct: string;
  targetAccount: string;
  targetCurrency: string;
  targetAmount: string;
  dummy3: string;
  defaultRate: string;
  interestRate: string;
  capital: string;
  interest: string;
  defaultAmount: string;
  dummy4: string;
  capitalBackWard: string;
  dummy5: string;
  dummy6: string;
  currentBalance: string;
  backWardBalance: string;
  dummy7: string;
  nameLoan: string;
  aliasLoan: string;
  email: string;
  email2: string;
  dummy8: string;
  comment: string;
  targetLoanAlias: string;
  typePayment: string;
  quotas: string;
  sourceAccountAlias: string;
  targetLoanCurrency: string;
  targetAmountToPayment: string;
  currentLoanBalance: string;
  valueCurrencyExchange: string;
  amountCurrencies: string;
  amountCurrenciesTarget: string;
  commission: string;
  conversionAmount: string;
  conversionAmount2: string;
  capitalPayment: string;
  date: string;
  dateOperation: string;
  userWeb: string;
}

export interface ITMRequestDetailBulkTransaction {
  sourceProduct: string;
  sourceSubProduct: string;
  sourceAccount: string;
  sourceCurrency: string;
  amount: string;
  numberOfCredits: number;
  numberOfLote: string;
  description: string;
  idTrx: string;
}

export interface ITMRequestDetailACHTransaction {
  sourceProduct: string;
  sourceSubProduct: string;
  sourceAccount: string;
  sourceCurrency: string;
  amount: string;
  bankId: number;
  targetProduct: string;
  targetAccount: string;
  targetCurrency: string;
  targetAmount: string;
  comment: string;
  reference: string;
  numberLote: string;
  sourceCurrency2: string;
  sourceAlias: string;
  sourceProductDescription: string;
  typeClientTargetAccount: string;
  targetAccountName: string;
  targetAccountBankName: string;
  targetAccountStatus: string;
  targetAccountProduct2: string;
  targetAccountDateCreated: string;
  targetAccountUserCreated: string;
  targetAccountDateModified: string;
  targetAccountUserModified: string;
  targetAccountEmail: string;
  targetAccount2: string;
  bankId2: number;
  transferenceHour: string;
  transferenceDate: string;
  transferenceType: string;
  transferenceHourRaw: string;
  transferenceDateRaw: string;
  idTargetAccount: string;
  selectedQuest: string;
  inputQuest: string;
  targetAccountAlias: string;
}
