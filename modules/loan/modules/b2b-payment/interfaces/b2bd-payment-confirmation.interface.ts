import { IPaymentAccount, IPaymentAccountDetail } from './b2b-payment.interface';
import { IAccount } from '../../../../../models/account.inteface';
import { IB2bPaymentFormValues } from './b2b-payment-state.interface';

export interface IPaymentBaseProperties {
  detailAccount: IPaymentAccountDetail,
  sourceAccount: IAccount,
  currency: string
}

export interface IB2BDPaymentConfirmationDefinitionParameters extends IPaymentBaseProperties {
  formValues: IB2bPaymentFormValues;
  b2bAccount: IPaymentAccount;
}

export interface ITransferFormValues {
  accountDebited: string;
  paymentBalance: string;
}
