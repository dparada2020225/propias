
export interface IAMACHVoucherParameters {
  account: IAchTransactionDetailParameters;
  useUpdateMode: boolean;
}

export interface IAMACHModalParameters extends IAMACHVoucherParameters {
  transactionResponse: any;
  title: string;
}

export interface IAchTransactionDetailParameters {
  typeClient: string;
  bankName: string;
  currency: string;
  typeAccount: string;
  account: string;
  email: string;
  name: string;
  typeIdentification: string;
  identificationNumber: string;
  reason: string;
  status: string;
  isOwnAccount: boolean;
}

export class IAMACHAccountDetail {
  private readonly accountDetail: IAchTransactionDetailParameters = {
    typeClient: '',
    bankName: '',
    currency: '',
    status: '',
    typeAccount: '',
    account: '',
    email: '',
    name: '',
    typeIdentification: '',
    identificationNumber: '',
    reason: '',
    isOwnAccount: false,
  }

  typeClient(value: string) {
    this.accountDetail.typeClient = value;
    return this;
  }

  bankName(value: string) {
    this.accountDetail.bankName = value;
    return this;
  }

  currency(value: string) {
    this.accountDetail.currency = value;
    return this;
  }

  typeAccount(value: string) {
    this.accountDetail.typeAccount = value;
    return this;
  }

  account(value: string) {
    this.accountDetail.account = value;
    return this;
  }

  email(value: string) {
    this.accountDetail.email = value;
    return this;
  }

  name(value: string) {
    this.accountDetail.name = value;
    return this;
  }

  typeIdentification(value: string) {
    this.accountDetail.typeIdentification = value;
    return this;
  }

  identificationNumber(value: string) {
    this.accountDetail.identificationNumber = value;
    return this;
  }

  reason(value: string) {
    this.accountDetail.reason = value;
    return this;
  }

  status(value: string) {
    this.accountDetail.status = value;
    return this;
  }

  isOwnAccount(value: boolean) {
    this.accountDetail.isOwnAccount = value;
    return this;
  }

  build() {
    return this.accountDetail;
  }
}
