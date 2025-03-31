import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { IAccount } from '../../../../../models/account.inteface';
import { IB2bRequestResponse } from './b2b-request.interface';

export interface IB2bRequestFormValues {
  amount: number;
  fixedTerm: string;
  paymentMethod: string;
  accountCharged: string;
  dueDate: NgbDate
  interestPaymentFrequency: string;
  capitalPaymentFrequency: string;
  accountAccredit: string;
}

export interface IB2bRequestStateDefault {
  formValues: IB2bRequestFormValues;
  sourceAccountSelected: IAccount;
  transactionResponse: IB2bRequestResponse;
}
