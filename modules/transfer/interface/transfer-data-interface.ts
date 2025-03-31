import {ICON_IN_TABLE_KEY} from '@adf/components';

export interface IThirdTransfer {
  sourceAccount: string;
  sourceProduct: string;
  sourceSubProduct: string;
  sourceCurrency: string;
  sourceAlias: string;
  targetAccount: string;
  targetProduct: string;
  targetSubProduct: string;
  targetCurrency: string;
  targetAlias: string;
  amount: number;
  notify: boolean;
  description: string;
  email: string;
  sourceAccountName?: string;
  targetAccountName?: string;

}

export interface IThirdTransfersAccounts {
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
  subproduct?: string;
  productLabel?: string;
  [ICON_IN_TABLE_KEY]?: string;
}

export class ThirdTransferAccount {
  private readonly account;

  constructor() {
    this.account = {
      alias: '',
      account: '',
      name: '',
      currency: '',
      formattedAccount: '',
      product: 0,
      email: '',
      status: '',
      favorite: null,
      subProduct: '',
      productLabel: '',
    };
  }

  alias(value: string) {
    this.account.alias = value;
    return this;
  }

  accountNumber(value: string) {
    this.account.account = value;
    return this;
  }

  name(value: string) {
    this.account.name = value;
    return this;
  }

  currency(value: string) {
    this.account.currency = value;
    return this;
  }

  formattedAccount(value: string) {
    this.account.formattedAccount = value;
    return this;
  }

  product(value: number) {
    this.account.product = value;
    return this;
  }

  email(value: string) {
    this.account.email = value;
    return this;
  }

  status(value: string) {
    this.account.status = value;
    return this;
  }

  favorite(value: boolean) {
    this.account.favorite = value;
    return this;
  }

  subProduct(value: string) {
    this.account.subProduct = value;
    return this;
  }

  productLabel(value: string) {
    this.account.productLabel = value;
    return this;
  }

  build() {
    return this.account;
  }
}

export enum Currency {
  Hnl = 'HNL',
  Usd = 'USD',
}

export enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}



