import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { iOwnLoansPaginationMock, iTPLAccountsBodyRequestMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { OwnLoansService } from './own-loans.service';

describe('OwnLoansService', () => {
  let service: OwnLoansService;
  let httpClient: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(OwnLoansService);

    httpClient = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpClient.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get Owns Loans', (doneFn) => {
    service.getOwnsLoans(iTPLAccountsBodyRequestMock).subscribe({
      next: (value) => {
        expect(value).toEqual([iOwnLoansPaginationMock]);
        doneFn();
      },
    })

    const url: string = '/v1/thirdparties/loan-payment/pagination/own';
    const req = httpClient.expectOne(url);
    req.flush([iOwnLoansPaginationMock])
    expect(req.request.body).toEqual(iTPLAccountsBodyRequestMock);
    expect(req.request.method).toEqual('POST');
  })

});
