import { iPaymentAccountDetailExecutionMock } from "src/assets/mocks/modules/loan/loan.data.mock";
import { PaymentExecutionBuilder } from "./b2b-payment-execution.interface";

describe('PaymentExecutionBuilder', () => {


    it('should PaymentExecutionBuilder build', () => {
        const payment = new PaymentExecutionBuilder()
            .debitAccount(iPaymentAccountDetailExecutionMock)
            .b2bAccount(iPaymentAccountDetailExecutionMock)
            .value1('value1')
            .value2('value2')
            .value3('value3')
            .value4('value4')
            .build();

        expect(payment).toBeDefined();
    })


})