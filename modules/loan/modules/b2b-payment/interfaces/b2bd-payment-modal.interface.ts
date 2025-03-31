import { IPaymentAccountDetail } from './b2b-payment.interface';
import { IAccount } from '../../../../../models/account.inteface';
import { IPaymentExecutionDescription } from './b2b-payment-execution.interface';
import { IUserInfo } from '../../../../../models/user-info.interface';

export interface IB2BDModalDefinitionParameters {
  paymentDetail: IPaymentExecutionDescription,
  sourceAccount: IAccount,
  b2bADetail: IPaymentAccountDetail
  dateTime: {
    hour: string;
    date: string;
  },
  bankName: string,
  user: IUserInfo,
  currency: string
}
