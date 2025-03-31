export interface IThirdLoansAccounts {
  alias: string;
  account: string;
  name: string;
  currency: Currency;
  formattedAccount: string;
  product: number;
  email: string;
  status: Status;
  type: string;
  favorite: boolean;
  subProduct: string;
  productLabel?: string;
  totalAmount?: string;
}

export enum Currency {
  Hnl = "HNL",
  Usd = "USD",
}

export enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
}

export interface ITypeProduct {
  currency: string;
  product: string;
  status: string;
  subProduct: string;
}

export interface IPaymentExecute {
  loanIdentifier: string;
  currency: string;
  amount: string;
  loanProduct: string;
  loanSubProduct: string;
  accountProduct: number;
  accountSubProduct: number;
  accountDebited: string;
  totalPayment: string;
  extraName: string;
  extraPaymentType: string;
  extraInstallmentNumber: string;
  extraAlias?: string;
  email?: string;
  description?: string;
  aliasAccountDebit?: string;
}

export interface IResponse {
  data: IDataResponse;
  status: number;
}

export interface IDataResponse {
  reference: string;
  dateTime: string;
}

export interface ILoanAccount {
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
  totalAmount?: string;
}

export interface IQuotasAmountResponse {
  maxNumInstallments: string;
  amountInstallments: string;
  valueInstallments: string;
}

export interface IConsultQuotasAmount {
  identifier: string;
  amountInstallmentsPay: string;
}

export interface IAccountSelected {
  account: string;
  alias: string;
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
}

export interface IDetailLoan {
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

export interface IConsultLoan {
  identifier: string;
  name: string;
  currencyCode: string;
  currency: string;
  typeCode: string;
  type: string;
  statusCode: string;
  status: string;
  installmentDate: string;
  balance: string;
  installmentAmount: string;
  installmentValue: string;
  product: string;
  subProduct: string;
}


export interface IPartialPayment{
  maximumToPay: string;
  reference: string;
}
