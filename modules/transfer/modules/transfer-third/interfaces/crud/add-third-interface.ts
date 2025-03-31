import {ICreateThird} from './create-third-interface';

export interface IAddThird {
  account: string;
  currency: string;
  alias: string;
  email: string;
  type: string;
  favorite: boolean;
}

export interface ITTRAddAccountRequest {
  bodyRequest: ICreateThird;
  isTokenRequired: boolean;
  token?: string;
}

export type TThirdDeleteSubType = Omit<ITTRAddAccountRequest, 'bodyRequest'>

export interface IThirdDeleteRequest extends TThirdDeleteSubType {
  bodyRequest: string;
}

export class AddThirdBuilder {
  private readonly _createThird: IAddThird;

  constructor() {
    this._createThird = {
      account: '',
      currency: '',
      alias: '',
      email: '',
      type: '',
      favorite: false,
    };
  }

  account(account: string): AddThirdBuilder {
    this._createThird.account = account;
    return this;
  }

  currency(currency: string): AddThirdBuilder {
    this._createThird.currency = currency;
    return this;
  }

  alias(alias: string): AddThirdBuilder {
    this._createThird.alias = alias;
    return this;
  }

  email(email: string): AddThirdBuilder {
    this._createThird.email = email;
    return this;
  }

  type(type: string): AddThirdBuilder {
    this._createThird.type = type;
    return this;
  }

  favorite(favorite: boolean): AddThirdBuilder {
    this._createThird.favorite = favorite;
    return this;
  }

  build(): IAddThird {
    return this._createThird;
  }
}
