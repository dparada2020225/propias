import { TestBed } from '@angular/core/testing';

import { NgxSpinnerService } from 'ngx-spinner';
import { iFixedDeadlinesMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { mockObservable, mockObservableError } from 'src/assets/testing';
import { B2bRequestService } from '../service/transaction/b2b-request.service';
import { B2bRequestFixedDeadlinesResolver } from './b2b-request-fixed-deadlines.resolver';

describe('B2bRequestFixedDeadlinesResolver', () => {
  let resolver: B2bRequestFixedDeadlinesResolver;
  let b2bRequestService: jasmine.SpyObj<B2bRequestService>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;

  beforeEach(() => {
    const b2bRequestServiceSpy = jasmine.createSpyObj('B2bRequestService', ['getAll'])
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show'])

    TestBed.configureTestingModule({
      providers: [
        { provide: B2bRequestService, useValue: b2bRequestServiceSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
      ]
    });
    resolver = TestBed.inject(B2bRequestFixedDeadlinesResolver);
    b2bRequestService = TestBed.inject(B2bRequestService) as jasmine.SpyObj<B2bRequestService>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should return IFixedDeadlines', () => {
    b2bRequestService.getAll.and.returnValue(mockObservable([iFixedDeadlinesMock]))
    resolver.resolve().subscribe({
      next: (value) => {
        expect(value).toEqual([iFixedDeadlinesMock])
      },
      complete() {
        expect(spinner.show).toHaveBeenCalled();
      },
    })
  })

  it('should return error', () => {

    b2bRequestService.getAll.and.returnValue(mockObservableError({
      status: 404,
      error: 'Not Found'
    }))
    resolver.resolve().subscribe({
      error(err) {
        expect(err.status).toEqual(404)
        expect(err.error).toEqual('Not Found')
        expect(err.message).toEqual('error_get_list_fix_term')
      },
      complete() {
        expect(spinner.show).toHaveBeenCalled();
      },
    })

  })

});
