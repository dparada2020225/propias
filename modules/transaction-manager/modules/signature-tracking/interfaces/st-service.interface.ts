export interface ISignatureTrackingModify {
  transactionCode: string;
  serviceModify: string;
  data: string;
}


export interface ISignatureTrackingParam {
  transactionCode: string;
  signatureType: string;
  transactionStatus: string;
}

export interface ISTSendParametersBodyRequest extends ISignatureTrackingParam {
  serviceCode: string;
  amount: string;
  reason: string;
  currency: string;
}



export interface ISignatureTrackingProcess {
  transactionCode: string;
  signatureType: string;
  serviceCode?: string;
}

export interface ISTProcessWithToken {
  isTokenRequired: boolean;
  tokenValue: string;
  typeTransaction: string;
  bodyRequest: ISignatureTrackingProcess;
  serviceCode?: string;
}
