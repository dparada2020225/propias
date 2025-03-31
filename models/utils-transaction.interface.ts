export interface ITransactionSuccessResponse<T = any> {
  status: number;
  message?: string;
  data: T;
}

export interface  ITransactionFailedResponse<T = any> {
  status: number;
  error: any;
  message: string;
  data?: T;
}


export type TTransactionResponse<T = any> = ITransactionSuccessResponse<T> | ITransactionFailedResponse<T>;
