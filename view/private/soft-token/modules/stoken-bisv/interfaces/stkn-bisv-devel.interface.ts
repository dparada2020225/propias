import { HttpErrorResponse } from "@angular/common/http";

export interface IGracePeriodStknBisv {
  hasGracePeriod: boolean
}

export interface IAssignStknBisv{
  responseCode: string;
  responseMessage: string;
}

export interface IGenerateQRStknBisv{
  responseCode: string;
  responseMessage: string;
}

export interface IAssignStknBisvResponse{
  status: number | string;
  message: string;
  responseCode: string | number;
  error: HttpErrorResponse | null;
}

export interface IActivateAfiliation{
  code: string;
  description: string;
  reference: string;
}

export interface IChangeDeviceDevelStkn{
  status: 200,
  message: '',
  data: any,
  error: null
}