export interface IResponseExpirationDate{
  status: number;
  handler: string;
  reference: string;
  codeError: string;
  descriptionError: string;
}

export enum UpdateDatacheduleService {
  UPDATE_DATA = 'web-actcli'
}

export enum UpdateDataSettingsProperty {
  UPDATE_DATA = 'data-update'
}

