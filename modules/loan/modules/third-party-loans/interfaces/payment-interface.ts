export interface IVoucherPaymentTPL {
  rootData: IRootData;
  destinationData: IDestinationData;
  reference: string;
}

export interface IDestinationData {
  accountCredit: string;
  typeAccount: number;
  nameLoan: string;
  comment?: string;
}

export interface IRootData {
  dateOperation: string;
  typeAccount: number;
  accountDebited: string;
  currency: string;
  amountDebited: string;
  nameAccount: string;
}

export interface IAccountDebit {
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

export interface ITPLPVoucherState {
  accountDebited: string;
  accountProduct: number;
  accountSubProduct: number;
  aliasAccountDebited: string;
  aliasLoan: string;
  amount: string;
  comment: string;
  currency: string;
  description: string;
  email: string;
  loanIdentifier: string;
  loanProduct: string;
  loanSubProduct: string;
  nameAccountDebited: string;
  nameLoan: string;
  notifyTo: string;
  totalPayment: string;
}

export class ITPLPVoucherBuilder {
  private readonly transactionStructure: ITPLPVoucherState;

  constructor() {
    this.transactionStructure = {
      accountDebited: '',
      accountProduct: 0,
      accountSubProduct: 0,
      aliasAccountDebited: '',
      aliasLoan: '',
      amount: '',
      comment: '',
      currency: '',
      description: '',
      email: '',
      loanIdentifier: '',
      loanProduct: '',
      loanSubProduct: '',
      nameAccountDebited: '',
      nameLoan: '',
      notifyTo: '',
      totalPayment: '',
    };
  }

  accountDebited(value: string) {
    this.transactionStructure.accountDebited = value;
    return this;
  }

  accountProduct(value: number) {
    this.transactionStructure.accountProduct = value;
    return this;
  }

  accountSubProduct(value: number) {
    this.transactionStructure.accountSubProduct = value;
    return this;
  }

  aliasAccountDebited(value: string) {
    this.transactionStructure.aliasAccountDebited = value;
    return this;
  }

  aliasLoan(value: string) {
    this.transactionStructure.aliasLoan = value;
    return this;
  }

  amount(value: string) {
    this.transactionStructure.amount = value;
    return this;
  }

  comment(value: string) {
    this.transactionStructure.comment = value;
    return this;
  }

  currency(value: string) {
    this.transactionStructure.currency = value;
    return this;
  }

  description(value: string) {
    this.transactionStructure.description = value;
    return this;
  }

  email(value: string) {
    this.transactionStructure.email = value;
    return this;
  }

  loanIdentifier(value: string) {
    this.transactionStructure.loanIdentifier = value;
    return this;
  }

  loanProduct(value: string) {
    this.transactionStructure.loanProduct = value;
    return this;
  }

  nameAccountDebited(value: string) {
    this.transactionStructure.nameAccountDebited = value;
    return this;
  }

  nameLoan(value: string) {
    this.transactionStructure.nameLoan = value;
    return this;
  }

  notifyTo(value: string) {
    this.transactionStructure.notifyTo = value;
    return this;
  }

  totalPayment(value: string) {
    this.transactionStructure.totalPayment = value;
    return this;
  }

  loanSubProduct(value: string) {
    this.transactionStructure.loanSubProduct = value;
    return this;
  }

  build() {
    return this.transactionStructure;
  }


}
