import { IPaymentAccount, IPaymentAccountDetail } from './b2b-payment.interface';
import { IAccount } from '../../../../../models/account.inteface';
import { IPaymentExecutionDescription } from './b2b-payment-execution.interface';

export interface IB2bPaymentState {
  accountToPaymentSelected: IPaymentAccount;
  paymentDetail: IPaymentAccountDetail;
  formValues?: IB2bPaymentFormValues | null;
  selectedSourceAccount?: IAccount | null;
  message?: string;
  paymentTransactionResponse?: IPaymentExecutionDescription;
}

export interface IB2bPaymentParametersToExecuteTransaction {
  accountToPaymentSelected: IPaymentAccount;
  paymentDetail: IPaymentAccountDetail;
  formValues?: IB2bPaymentFormValues | null;
  selectedSourceAccount?: IAccount | null;
  currency: string;
}

export interface IB2bPaymentFormValues {
  accountDebited: string;
  paymentBalance: string;
}
