export interface ITM365CorrelativeResponse {
  responseCode: string,
  errorMessage: string,
  correlative: string,
}

export interface ITM365TransferRequest {
  lotNumber: string;
  sourceAccount: string;
  sourceCurrency: string;
  transfersQuantity: string,
  totalAmountLot: string
  fileName: string,
  channelType: string
}
