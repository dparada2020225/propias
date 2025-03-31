export interface IB2bFlowError {
  message: string;
  status: number;
  error: string;
}

export class B2bFlowErrorBuilder {
  private readonly _error: IB2bFlowError;

  constructor() {
    this._error = {
      message: undefined!,
      status: undefined!,
      error: undefined!
    }
  }

  message(value: string): B2bFlowErrorBuilder {
    this._error.message = value
    return this
  }

  status(value: number): B2bFlowErrorBuilder {
    this._error.status = value
    return this
  }

  error(value: string): B2bFlowErrorBuilder {
    this._error.error = value
    return this
  }

  build(): IB2bFlowError {
    return this._error
  }
}
