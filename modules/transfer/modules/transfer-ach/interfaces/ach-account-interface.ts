export interface IAchAccount {
  account: string;
  alias: string;
  bank: number;
  bankName: string;
  clientId: string;
  clientType: string;
  creationDate: string;
  currency: string;
  documentNumber: string;
  email: string;
  favorite: boolean;
  modificationDate: string;
  name: string;
  type: string;
  useAnyCurrency: boolean;
  status: string;
  userOfCreation: string;
  userOfModification: string;
  typeAccountDescription?: string;
  currencyCode?: string;
}

/*

*/

export interface V3IAchAccount {
  account: string;
  alias: string;
  bank: number;
  bankName: string;
  clientId: string;
  identificationType: string;
  clientType: string;
  currency: string;
  documentType: string;
  number: string;
  documentNumber: string;
  product: string;
  email: string;
  favorite: boolean;
  name: string;
  type: string;
  useAnyCurrency: boolean;
  status?: string;
  creationDate: string;
  userOfCreation: string;
  userOfModification: string;
  modificationDate: string;
}

export interface IV3AchAccounts {
  T365: V3IAchAccount[];
  SIPA: V3IAchAccount[];
  ACH: V3IAchAccount[];
  M365: V3IAchAccount[];
}

export interface IAChBulkTransferAccount extends IAchAccount{
  product?: string;
  currentAmount?: any;
  parsedAmount?: any;
  internalProduct: string;
  routeCode: string;
  amount?: any;
}


export class AchAccountBuilder {
  private readonly achAccount: IAchAccount;

  constructor() {
    this.achAccount = {
      account: 'undefined',
      bank: 0,
      name: 'undefined',
      alias: 'undefined',
      currency: 'undefined',
      type: 'undefined',
      clientType: 'undefined',
      email: 'undefined',
      clientId: 'undefined',
      favorite: false,
      useAnyCurrency: false,
      bankName: 'undefined',
      userOfCreation: 'undefined',
      userOfModification: 'undefined',
      modificationDate: 'undefined',
      creationDate: 'undefined',
      documentNumber: 'undefined',
      status: 'undefined',
    };
  }

  account(account: string): AchAccountBuilder {
    this.achAccount.account = account;
    return this;
  }

  bank(bank: number): AchAccountBuilder {
    this.achAccount.bank = bank;
    return this;
  }

  name(name: string): AchAccountBuilder {
    this.achAccount.name = name;
    return this;
  }

  alias(alias: string): AchAccountBuilder {
    this.achAccount.alias = alias;
    return this;
  }

  currency(currency: string): AchAccountBuilder {
    this.achAccount.currency = currency;
    return this;
  }

  type(type: string): AchAccountBuilder {
    this.achAccount.type = type;
    return this;
  }

  email(email: string): AchAccountBuilder {
    this.achAccount.email = email;
    return this;
  }

  clientId(clientId: string): AchAccountBuilder {
    this.achAccount.clientId = clientId;
    return this;
  }

  favorite(favorite: boolean): AchAccountBuilder {
    this.achAccount.favorite = favorite;
    return this;
  }

  bankName(value: string): AchAccountBuilder {
    this.achAccount.bankName = value;
    return this;
  }

  documentNumber(documentNumber: string): AchAccountBuilder {
    this.achAccount.documentNumber = documentNumber;
    return this;
  }

  build(): IAchAccount {
    return this.achAccount;
  }
}

export class ACHBulkTransferBuilder {
  private readonly achAccount: IAChBulkTransferAccount;

  constructor() {
    this.achAccount = {
      account: 'undefined',
      bank: 0,
      name: 'undefined',
      alias: 'undefined',
      currency: 'undefined',
      type: 'undefined',
      clientType: 'undefined',
      email: 'undefined',
      clientId: 'undefined',
      favorite: false,
      useAnyCurrency: false,
      bankName: 'undefined',
      userOfCreation: 'undefined',
      userOfModification: 'undefined',
      modificationDate: 'undefined',
      creationDate: 'undefined',
      documentNumber: 'undefined',
      status: 'undefined',
      internalProduct: 'undefined',
      routeCode: 'undefined',
    };
  }

  parsedAmount(value: any) {
    this.achAccount.parsedAmount = value;
    return this;
  }

  account(account: string): ACHBulkTransferBuilder {
    this.achAccount.account = account;
    return this;
  }

  bank(bank: number): ACHBulkTransferBuilder {
    this.achAccount.bank = bank;
    return this;
  }

  name(name: string): ACHBulkTransferBuilder {
    this.achAccount.name = name;
    return this;
  }

  alias(alias: string): ACHBulkTransferBuilder {
    this.achAccount.alias = alias;
    return this;
  }

  currency(currency: string): ACHBulkTransferBuilder {
    this.achAccount.currency = currency;
    return this;
  }

  type(type: string): ACHBulkTransferBuilder {
    this.achAccount.type = type;
    return this;
  }

  email(email: string): ACHBulkTransferBuilder {
    this.achAccount.email = email;
    return this;
  }

  clientId(clientId: string): ACHBulkTransferBuilder {
    this.achAccount.clientId = clientId;
    return this;
  }

  favorite(favorite: boolean): ACHBulkTransferBuilder {
    this.achAccount.favorite = favorite;
    return this;
  }

  bankName(value: string): ACHBulkTransferBuilder {
    this.achAccount.bankName = value;
    return this;
  }

  documentNumber(documentNumber: string): ACHBulkTransferBuilder {
    this.achAccount.documentNumber = documentNumber;
    return this;
  }

  product(value: string) {
    this.achAccount.product = value;
    return this;
  }

  build(): IAChBulkTransferAccount {
    return this.achAccount;
  }
}
