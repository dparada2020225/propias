export interface AchUniLimitForUserResponse {
  amount: number;
  errorCode: string;
  errorDescription: string;
}

export interface LimitTransferClientCurrency {
  lowerLimit: number;
  upperLimit: number;
  errorCode: string;
  errorDescription: string;
}
