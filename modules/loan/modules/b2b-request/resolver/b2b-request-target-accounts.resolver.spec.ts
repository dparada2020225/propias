import { TestBed } from '@angular/core/testing';

import { RouterStateSnapshot } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FindServiceCodeService } from 'src/app/service/common/find-service-code.service';
import { StatementsService } from 'src/app/service/shared/statements.service';
import { iAccount } from 'src/assets/mocks/modules/signature-tracking/mocksDetailTransaction';
import { MockRouterStateSnapshot } from 'src/assets/mocks/modules/transfer/service/own-transfer/build.route-snapshot.mock';
import { mockObservable, mockObservableError } from 'src/assets/testing';
import { B2bRequestTargetAccountsResolver } from './b2b-request-target-accounts.resolver';

describe('B2bRequestTargetAccountsResolver', () => {
  let resolver: B2bRequestTargetAccountsResolver;
  let statements: jasmine.SpyObj<StatementsService>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let findService: jasmine.SpyObj<FindServiceCodeService>;
  let state: RouterStateSnapshot

  beforeEach(() => {

    const statementsSpy = jasmine.createSpyObj('StatementsService', ['getAccountsWithoutProduct'])
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show'])
    const findServiceSpy = jasmine.createSpyObj('FindServiceCodeService', ['getServiceCode'])

    TestBed.configureTestingModule({
      providers: [
        { provide: StatementsService, useValue: statementsSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: FindServiceCodeService, useValue: findServiceSpy },
      ]
    });
    resolver = TestBed.inject(B2bRequestTargetAccountsResolver);
    statements = TestBed.inject(StatementsService) as jasmine.SpyObj<StatementsService>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    findService = TestBed.inject(FindServiceCodeService) as jasmine.SpyObj<FindServiceCodeService>;

    state = new MockRouterStateSnapshot("loan/third-party-loans")
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should return IAccount', () => {
    statements.getAccountsWithoutProduct.and.returnValue(mockObservable([iAccount]));
    resolver.resolve(null, state).subscribe({
      next(value) {
        expect(value).toEqual([iAccount])
      },
      complete() {
        expect(findService.getServiceCode).toHaveBeenCalled();
        expect(spinner.show).toHaveBeenCalled();
      },
    })
  })

  it('should return error', () => {
    statements.getAccountsWithoutProduct.and.returnValue(mockObservableError({
      status: 404,
      error: 'Not Found',
    }))

    resolver.resolve(null, state).subscribe({
      error(err) {
        expect(err.status).toEqual(404)
        expect(err.message).toEqual('error_getting_list_accounts_credit')
        expect(err.error).toEqual('Not Found')
      },
      complete() {
        expect(findService.getServiceCode).toHaveBeenCalled();
        expect(spinner.show).toHaveBeenCalled();
      },
    })
  })

});
