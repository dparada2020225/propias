import { IAccount } from '../../../../../models/account.inteface';
import { IPaymentAccountDetail } from './b2b-payment.interface';
import { IPaymentExecutionDescription } from './b2b-payment-execution.interface';

export interface IB2BDPaymentVoucherDefinitionParameters {
  paymentDetail: IPaymentExecutionDescription,
  sourceAccount: IAccount,
  currency: string,
  b2bAccount: IPaymentAccountDetail
}
