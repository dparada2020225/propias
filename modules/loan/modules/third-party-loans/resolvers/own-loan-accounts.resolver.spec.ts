import { TestBed } from '@angular/core/testing';

import { UtilService } from 'src/app/service/common/util.service';
import { iOwnLoansPaginationMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { mockObservable, mockObservableError } from 'src/assets/testing';
import { IFlowError } from '../../../../../models/error.interface';
import { OwnLoansService } from '../services/transaction/own-loans.service';
import { OwnLoanAccountsResolver } from './own-loan-accounts.resolver';

describe('OwnLoanListResolver', () => {
  let resolver: OwnLoanAccountsResolver;
  let utils: jasmine.SpyObj<UtilService>;
  let ownLoansService: jasmine.SpyObj<OwnLoansService>;

  beforeEach(() => {

    const utilsSpy = jasmine.createSpyObj('UtilService', ['', 'showLoader'])
    const ownLoansServiceSpy = jasmine.createSpyObj('OwnLoansService', ['getOwnsLoans'])

    TestBed.configureTestingModule({
      providers: [
        { provide: UtilService, useValue: utilsSpy },
        { provide: OwnLoansService, useValue: ownLoansServiceSpy },
      ]
    });
    resolver = TestBed.inject(OwnLoanAccountsResolver);
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    ownLoansService = TestBed.inject(OwnLoansService) as jasmine.SpyObj<OwnLoansService>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should Own Loan Accounts Resolver return succesfully', () => {
    ownLoansService.getOwnsLoans.and.returnValue(mockObservable([iOwnLoansPaginationMock]))
    resolver.resolve().subscribe({
      next: (value) => {
        expect(value).toEqual([iOwnLoansPaginationMock])
      },
      complete() {
        expect(utils.showLoader).toHaveBeenCalled();
      },
    })
  })

  it('should Own Loan Accounts Resolver return error', () => {
    ownLoansService.getOwnsLoans.and.returnValue(mockObservableError({
      status: 400,
      error: {
        message: 'Bad Request'
      }
    }))

    resolver.resolve().subscribe({
      error: (err: IFlowError) => {
        expect(err.status).toEqual(400);
        expect(err.message).toEqual('Bad Request');
      },
      complete() {
        expect(utils.showLoader).toHaveBeenCalled();
      },
    })
  })
});
