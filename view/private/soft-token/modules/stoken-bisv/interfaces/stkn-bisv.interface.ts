import { HttpErrorResponse } from "@angular/common/http";

export interface IStepsStokenBISV {
  id: number;
  icon: string;
  description: string;
  title?: string;
}

export interface IQrCode {
  qrValue: string;
  qrCode: string;
}

export interface IImagesData {
  id: number;
  name: string;
  path: string;
  idName: string;
  width?: string;
  height?: string;
}

export interface IUserDataStoken {
  code: string;
  username: string;
}

export interface IValidateOTP {
  username: string;
  password: string;
}

export interface IQrValue {
  qrValue: string;
}

export interface IResOkOTP {
  code: string;
  message: string;
  timestamp: string;
  status: number;
}

export interface IResErrorOTP {
  code: string;
  errorMessage: string;
  message: string;
  timestamp: string;
  exception: string;
  status: number;
}

export interface IResValidateOTP {
  resOk?: IResOkOTP;
  resError?: IResErrorOTP;
}

export interface IStokenPreLog {
  code: string;
  username: string;
  stokenPreLog: boolean;
}

export interface IChangeDeviceReq {
  code: string;
  username: string;
}

export interface IResSearchUserSToken {
  status: number;
  code: string;
  message: string;
}

export interface IGenerateQrSToken {
  inputCode: string;
  username: string;
  typeTokenValidation: string;
}

export interface IErrorSearchUser {
  status: number;
  message: string;
  data: null;
}

export interface IRequestSearchUser {
  externalId: string;
}

export interface IGenerateChangeQr {
  status: number | string;
  message?: string;
  data?: string | null;
  error?: null | HttpErrorResponse;
}
