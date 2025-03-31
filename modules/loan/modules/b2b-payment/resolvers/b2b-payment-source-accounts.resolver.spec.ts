import { TestBed } from '@angular/core/testing';

import { NgxSpinnerService } from 'ngx-spinner';
import { StatementsService } from 'src/app/service/shared/statements.service';
import { iAccount } from 'src/assets/mocks/modules/signature-tracking/mocksDetailTransaction';
import { mockObservable, mockObservableError } from 'src/assets/testing';
import { B2bPaymentSourceAccountsResolver } from './b2b-payment-source-accounts.resolver';

describe('B2bPaymentSourceAccountsResolver', () => {
  let resolver: B2bPaymentSourceAccountsResolver;
  let statements: jasmine.SpyObj<StatementsService>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;

  beforeEach(() => {

    const statementsSpy = jasmine.createSpyObj('StatementsService', ['getAccountsWithoutProduct'])
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show'])

    TestBed.configureTestingModule({
      providers: [
        { provide: StatementsService, useValue: statementsSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
      ]
    });
    resolver = TestBed.inject(B2bPaymentSourceAccountsResolver);
    statements = TestBed.inject(StatementsService) as jasmine.SpyObj<StatementsService>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should B2b Payment Source Accounts Resolver return IAccount', () => {
    statements.getAccountsWithoutProduct.and.returnValue(mockObservable([iAccount]));
    resolver.resolve(null, null as any).subscribe({
      next: (account) => {
        expect(account).toEqual([iAccount]);
      },
      complete() {
        expect(spinner.show).toHaveBeenCalledWith("main-spinner")
      },
    })
  })

  it('should B2b Payment Source Accounts Resolver return IAccount but enabled = false', () => {
    const mockAccount = { ...iAccount }
    mockAccount.enabled = false;
    statements.getAccountsWithoutProduct.and.returnValue(mockObservable([mockAccount]));
    resolver.resolve(null, null as any).subscribe({
      next: (account) => {
        expect(account).toEqual([]);
      },
      complete() {
        expect(spinner.show).toHaveBeenCalledWith("main-spinner")
      },
    })
  })

  it('should B2b Payment Source Accounts Resolver return error', () => {
    statements.getAccountsWithoutProduct.and.returnValue(mockObservableError({
      status: 500,
      error: {
        message: 'error test'
      }
    }));
    resolver.resolve(null, null as any).subscribe({
      error: (err) => {
        expect(err?.error?.message).toEqual('error test')
        expect(err?.status).toEqual(500)
      },
      complete() {
        expect(spinner.show).toHaveBeenCalledWith("main-spinner")
      },
    })
  })

});
