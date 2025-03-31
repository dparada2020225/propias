import { TestBed } from '@angular/core/testing';

import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { iB2bRequestConfigMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { mockObservable, mockObservableError } from 'src/assets/testing';
import { B2bRequestService } from '../service/transaction/b2b-request.service';
import { B2bRequestConfigurationResolver } from './b2b-request-configuration.resolver';

describe('B2bRequestConfigurationResolver', () => {
  let resolver: B2bRequestConfigurationResolver;
  let b2bRequestService: jasmine.SpyObj<B2bRequestService>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;

  beforeEach(() => {

    const b2bRequestServiceSpy = jasmine.createSpyObj('B2bRequestService', ['getConfig'])
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show'])

    TestBed.configureTestingModule({
      providers: [
        { provide: B2bRequestService, useValue: b2bRequestServiceSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
      ]
    });
    resolver = TestBed.inject(B2bRequestConfigurationResolver);
    b2bRequestService = TestBed.inject(B2bRequestService) as jasmine.SpyObj<B2bRequestService>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should return IB2bRequestConfig', () => {
    b2bRequestService.getConfig.and.returnValue(mockObservable(iB2bRequestConfigMock))
    resolver.resolve().subscribe({
      next: (value) => {
        expect(value).toEqual(iB2bRequestConfigMock)
      },
      complete() {
        expect(spinner.show).toHaveBeenCalled();
      }
    })
  })

  it('should return error', () => {
    b2bRequestService.getConfig.and.returnValue(mockObservableError({
      status: 500,
      error: true
    }))
    resolver.resolve().subscribe({
      error:(err:HttpErrorResponse)=> {
          expect(err.message).toEqual('error_getting_configuration_request_b2b')
          expect(err.status).toEqual(500)
      },
      complete() {
        expect(spinner.show).toHaveBeenCalled();
      }
    })
  })

});
