import { IAccount } from 'src/app/models/account.inteface';

export interface IDonationAccount {
  code: string;
  name: string;
  productCode: string;
  subProductCode: string;
  account: string;
  logo: string;
  currency: string;
}

export interface IDonationFormValues {
  accountDebited: string;
  fundationAccount: string;
  amount: string;
  comment: string;
}

export class DonationFormValuesBuilder {
  private readonly formValues: IDonationFormValues;

  constructor() {
    this.formValues = {
      accountDebited: '',
      fundationAccount: '',
      amount: '',
      comment: '',
    };
  }

  sourceAccount(value: string) {
    this.formValues.accountDebited = value;
    return this;
  }

  fundationAccount(value: string) {
    this.formValues.fundationAccount = value;
    return this;
  }

  amount(value: string) {
    this.formValues.amount = value;
    return this;
  }

  comment(value: string) {
    this.formValues.comment = value;
    return this;
  }

  build() {
    return this.formValues;
  }
}

export interface IDonationProperties {
  accountDebited: IAccount;
  fundationAccredit: IDonationAccount;
  formValues: IDonationFormValues;
}

export interface IDonationExecuteDescription {
  reference: string;
  dateTime: string;
}

export class DonationAccountBuilder {
  private readonly donationAccount: IDonationAccount = {
    code: '',
    name: '',
    productCode: '',
    subProductCode: '',
    account: '',
    logo: '',
    currency: '',
  };

  code(value: string) {
    this.donationAccount.code = value;
    return this;
  }

  name(value: string) {
    this.donationAccount.name = value;
    return this;
  }

  product(value: string) {
    this.donationAccount.productCode = value;
    return this;
  }

  subProduct(value: string) {
    this.donationAccount.subProductCode = value;
    return this;
  }

  account(value: string) {
    this.donationAccount.account = value;
    return this;
  }

  logo(value: string) {
    this.donationAccount.logo = value;
    return this;
  }

  currency(value: string) {
    this.donationAccount.currency = value;
    return this;
  }

  build() {
    return this.donationAccount;
  }
}
