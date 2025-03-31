export interface IAMS365AccountVoucher {
  typeClient: string;
  name: string;
  documentNumber: string;
  address: string;
  city: string;
  country: string;
  bankName: string;
  product: number;
  account: string;
  status: string;
}

export interface IAMS365VoucherParameters {
  account: IAMS365AccountVoucher;
}

export interface IAMS365ModalParameters {
  account: IAMS365AccountVoucher;
  transactionResponse: any;
  title: string;
}

export class S365AccountVoucherBuilder {
  private account: IAMS365AccountVoucher = {
    typeClient: '',
    name: '',
    documentNumber: '',
    address: '',
    city: '',
    country: '',
    bankName: '',
    product: 0,
    account: '',
    status: '',
  }

  typeClient(value: string) {
    this.account.typeClient = value;
    return this;
  }

  name(value: string) {
    this.account.name = value;
    return this;
  }

  documentNumber(value: string) {
    this.account.documentNumber = value;
    return this;
  }

  address(value: string) {
    this.account.address = value;
    return this;
  }

  city(value: string) {
    this.account.city = value;
    return this;
  }

  country(value: string) {
    this.account.country = value;
    return this;
  }

  bankName(value: string) {
    this.account.bankName = value;
    return this;
  }

  product(value: number) {
    this.account.product = value;
    return this;
  }

  accountNumber(value: string) {
    this.account.account = value;
    return this;
  }

  status(value: string) {
    this.account.status = value;
    return this;
  }

  build() {
    return this.account;
  }
}
