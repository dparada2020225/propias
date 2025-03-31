import { IPaymentExecutionDescription } from './b2b-payment-execution.interface';
import { IPaymentAccountDetail } from './b2b-payment.interface';
import { IAccount } from '../../../../../models/account.inteface';

export interface IB2BDPdfDefinitionParameters {
  paymentDetail: IPaymentExecutionDescription,
  b2bDetail: IPaymentAccountDetail
  sourceAccount: IAccount,
  currency: string
}
