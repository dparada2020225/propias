export interface IFlowError {
  message: string;
  status: number;
  error: string;
}

export class FlowErrorBuilder {
  private readonly _error: IFlowError;

  constructor() {
    this._error = {
      message: 'Message default',
      status: 0,
      error: 'Error default',
    };
  }

  message(message: string): FlowErrorBuilder {
    this._error.message = message;
    return this;
  }

  status(status: number): FlowErrorBuilder {
    this._error.status = status;
    return this;
  }

  error(error: string): FlowErrorBuilder {
    this._error.error = error;
    return this;
  }

  build(): IFlowError {
    return this._error;
  }
}
