import { Injectable } from '@angular/core';
import {
  IPaymentAccountDetailExecution,
  PaymentExecutionBuilder
} from '../../interfaces/b2b-payment-execution.interface';
import { IB2bPaymentParametersToExecuteTransaction } from '../../interfaces/b2b-payment-state.interface';

@Injectable({
  providedIn: 'root'
})
export class B2bdPaymentDefinitionService {

  buildPaymentExecutionData(values: IB2bPaymentParametersToExecuteTransaction) {
    const { paymentDetail, selectedSourceAccount, formValues, currency } = values;

    const sourceAccount: IPaymentAccountDetailExecution = {
      product: `${selectedSourceAccount?.product ?? '0'}`,
      subProduct: `${selectedSourceAccount?.subproduct ?? '0'}`,
      currency: `${selectedSourceAccount?.currency ?? '0'}`,
      accountNumber: `${selectedSourceAccount?.account ?? '0'}`,
      amount: formValues?.paymentBalance as any,
    };

    const targetAccount: IPaymentAccountDetailExecution = {
      product: '0',
      subProduct: '0',
      currency: currency ?? 'undefined',
      accountNumber: paymentDetail?.b2bID,
      amount: formValues?.paymentBalance as any,
    };

    return new PaymentExecutionBuilder()
      .debitAccount(sourceAccount)
      .b2bAccount(targetAccount)
      .value1(paymentDetail?.receiptNumber ?? '0')
      .build();
  }
}
