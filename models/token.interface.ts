export interface ITokenResponse {
  code: number;
  message: string;
  digitCode: string;
}

export interface IModalTokenResponse {
  token: string;
}

export interface IServiceResponse {
  code: number;
  message: string;
}

export interface IServicesTokenRequired {
  reference:   string;
  errorCode:   string;
  description: string;
  services:    string[];
}

export interface ISettingsEndPointsItem {
  url: string;
  service: string;
  method: string;
}

export interface ISettingEndPoint {
  [key: string]: ISettingsEndPointsItem[];
}

export interface IBodyRequest<T = any> {
  bodyRequest: T;
  isTokenRequired: boolean;
  token?: string;
}

export interface IHeaderRequest {
  isTokenRequired: boolean;
  typeTransaction: string;
  token?: string;
  service: string;
  serviceCode?: string;
}
