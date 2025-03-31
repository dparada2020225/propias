export interface ServiceOption {
    service: string,
    name: string,
    show: boolean,
    child: []
}

export interface IMenuEquivalencyItem {
  new: string;
  old: string;
  accessCode?: string;
  default: string;
}

export interface IMenuEquivalencyElement {
  url: IMenuEquivalencyItem;
  parameters?: {};
}

export interface IMenuEquivalency {
  [key: string]: IMenuEquivalencyElement[];
}

export interface IMenuEquivalencySettings {
  [key: string]: 'true' | 'false';
}

export interface IValidateServiceCodeParameters {
  serviceCode: string | undefined;
  onlineCoreServices: IMenuEquivalencySettings;
  url: string;
  currentElement: IMenuEquivalencyElement | undefined;
}

export enum ECustomFeatureValue {
  ENABLED = 'true',
  DISABLED = 'false'
}
