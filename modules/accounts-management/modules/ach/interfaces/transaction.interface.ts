export interface IAMACHAddAccountRequest {
  type: string;
  alias: string;
  account: string;
  currency: string;
  name: string;
  status: string;
  useAnyCurrency: boolean
  clientType: string;
  properties: IAMACHAddAccountProperties;
  favorite: boolean;
}

export interface IAMACHUpdateAccountRequest {
  status?: string;
  id: string;
  request: IAMACHAddAccountRequest;
}

export interface IAMACHDeleteAccountRequest {
  id: string;
  clientNumber: string;
  bankCode: string;
  accountNumber: string;
}

export interface IAMACHAddAccountProperties {
  bank: number;
  email: string;
  clientId: string;
  documentType: string;
  documentNumber: string;
  favorite: string;
}
