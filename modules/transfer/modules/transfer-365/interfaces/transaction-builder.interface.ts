export interface IT365TransactionRequestBody {
  cif: string;
  paymentType: string;
  formatRegister: string;
  lote: string;
  currency: string;
  description: string;
  source: IT365TransactionSource;
  target: IT365TransactionTarget;
  omitASTransaction: boolean;
}

export interface IT365TransactionSource {
  accountProduct: number;
  accountSubProduct: number;
  account: string;
  currency: string;
  alias: string;
  name: string;
  email: string;
}


export interface IT365TransactionTarget {
  amount: string;
  bankCode: number;
  product: string;
  account: string;
  currency: string;
  identification: string;
  accountName: string;
  bankName: string;
  status: string;
  dateCreated: string;
  userCreated: string;
  dateModify: string;
  userModify: string;
  email: string;
  payexBankId: string;
  internalProduct: string;
  descriptionProduct: string;
  codeProposal: string;
  codeTypeOperation: string;
  descriptionTypeOperation: string;
  codeTypeOriginalOperation: string;
  codeTypePayment: string;
  descriptionTypePayment: string;
  commission: string;
}

export class T365TransactionBuilder {
  private readonly request: IT365TransactionRequestBody;

  constructor() {
    this.request = {
      cif: '',
      paymentType: '',
      formatRegister: '',
      lote: '',
      currency: '',
      description: '',
      source: {} as IT365TransactionSource,
      target: {} as IT365TransactionTarget,
      omitASTransaction: false,
    };
  }

  cif(value: string) {
    this.request.cif = value;
    return this;
  }

  paymentType(value: string) {
    this.request.paymentType = value;
    return this;
  }

  formatRegister(value: string) {
    this.request.formatRegister = value;
    return this;
  }

  lote(value: string) {
    this.request.lote = value;
    return this;
  }

  currency(value: string) {
    this.request.currency = value;
    return this;
  }

  description(value: string) {
    this.request.description = value;
    return this;
  }

  source(value: IT365TransactionSource) {
    this.request.source = value;
    return this;
  }

  target(value: IT365TransactionTarget) {
    this.request.target = value;
    return this;
  }

  omitASTransaction(value: boolean) {
    this.request.omitASTransaction = value;
    return this;
  }

  build() {
    return this.request;
  }
}

export class T365TargetAccountBuilder {
  private readonly request: IT365TransactionTarget;

  constructor() {
    this.request = {
      amount: '',
      bankCode: 0,
      product: '',
      account: '',
      currency: '',
      identification: '',
      accountName: '',
      bankName: '',
      status: '',
      dateCreated: '',
      userCreated: '',
      dateModify: '',
      userModify: '',
      email: '',
      payexBankId: '',
      internalProduct: '',
      descriptionProduct: '',
      codeProposal: '',
      codeTypeOperation: '',
      descriptionTypeOperation: '',
      codeTypeOriginalOperation: '',
      codeTypePayment: '',
      descriptionTypePayment: '',
      commission: '',
    };
  }

  amount(value: string) {
    this.request.amount = value;
    return this;
  }

  bankCode(value: number) {
    this.request.bankCode = value;
    return this;
  }

  product(value: string) {
    this.request.product = value;
    return this;
  }

  account(value: string) {
    this.request.account = value;
    return this;
  }

  currency(value: string) {
    this.request.currency = value;
    return this;
  }

  identification(value: string) {
    this.request.identification = value;
    return this;
  }

  accountName(value: string) {
    this.request.accountName = value;
    return this;
  }

  bankName(value: string) {
    this.request.bankName = value;
    return this;
  }

  status(value: string) {
    this.request.status = value;
    return this;
  }

  dateCreated(value: string) {
    this.request.dateCreated = value;
    return this;
  }

  userCreated(value: string) {
    this.request.userCreated = value;
    return this;
  }

  dateModified(value: string) {
    this.request.dateModify = value;
    return this;
  }

  userModified(value: string) {
    this.request.userModify = value;
    return this;
  }

  email(value: string) {
    this.request.email = value;
    return this;
  }

  bankId(value: string) {
    this.request.payexBankId = value;
    return this;
  }

  internalProduct(value: string) {
    this.request.internalProduct = value;
    return this;
  }

  descriptionProduct(value: string) {
    this.request.descriptionProduct = value;
    return this;
  }

  codeProposal(value: string) {
    this.request.codeProposal = value;
    return this;
  }

  codeTypeOperation(value: string) {
    this.request.codeTypeOperation = value;
    return this;
  }

  descriptionTypeOperation(value: string) {
    this.request.descriptionTypeOperation = value;
    return this;
  }

  codeTypeOriginalOperation(value: string) {
    this.request.codeTypeOriginalOperation = value;
    return this;
  }

  codeTypePayment(value: string) {
    this.request.codeTypePayment = value;
    return this;
  }

  descriptionTypePayment(value: string) {
    this.request.descriptionTypePayment = value;
    return this;
  }

  commission(value: string) {
    this.request.commission = value;
    return this;
  }

  build() {
    return this.request;
  }
}

export class T365SourceAccountBuilder {
  private readonly request: IT365TransactionSource;

  constructor() {
    this.request = {
      accountProduct: 0,
      accountSubProduct: 0,
      account: '',
      currency: '',
      alias: '',
      name: '',
      email: '',
    };
  }

  accountProduct(value: number) {
    this.request.accountProduct = value;
    return this;
  }

  accountSubProduct(value: number) {
    this.request.accountSubProduct = value;
    return this;
  }

  account(value: string) {
    this.request.account = value;
    return this;
  }

  currency(value: string) {
    this.request.currency = value;
    return this;
  }

  alias(value: string) {
    this.request.alias = value;
    return this;
  }

  email(value: string) {
    this.request.email = value;
    return this;
  }

  name(value: string) {
    this.request.name = value;
    return this;
  }

  build() {
    return this.request;
  }
}
