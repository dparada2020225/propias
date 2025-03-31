import { ITMTransaction } from '../../../interfaces/tm-transaction.interface';
import { ESTTransactionStatus } from '../enum/st-common.enum';

export interface ISignatureTrackingTable extends ITMTransaction {
  isChecked: boolean;
}

export interface IMultipleRequestResponse {
  reference: string;
  dateTime: string;
  date?: string;
  code?: string;
}

export interface ISignatoryEmbbededParams {
  reference: string;
  currentTabPosition: string;
  action: string;
}

export interface ISignatureTrackingMessageOutput {
  message: string | null;
  status: string;
  position: number;
  action: string;
  data: IMultipleRequestResponse | null;
  typeAlert?: string;
}

export interface ISTTransactionState {
  transactionSelected: ITMTransaction;
  position?: number;
}

export interface ISignatureTrackingServiceResponse {
  amount: string;
  reference: string;
  serviceDescription: string;
  referenceCode: string;
  user: string;
  errorDetail: string;
  dateTime: string;
  currency: string;
  status: ESTTransactionStatus;
  statusCode?: string;
  request?: string;
  serviceCode?: string;
}


export class SignatureTrackingServiceResponse {
  private readonly _response: ISignatureTrackingServiceResponse;

  constructor() {
    this._response = {
      amount: '0',
      reference: '',
      serviceDescription: '',
      referenceCode: '',
      user: '',
      errorDetail: '',
      dateTime: '',
      currency: '',
      status: null!,
      statusCode: null!,
      request: '',
      serviceCode: '',
    };

  }

  status(value: ESTTransactionStatus) {
    this._response.status = value;
    return this;
  }

  statusCode(value: string) {
    this._response.statusCode = value;
    return this;
  }

  serviceCode(value: string) {
    this._response.serviceCode = value;
    return this;
  }

  request(value: string) {
    this._response.request = value;
    return this;
  }


  amount(value: string) {
    this._response.amount = value;
    return this;
  }

  reference(value: string) {
    this._response.reference = value;
    return this;
  }

  serviceDescription(value: string) {
    this._response.serviceDescription = value;
    return this;
  }

  referenceCode(value: string) {
    this._response.referenceCode = value;
    return this;
  }

  user(value: string) {
    this._response.user = value;
    return this;
  }

  errorDetail(value: string) {
    this._response.errorDetail = value;
    return this;
  }

  dateTime(value: string) {
    this._response.dateTime = value;
    return this;
  }

  currency(value: string) {
    this._response.currency = value;
    return this;
  }


  build(): ISignatureTrackingServiceResponse {
    return this._response;
  }
}
