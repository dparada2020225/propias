export interface IACHLimitsRequestBody {
  service: string;
  currency: string;
}

export interface IACHLimitsResponse {
  type: string;
  amount: string;
}
