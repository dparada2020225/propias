export interface ICreateNumberLoans {
  identifier: string,
  alias: string,
  email: string
}

export interface ILoansResponse {
  reference: string,
  dateTime: string,
}


export interface IDetailPartyLoans {
  clientCode: string;
  clientName: string;
  loanName: string;
  typeCode: string;
  type: string;
  statusCode: string;
  status: string;
  currencyCode: string;
  currency: string;
  feeDate: string;
  totalPayment: string;
  alias: string;
  email: string;
  creationDate: string;
  modificationDate: string;
}


export interface IConsultThirdPartyLoan {
  clientCode: string;
  clientName: string;
  loanName: string;
  typeCode: string;
  type: string;
  statusCode: string;
  status: string;
  currencyCode: string;
  currency: string;
}


export interface IConsultNumberLoan {
  identifier: string
}

export interface IGetReceiptBodyRequest {
  product: string;
  subProduct: string;
  loan: string;
  currency: string;
  amount: string;
}

export interface IReceiptResponse {
  capitalPay: string;
  delinquentBalance: string;
  interestPay: string;
  otherChargesPay: string;
  receiptNumber: string;
  receiptTotal: string;
}


export interface IDeleteLoan {
  identifier: string
}

export interface IThirdPartyLoanAssociate {
  identifier?: string;
  name?: string;
  currencyCode?: Currency;
  currency?: string;
  typeCode?: string;
  type?: string;
  statusCode?: string;
  status?: string;
  installmentDate?: string;
  balance?: string;
  installmentAmount?: string;
  installmentValue?: string;
  product?: string;
  subProduct?: string;
}

export interface IConsultDetailTPL {
  clientCode: string;
  clientName: string;
  loanName: string;
  typeCode: string;
  type: string;
  statusCode: string;
  status: string;
  currencyCode: string;
  currency: string;
  feeDate: string;
  totalPayment: string;
  creationDate: string;
  modificationDate: string;
  alias?: string;
  email?: string;
  modificationUser?: string;
  loanProduct?: string;
  loanSubProduct?: string;
}

export interface IConfirmationDataResponse {
  reference: string;
  dateTime: string;
  message: string;
  action: string;
}


export enum Currency {
  Hnl = "HNL",
  Usd = "USD",
}

export interface IConfirmationData {
  reference: string;
  dateTime: string;
  message: string;
  action: string;
  data: IData;
}

export interface IData {
  message?: string;
  action?: string;
  reference?: string;
  dateTime?: string;
  identifier?: string;
  currency?: string;
  type?: string;
  alias?: string;
  loanName?: string;
  email?: string;
  status?: string;
  comment?: string;
  loanIdentifier?: string;
  amount?: string;
  loanProduct?: string;
  loanSubProduct?: string;
  accountProduct?: number;
  accountSubProduct?: number;
  accountDebited?: string;
  totalPayment?: string;
  notifyTo?: string;
  aliasAccountDebited?: string;
  nameAccountDebited?: string;
  aliasLoan?: string;
  nameLoan?: string;
  currencyCode?: string;
}


export interface IDataPayment {
  loanDetailToPayment: DataPayment,
  amount: string,
  typePayment: string,
  quotas: string | null,
  loanToPayment: IThirdPartyLoanAssociate,
  view?: string;
  maxQuotas?: number;
}

export interface DataPayment {
  accountDebited: AccountDebited;
  detailLoan: IConsultDetailTPL;
  identifierLoan: string;
  currencyLoan?: string;
}

export interface AccountDebited {
  account: string;
  currency: string;
  product: number;
  subproduct: number;
  enabled: boolean;
  cif: string;
  consortium: string;
  agency: number;
  mask: string;
  name: string;
  status: string;
  availableAmount: number;
  totalAmount: number;
  alias?: string;

}

export interface DetailLoan {
  clientCode: string;
  clientName: string;
  loanName: string;
  typeCode: string;
  type: string;
  statusCode: string;
  status: string;
  currencyCode: string;
  currency: string;
  feeDate: string;
  totalPayment: string;
  creationDate: string;
  modificationDate: string;
  alias?: string;
  email?: string;
}

export interface IOwnLoansPagination {
  loanNumber?:            string;
  aliasAccount?:          string;
  clientName?:            string;
  principalBalance?:      string;
  amountGranted?:         string;
  creditMask?:            string;
  currencyCode?:          string;
  amountToZero?:          string;
  amountToZero2?:         string;
  productCode?:           string;
  subProductCode?:        string;
  loanDescription?:       string;
  accountOpenDate?:       string;
  accountExpirationDate?: string;
}
