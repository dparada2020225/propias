export interface IPaymentAccount {
  b2bID: string;
  name: string;
  balance: number;
  dueDate: string;
}

export interface IPaymentB2bAccountResponse {
  accounts: IPaymentAccount[]
  totalBalance: number
}

export interface IPaymentAccountDetail {
  b2bID: string;
  balanceAfterCapitalPayment: string;
  capital: string;
  currency: string;
  defaultRate: string;
  delinquentBalance: string;
  dueDate: string;
  feciOthers: string;
  interestBalance: string;
  interestRate: string;
  interests: string;
  name: string;
  openDate: string;
  paymentBalance: string;
  receiptNumber: string;
  status: string;
}

