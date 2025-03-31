import { TestBed } from '@angular/core/testing';

import { NgxSpinnerService } from 'ngx-spinner';
import { iPaymentAccountMock, iPaymentB2bAccountResponseMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { mockObservable, mockObservableError } from 'src/assets/testing';
import { B2bPaymentService } from '../service/transction/b2b-payment.service';
import { B2bPaymentLoanAccountsResolver } from './b2b-payment-loan-accounts.resolver';

describe('B2bPaymentLoanAccountsResolver', () => {
  let resolver: B2bPaymentLoanAccountsResolver;
  let paymentTransactionService: jasmine.SpyObj<B2bPaymentService>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;

  beforeEach(() => {
    const paymentTransactionServiceSpy = jasmine.createSpyObj('B2bPaymentService', ['getB2bList'])
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show'])
    TestBed.configureTestingModule({
      providers: [
        { provide: B2bPaymentService, useValue: paymentTransactionServiceSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
      ]
    });
    resolver = TestBed.inject(B2bPaymentLoanAccountsResolver);
    paymentTransactionService = TestBed.inject(B2bPaymentService) as jasmine.SpyObj<B2bPaymentService>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should total Balance', () => {
    paymentTransactionService.getB2bList.and.returnValue(mockObservable([iPaymentAccountMock]))
    resolver.resolve().subscribe({
      next: (value) => {
        expect(value).toEqual(iPaymentB2bAccountResponseMock)
      },
      complete() {
        expect(spinner.show).toHaveBeenCalledWith("main-spinner")
      },
    })
  })

  it('should total Balance but have error', () => {

    paymentTransactionService.getB2bList.and.returnValue(mockObservableError({
      error: 'failed',
      status: 500
    }))

    resolver.resolve().subscribe({
      error: (err) => {
        expect(err.error).toEqual('failed')
        expect(err.status).toEqual(500)
        expect(err.message).toEqual('errorB2B:get_b2bAccounts')
      },
      complete() {
        expect(spinner.show).toHaveBeenCalledWith("main-spinner")
      },
    })

  })

});
