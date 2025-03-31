import { TestBed } from '@angular/core/testing';

import { StatementsUtilsService } from './statements-utils.service';

describe('StatementsUtilsService', () => {
  let service: StatementsUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatementsUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('test_calc_amount_on_operations_debit_greater_than_credit', () => {
    const debit = 10;
    const credit = 5;
    const amounts = { debit: { transactionAmount: 0, amount: 0 }, credit: { transactionAmount: 0, amount: 0 } };
    const operation = { value: 0 };
    service.calcAmountOnOperations(debit, credit, amounts, operation);
    expect(amounts.debit.transactionAmount).toEqual(1);
    expect(amounts.debit.amount).toEqual(10);
    expect(operation.value).toEqual(10);
  });

  it('test_calc_amount_on_operations_credit_greater_than_debit', () => {
    const debit = 5;
    const credit = 10;
    const amounts = { debit: { transactionAmount: 0, amount: 0 }, credit: { transactionAmount: 0, amount: 0 } };
    const operation = { value: 0 };
    service.calcAmountOnOperations(debit, credit, amounts, operation);
    expect(amounts.credit.transactionAmount).toEqual(1);
    expect(amounts.credit.amount).toEqual(10);
    expect(operation.value).toEqual(10);
  });
});
