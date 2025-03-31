import { EProfile } from './profile.enum';

export enum ERCCountry {
  GT = 320,
  BISV = 222,
  BP = 340,
  BIPA = 591
}

export enum ERCBankCode {
  BIPA = 5,
  BP = 4,
  BISV = 3,
  GT = 1
}

export enum ERCInstallation {
  BIPA = 0,
  BP = 0,
  BISV = 0,
}

export const RCCountryMap = {
  [EProfile.PANAMA]: ERCCountry.BIPA,
  [EProfile.SALVADOR]: ERCCountry.BISV,
  [EProfile.HONDURAS]: ERCCountry.BP,
};

export const RCBankCodeMap = {
  [EProfile.PANAMA]: ERCBankCode.BIPA,
  [EProfile.SALVADOR]: ERCBankCode.BISV,
  [EProfile.HONDURAS]: ERCBankCode.BP,
};

export const RCInstallationMap = {
  [EProfile.PANAMA]: ERCInstallation.BIPA,
  [EProfile.SALVADOR]: ERCInstallation.BISV,
  [EProfile.HONDURAS]: ERCInstallation.BP,
};


export interface IRegionalConnectionResponse {
  authenticateUserResult: IRegionalConnectionResponseValues;
  bank: string;
  country: string;
  installation: string;
}

export interface IRegionalConnectionResponseValues {
  codigoRespuesta: string;
  descripcionRespuesta: string;
  token: string;
}

export interface IRegionalConnectionLoginStatusResponse {
  codigoRespuesta: string;
  descripcionRespuesta: string;
  token: string;
}

export interface IRegionalConnectionRequestBody {
  pais: string;
  banco: string;
  instalacion: string;
}

export interface IRedirectRegionalConnectionRequest {
  Pais: number;
  Banco: number;
  Instalacion: number;
  Usuario: string;
  TipoToken: number;
  TipoUsuario: number;
  Token: string;
}