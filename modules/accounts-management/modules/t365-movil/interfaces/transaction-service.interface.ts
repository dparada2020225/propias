import { AM365Account } from './associated-account.interface';

export interface IM365AddAccountBodyRequest {
  account: string,
  name: string,
  favorite: boolean,
  properties: {
    favorite: string;
    bank: string;
    email: string;
  }
}

export interface IM365DeleteAccountBodyRequest {
  account: string;
  properties: {
    bank: string;
  }
}

export interface IM365AddFavoriteBodyRequest {
  account: string;
  name: string;
  properties: {
    bank: string;
  }
}

export interface IM365DeleteFavoriteBodyRequest {
  account: string;
}

export interface IM365UpdateAccountBodyRequest {
  currentAccount: AM365Account;
  newAccount: IM365AddAccountBodyRequest;
}
