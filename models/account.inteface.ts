export interface IAccount {
  account: string;
  alias: string;
  mask: string;
  name: string;
  currency: string;
  status: string;
  cif: string;
  consortium: string;
  availableAmount: number;
  totalAmount: number;
  agency: number;
  product: number;
  subproduct: number;
  subProduct?: number;
  enabled: boolean;
  favorite?: boolean;
  type?: string;
  email?: string;
  bank?: number;
  errorService?: boolean;
  identificationType?: string;
  documentNumber?: string;

  creationDate?: string;
  modificationDate?: string;
  userOfCreation?: string;
  userOfModification?: string;
}

export interface IAccountFromHome {
  account:         string;
  alias:           string;
  availableAmount: number;
  currency:        string;
  mask:            string;
  name:            string;
  status:          string;
  totalAmount:     number;
}


export class AccountBuilder {
  private readonly _account: IAccount;

  constructor() {
    this._account = {
      account: '',
      alias: '',
      mask: '',
      name: '',
      currency: '',
      status: '',
      cif: '',
      consortium: '',
      identificationType: '',
      type: '',
      availableAmount: 0,
      totalAmount: 0,
      agency: 0,
      product: 0,
      subproduct: 0,
      enabled: false,
      errorService: false,
    };
  }

  account(account: string): AccountBuilder {
    this._account.account = account;
    return this;
  }

  alias(alias: string): AccountBuilder {
    this._account.alias = alias;
    return this;
  }

  mask(mask: string): AccountBuilder {
    this._account.mask = mask;
    return this;
  }

  name(name: string): AccountBuilder {
    this._account.name = name;
    return this;
  }

  currency(currency: string): AccountBuilder {
    this._account.currency = currency;
    return this;
  }

  status(status: string): AccountBuilder {
    this._account.status = status;
    return this;
  }

  cif(cif: string): AccountBuilder {
    this._account.cif = cif;
    return this;
  }

  consortium(consortium: string): AccountBuilder {
    this._account.consortium = consortium;
    return this;
  }

  type(type: string): AccountBuilder {
    this._account.type = type;
    return this;
  }

  email(email: string): AccountBuilder {
    this._account.email = email;
    return this;
  }

  availableAmount(availableAmount: number): AccountBuilder {
    this._account.availableAmount = availableAmount;
    return this;
  }

  totalAmount(totalAmount: number): AccountBuilder {
    this._account.totalAmount = totalAmount;
    return this;
  }

  agency(agency: number): AccountBuilder {
    this._account.agency = agency;
    return this;
  }

  product(product: number): AccountBuilder {
    this._account.product = product;
    return this;
  }

  subproduct(subproduct: number): AccountBuilder {
    this._account.subproduct = subproduct;
    return this;
  }

  enabled(enabled: boolean): AccountBuilder {
    this._account.enabled = enabled;
    return this;
  }

  build(): IAccount {
    return this._account;
  }
}
