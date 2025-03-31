import { IPaymentAccount, IPaymentAccountDetail } from './b2b-payment.interface';

export interface IB2BDPaymentBuildFormParameters {
  accountDetail: IPaymentAccountDetail,
  currency: string,
  b2bAccount: IPaymentAccount
}
