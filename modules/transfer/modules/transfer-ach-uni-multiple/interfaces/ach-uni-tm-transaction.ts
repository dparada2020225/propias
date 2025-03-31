export interface ITMUploadUniTrfRequest {
  uploadFile: FormData;
}

export interface ITMAchUniTransactionRequest{
  clientNumber: string;
  creditCount: string;
  amount: string;
  currency: string;
  authorization: string;
  sourceAccountNumber: string;
  fileName: string;
  date: string;
  sourceAccountProduct: string;
  sourceAccountName: string;
  clientType: string;
  credits: ITMAchUniCreditTransaction[];
  omitASTransaction: boolean;
  serviceType?: string,
}

export interface ITMAchUniCreditTransaction {
  bankCode: string;
  product: string;
  currency: string;
  accountNumber: string;
  amount: string;
  description: string;
  lineNumber: number;

  serviceType: string,
  targetType: string,
  email: string
}

export interface ITMAchUniResponse {
  responseCode: string;
  errorMessage: string;
  reference: string;
  date: string
  lotNumber: string
}
