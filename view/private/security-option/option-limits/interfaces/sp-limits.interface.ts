export interface ISpCurrentLimitsRequestBody {
  clientCode: string;
}

export interface ISpSetLimitsRequestBody {
  transactionLimit: string;
  dailyLimit: string;
  monthlyLimit: string;
}

export interface ICurrentLimitsResponse {
  dailyLimit:       string;
  dateLastUpdate:   string;
  monthlyLimit:     string;
  timeLastUpdate:   string;
  transactionLimit: string;
}

export enum ETSPLimitsNavParameter {
  SECURITY_PARAMETER = 'AUTHENTICATION_TOKEN'
}

export enum ESPLimitsDateValues {
  DATE = '00000000',
  HOUR = '000000'
}
