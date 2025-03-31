export interface IS365TransferReason {
  code: string;
  description: string;
}

export type TS365TransferReasonList = Array<IS365TransferReason>;

export interface IS365TermsConditionInfoResponse {
  reference: string;
  code: string;
  description: string;
  surcharge: string;
  refusalFee: string;
  taxes: string;
  shippingSchedule: string;
  receptionSchedule: string;
  naturalClientInitialValue: string;
  legalClientInitialValue: string;
}

export interface IS365RateToApplyRequest {
  transferenceType:    string;
  sourceAccount:       string;
  targetBank:          string;
  targetAccount:       string;
  targetType:          string;
  targetCurrency:      string;
  amount:              string;
  achTransferenceType: string;
  manual:              boolean;
  scheduleDateTime:            string;
}


export interface IS365TransferRequest {
  sourceProduct:    string;
  sourceSubProduct: string;
  sourceAccount:    string;
  sourceCurrency:   string;
  sourceAmount:     string;
  targetBank:       number;
  targetProduct:    string;
  targetAccount:    string;
  targetCurrency:   string;
  targetAmount:     string;
  comment:          string;
  lotNumber:        string;
  channelType:      string;
  reason:           string;
  programmedDate:   string;
  targetCountry:    string;
}

export interface IS365TransferResponse {
  reference:   string;
  code:        string;
  description: string;
  dateTime:    string;
}
