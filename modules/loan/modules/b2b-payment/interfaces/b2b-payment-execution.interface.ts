export interface IPaymentExecution {
  description: string;
  dueDate: string;
  accountNameDebit: string;
  source: IPaymentAccountDetailExecution;
  target: IPaymentAccountDetailExecution;
  value1: string;
  value2: string;
  value3: string;
  value4: string;
  value5: string;
}

export interface IPaymentAccountDetailExecution {
  product: string;
  subProduct: string;
  accountNumber: string;
  currency: string;
  amount: number;
}

export interface IPaymentExecutionDescription {
  b2bID: string;
  account: string;
  receipt: string;
  reference: string;
  payment: IPayment;
}

export interface IPayment {
  capital: number;
  interest: number;
  feciOther: number;
  delinquentBalance: number;
  amount: number;
}

export class PaymentExecutionBuilder {
  private readonly _paymentExecution: IPaymentExecution;

  constructor() {
    this._paymentExecution = {
      description: '0',
      dueDate: "0",
      accountNameDebit: '0',
      source: {
        product: '',
        subProduct: '',
        accountNumber: '',
        currency: '',
        amount: 0,
      },
      target: {
        product: "0",
        subProduct: "0",
        accountNumber: '',
        currency: '',
        amount: 0,
      },
      value1: '',
      value2: "0",
      value3: "0",
      value4: "0",
      value5: "0",
    };
  }

  debitAccount(value: IPaymentAccountDetailExecution) {
    this._paymentExecution.source = value;
    return this
  }

  b2bAccount(value: IPaymentAccountDetailExecution) {
    this._paymentExecution.target = value;
    return this
  }

  value1(value: string) {
    this._paymentExecution.value1 = value
    return this
  }

  value2(value: string) {
    this._paymentExecution.value2 = value
    return this
  }


  value3(value: string) {
    this._paymentExecution.value3 = value
    return this
  }


  value4(value: string) {
    this._paymentExecution.value4 = value
    return this
  }



  build(): IPaymentExecution {
    return this._paymentExecution;
  }
}
