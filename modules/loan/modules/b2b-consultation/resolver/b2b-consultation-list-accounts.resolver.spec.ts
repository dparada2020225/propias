import { TestBed } from '@angular/core/testing';

import { IFlowError } from 'src/app/models/error.interface';
import { UtilService } from 'src/app/service/common/util.service';
import { iB2bConsultationAccountsMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { mockObservable, mockObservableError } from 'src/assets/testing';
import { B2bConsultationTransactionService } from '../service/transaction/b2b-consultation-transaction.service';
import { B2bConsultationListAccountsResolver } from './b2b-consultation-list-accounts.resolver';

describe('B2bConsultationListAccountsResolver', () => {
  let resolver: B2bConsultationListAccountsResolver;
  let consultationTransaction: jasmine.SpyObj<B2bConsultationTransactionService>;
  let utils: jasmine.SpyObj<UtilService>;

  beforeEach(() => {
    const consultationTransactionSpy = jasmine.createSpyObj('B2bConsultationTransactionService', ['b2bList'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['showLoader', 'hideLoader'])

    TestBed.configureTestingModule({
      providers: [
        { provide: B2bConsultationTransactionService, useValue: consultationTransactionSpy },
        { provide: UtilService, useValue: utilsSpy },
      ]
    });
    resolver = TestBed.inject(B2bConsultationListAccountsResolver);
    consultationTransaction = TestBed.inject(B2bConsultationTransactionService) as jasmine.SpyObj<B2bConsultationTransactionService>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should B2b Consultation List Accounts Resolver return IB2bConsultationAccounts', () => {
    consultationTransaction.b2bList.and.returnValue(mockObservable([iB2bConsultationAccountsMock]));
    resolver.resolve().subscribe({
      next: (value) => {
        expect(value).toEqual([iB2bConsultationAccountsMock])
      },
      complete() {
        expect(utils.showLoader).toHaveBeenCalled()
      },
    })
  })

  it('should B2b Consultation List Accounts Resolver return IFlowError', () => {
    consultationTransaction.b2bList.and.returnValue(mockObservableError({
      error: {
        message: 'Invalid'
      },
      status: 404
    }));
    resolver.resolve().subscribe({
      next: (value) => {
      },
      error: (err: IFlowError) => {
        expect(err.message).toEqual('Invalid')
        expect(err.status).toEqual(404)
      },
      complete() {
        expect(utils.showLoader).toHaveBeenCalled()
      },
    })
  })

});
