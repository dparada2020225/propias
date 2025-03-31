export interface AchUniTransferDetails {
  sourceProduct: string;
  sourceSubproduct: string;
  sourceAccountNumber: string;
  sourceCurrency: string;
  sourceAmount: string;
  targetBank: string;
  targetProduct: string;
  targetAccountNumber: string;
  targetCurrency: string;
  targetAmount: string;
  commentary: string;
  targetAccountIdentificationNumber: string;
  purpose: string;
  clientType: string;
  service: string;
}
