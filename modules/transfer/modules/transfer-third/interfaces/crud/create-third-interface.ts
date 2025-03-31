export interface ICreateThird {
  account: string,
  type?: string,
  status: string,
  currency: string,
  alias: string,
  email: string,
  favorite: boolean
}


export class CreateThirdBuilder {
  private readonly _createThird: ICreateThird;

  constructor() {
    this._createThird = {
      account: '',
      type: '',
      status: 'A',
      currency: '',
      alias: '',
      email: '',
      favorite: false,
    };
  }

  account(account: string): CreateThirdBuilder {
    this._createThird.account = account;
    return this;
  }

  type(type: string): CreateThirdBuilder {
    this._createThird.type = type;
    return this;
  }


  currency(currency: string): CreateThirdBuilder {
    this._createThird.currency = currency;
    return this;
  }

  alias(alias: string): CreateThirdBuilder {
    this._createThird.alias = alias;
    return this;
  }

  email(email: string): CreateThirdBuilder {
    this._createThird.email = email;
    return this;
  }

  favorite(favorite: boolean): CreateThirdBuilder {
    this._createThird.favorite = favorite;
    return this;
  }

  build(): ICreateThird {
    return this._createThird;
  }
}
