import { IAchAccount } from './ach-account-interface';
import { IUpdateAchForm } from './crud/crud-form.interface';
import { TACHTransactionType } from '../enum/ach-crud-control-name.enum';

export interface IMassiveMessage {
  message1: string;
  message2: string;
  message3: string;
  message4: string;
  message5: string;
}

export interface IAchTransactionRequestBody {
  cif: string;
  paymentType: string;
  formatRegister: string;
  currency: string;
  scheduleDate: string;
  description: string;
  source: IACHTransactionSource;
  target: IACHTransactionTarget;
  omitASTransaction: boolean;
}

export interface IACHTransactionSource {
  payexBankId: string;
  identification: string;
  name: string;
  email: string;
  account: string;
  accountProduct: string;
  accountSubProduct: string;
  currency?: string;
  alias?: string;
}

export interface IACHScheduleResponse {
  code: string;
  hour: string;
  description: string;
}

type x = Omit<IACHTransactionSource, 'accountSubProduct'>;

export interface IACHTransactionTarget extends x {
  id: string;
  amount: string;
  internalProduct: string;
  targetBankCode: number;
  typeClient?: string;
  bankName?: string;
  status?: string;
  dateCreated?: string;
  userCreated?: string;
  dateModified?: string;
  userModified?: string;
  transferenceHour?: string;
  transferenceDate?: string;
  transferenceDateRaw?: string;
  transferenceHourRaw?: string;
  transferenceType?: TACHTransactionType;
}

export class ACHTransactionBuilder {
  private readonly request: IAchTransactionRequestBody;

  constructor() {
    this.request = {
      cif: '',
      paymentType: '',
      formatRegister: '',
      currency: '',
      scheduleDate: '',
      description: '',
      source: {} as IACHTransactionSource,
      target: {} as IACHTransactionTarget,
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

  currency(value: string) {
    this.request.currency = value;
    return this;
  }

  scheduleDate(value: string) {
    this.request.scheduleDate = value;
    return this;
  }

  description(value: string) {
    this.request.description = value;
    return this;
  }

  source(value: IACHTransactionSource) {
    this.request.source = value;
    return this;
  }

  target(value: IACHTransactionTarget) {
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

export interface IACHUpdateAccountToTransaction {
  selectedAccount: IAchAccount;
  formValues: IUpdateAchForm;
}

export class ACHTargetAccountBuilder {
  private readonly request: IACHTransactionTarget;

  constructor() {
    this.request = {
      payexBankId: '',
      identification: '',
      name: '',
      email: '',
      account: '',
      accountProduct: '',
      id: '',
      amount: '',
      internalProduct: '',
      targetBankCode: 0,
    };
  }

  bankId(value: string) {
    this.request.payexBankId = value;
    return this;
  }

  identification(value: string) {
    this.request.identification = value;
    return this;
  }

  name(value: string) {
    this.request.name = value;
    return this;
  }

  email(value: string) {
    this.request.email = value;
    return this;
  }

  account(value: string) {
    this.request.account = value;
    return this;
  }

  accountProduct(value: string) {
    this.request.accountProduct = value;
    return this;
  }

  id(value: string) {
    this.request.id = value;
    return this;
  }

  internalProduct(value: string) {
    this.request.internalProduct = value;
    return this;
  }

  amount(value: string) {
    this.request.amount = value;
    return this;
  }

  targetBankCode(value: number) {
    this.request.targetBankCode = value;
    return this;
  }

  typeClient(value: string) {
    this.request.typeClient = value;
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
    this.request.dateModified = value;
    return this;
  }

  userModified(value: string) {
    this.request.userModified = value;
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

  transferenceHour(value: string) {
    this.request.transferenceHour = value;
    return this;
  }

  transferenceDate(value: string) {
    this.request.transferenceDate = value;
    return this;
  }

  transferenceDateRaw(value: string) {
    this.request.transferenceDateRaw = value;
    return this;
  }

  transferenceHourRaw(value: string) {
    this.request.transferenceHourRaw = value;
    return this;
  }

  transferenceType(value: TACHTransactionType) {
    this.request.transferenceType = value;
    return this;
  }

  build() {
    return this.request;
  }
}

export class ACHSourceAccountBuilder {
  private readonly request: IACHTransactionSource;

  constructor() {
    this.request = {
      payexBankId: '',
      identification: '',
      name: '',
      email: '',
      account: '',
      accountProduct: '',
      accountSubProduct: '',
    };
  }

  bankId(value: string) {
    this.request.payexBankId = value;
    return this;
  }

  identification(value: string) {
    this.request.identification = value;
    return this;
  }

  name(value: string) {
    this.request.name = value;
    return this;
  }

  email(value: string) {
    this.request.email = value;
    return this;
  }

  account(value: string) {
    this.request.account = value;
    return this;
  }

  accountProduct(value: string) {
    this.request.accountProduct = value;
    return this;
  }

  accountSubProduct(value: string) {
    this.request.accountSubProduct = value;
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

  build() {
    return this.request;
  }


}
