import { IMenuEquivalencySettings } from './service-menu.model';

export interface ISettingData {
  version: string;
  country: string;
  currency: string;
  accentColor: string;
  language: string;
  locale: string;
  environment: string;
  exchageRateDecimals: number;
  decimals: number;
  keepAliveTimeout: number;
  endpoints: string;
  contactsInfo: IContactsInfo;
  customProperties: ICustomProperties;
  optionsMenu: Array<{}>;
  internalMenu: Array<string>;
  externalMenu: Array<string>;
  banners: Array<IBanner>;
  configs: IConfigs;
  onlineBankingCoreServices: string[];
  notAdminProfiles: Array<string>;
  passwordSecurity: Array<IpasswordSecurity>;
  'x-4028': number;
  token: IToken;
  urls: IUrls;
  loginBanners?: ILoginBanners;
  checkpointList: ICheckpoint[];
  fullUsersByProfile: string[];
  customFeatures: IMenuEquivalencySettings;
  regionalConnectionPriv?: string;
  tokenRequestSetting: string;
  messages: ISettingMessagesCollection;
  urlVideoTutorials: string;
}

export interface ILoginBanners {
  pc: IBanner[];
  tablet: IBanner[];
}

interface ISettingMessagesCollection {
  'delete-send': ISettingMessageCollectionItem;
  'return-authorize': ISettingMessageCollectionItem;
  'return-process': ISettingMessageCollectionItem;
  'version-notification': ISettingMessageCollectionItem;
  'version-title': ISettingMessageCollectionItem;
}

interface ISettingMessageCollectionItem {
  en: string;
  es: string;
}

export interface IEndpoints {
  catalogs: string;
  login: string;
  token: string;
  'accounts-and-permissions': string;
  'app-customization': string;
}

export interface IContactsInfo {
  whatsapp: string;
  web_page: string;
  phone: string;
  emailSubject: string;
  email: string;
  address: string;
}

export interface ICustomProperties {
  prefix: string;
  'valid-characters': string;
  'contract-e2-id': string;
  'url-tips'?: string;
}

export interface IConfigs {
  'smart-id': ISmartid;
}

export interface ISmartid {
  enabled: string;
  license: string;
  channel: string;
  production: string;
}

export interface IBanner {
  img: string;
  link?: string;
}

export interface IToken {
  physical: Ilengths;
  sms: Ilengths;
  'soft-token'?: Ilengths;
}
export interface Ilengths {
  max: number;
  min: number;
}

export interface IpasswordSecurity {
  caseSensitive: boolean;
  label: IlabelPasswordSecurity;
  regex: string;
}

export interface IlabelPasswordSecurity {
  en: string;
  es: string;
}

export interface IUrls {
  'regional-connection': string;
}

export interface ICheckpoint {
  service: string;
  category: string;
  type: string;
}
