export interface IExecuteTransactionWithToken<T = any> {
  status: number;
  message?: string;
  data: T | null;
}

export interface IExecuteTransactionWithTokenFailedResponse<T = any> {
  status: number;
  error: string;
  message: string;
  data?: T | null;
}

