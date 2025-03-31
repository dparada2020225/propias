import {
  ITransactionFailedResponse,
  ITransactionSuccessResponse
} from "../../../../../../models/utils-transaction.interface";
import {IThirdTransferTransactionResponse} from "../third-transfer-service";

export interface IUpdateThird {
  currency: string;
  alias: string;
  email: string;
  type: string;
  favorite: boolean;
  account?: string
}

export interface ITTRUpdateAccountRequest {
  bodyRequest: IUpdateThird;
  isTokenRequired: boolean;
  numberAccount: string;
  token?: string;
}

export class UpdateThirdBuilder {
  private readonly _updateThird: IUpdateThird;

  constructor() {
    this._updateThird = {
      currency: '',
      alias: '',
      email: '',
      type: '',
      account: '',
      favorite: false
    };
  }

  currency(currency: string): UpdateThirdBuilder {
    this._updateThird.currency = currency;
    return this;
  }

  alias(alias: string): UpdateThirdBuilder {
    this._updateThird.alias = alias;
    return this;
  }

  email(email: string): UpdateThirdBuilder {
    this._updateThird.email = email;
    return this;
  }

  type(type: string): UpdateThirdBuilder {
    this._updateThird.type = type;
    return this;
  }

  favorite(favorite: boolean): UpdateThirdBuilder {
    this._updateThird.favorite = favorite;
    return this;
  }

  account(account: string): UpdateThirdBuilder {
    this._updateThird.account = account;
    return this;
  }

  build(): IUpdateThird {
    return this._updateThird;
  }
}

export type TThirdTransferUpdateAccount =
  ITransactionSuccessResponse<IThirdTransferTransactionResponse>
  | ITransactionFailedResponse;

