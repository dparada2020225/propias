import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';

export interface IB2bRequestConfig {
  interestList: IB2bRequestConfigValue[],
  capitalList: IB2bRequestConfigValue[],
}

export interface IB2bRequestConfigValue {
  code: string,
  description: string
}


export interface IB2bRequest {
  amount: number;
  fixedTerm: string;
  paymentMethod: string;
  accountCharged: string;
  dueDate: NgbDate
  interestPaymentFrequency: string;
  capitalPaymentFrequency: string;
  accountAccredit: string;
}

export interface IB2bRequestSavedStorage {
  formValues: IB2bRequest;
  requestDetail: IB2bRequestResponse;
  currency?: string;
  step?: number;
  dateTime: {
    date: string;
    hour: string;
  }
}


export interface IB2bRequestBody {
  amount: number;
  fixedTerm: string;
  paymentMethod: string;
  accountCharged: string;
  dueDate: string
  interestPaymentFrequency: string;
  capitalPaymentFrequency: string;
  accountAccredit: string;
}

export interface IDueDate {
  month: number
  year: number
  day: number
}

export interface IB2bRequestResponse {
  amount: number;
  b2bID: string;
  capitalPaymentFrequency: string;
  dueDate: string;
  commission: number;
  expensesValue: number;
  interestPaymentFrequency: string;
  nextPaymentDate: string;
  paymentAmount: number;
  rate: number;
  reference: string;
}

export class B2bRequestBuilder {
  private readonly _request: IB2bRequestBody;

  constructor() {
    this._request = {
      amount: 0,
      fixedTerm: '',
      paymentMethod: '',
      accountCharged: '',
      dueDate: moment().format('YYYYMMDD'),
      interestPaymentFrequency: '',
      capitalPaymentFrequency: '',
      accountAccredit: '',
    };
  }

  amount(value: number): B2bRequestBuilder {
    this._request.amount = value;
    return this;
  }

  fixedTerm(value: string): B2bRequestBuilder {
    this._request.fixedTerm = value;
    return this;
  }

  paymentMethod(value: string): B2bRequestBuilder {
    this._request.paymentMethod = value;
    return this;
  }

  accountCharged(value: string): B2bRequestBuilder {
    this._request.accountCharged = value;
    return this;
  }

  interestPaymentFrequency(value: string): B2bRequestBuilder {
    this._request.interestPaymentFrequency = value;
    return this;
  }

  capitalPaymentFrequency(value: string): B2bRequestBuilder {
    this._request.capitalPaymentFrequency = value;
    return this;
  }

  accountAccredit(value: string): B2bRequestBuilder {
    this._request.accountAccredit = value;
    return this;
  }

  build(): IB2bRequestBody {
    return this._request;
  }
}
