import { TestBed } from '@angular/core/testing';

import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { mockObservable, mockObservableError, mockPromise } from 'src/assets/testing';
import { ICurrentLimitsResponse } from '../interfaces/sp-limits.interface';
import { SpLimitsTransactionService } from '../services/transaction/sp-limits-transaction.service';
import { SpCurrentLimitsResolver } from './sp-current-limits.resolver';

describe('SpCurrentLimitsResolver', () => {
  let resolver: SpCurrentLimitsResolver;

  let spLimitsService: jasmine.SpyObj<SpLimitsTransactionService>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let parameterManagementService: jasmine.SpyObj<ParameterManagementService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {

    const spLimitsServiceSpy = jasmine.createSpyObj('SpLimitsTransactionService', ['getCurrentLimits'])
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide'])
    const parameterManagementServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])

    TestBed.configureTestingModule({
      providers: [
        { provide: SpLimitsTransactionService, useValue: spLimitsServiceSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: ParameterManagementService, useValue: parameterManagementServiceSpy },
        { provide: Router, useValue: routerSpy },
      ]

    });
    resolver = TestBed.inject(SpCurrentLimitsResolver);
    spLimitsService = TestBed.inject(SpLimitsTransactionService) as jasmine.SpyObj<SpLimitsTransactionService>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    parameterManagementService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve succesfully', () => {
    const responseMock: ICurrentLimitsResponse[] = [
      {
        dailyLimit: '10',
        monthlyLimit: '10',
        dateLastUpdate: '10',
        timeLastUpdate: '10',
        transactionLimit: '10'
      }
    ];
    spLimitsService.getCurrentLimits.and.returnValue(mockObservable(responseMock))
    resolver.resolve().subscribe((resulter) => {
      expect(parameterManagementService.getParameter).toHaveBeenCalled();
      expect(spinner.show).toHaveBeenCalledWith('main-spinner')
      expect(resulter).toEqual(responseMock)
    })
  })

  it('should resove have error', () => {
    router.navigate.and.returnValue(mockPromise(true))
    const responseMock = {
      error: {
        message: 'error http error'
      },
      status: 404,
    }


    spLimitsService.getCurrentLimits.and.returnValue(mockObservableError(responseMock))
    resolver.resolve().subscribe((resulter) => {
      expect(parameterManagementService.getParameter).toHaveBeenCalled();
      expect(spinner.show).toHaveBeenCalled()
      expect(resulter).toEqual({ message: 'error http error', status: 404, error: Object({ message: 'error http error' }) })
      expect(router.navigate).toHaveBeenCalledWith(['security-profile'])
    })

  })

});
