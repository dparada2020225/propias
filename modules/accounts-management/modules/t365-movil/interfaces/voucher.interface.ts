export interface IAM365Voucher {
  numberPhone: string;
  name: string;
  bankName: string;
  email: string;
  status: string;
}

export interface IAM365VoucherParameters {
  account: IAM365Voucher;
}

export interface IAM365ModalParameters extends IAM365VoucherParameters {
  transactionResponse: any;
  title: string;
}

export class AM365VoucherBuilder {
  private voucher: IAM365Voucher = {
    numberPhone: '',
    name: '',
    bankName: '',
    email: '',
    status: '',
  }

  bankName(value: string) {
    this.voucher.bankName = value;
    return this;
  }

  name(value: string) {
    this.voucher.name = value;
    return this;
  }

  numberPhone(value: string) {
    this.voucher.numberPhone = value;
    return this;
  }

  email(value: string) {
    this.voucher.email = value;
    return this;
  }

  status(value: string) {
    this.voucher.status = value;
    return this;
  }

  build() {
    return this.voucher;
  }
}
