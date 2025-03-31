import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { iPaymentAccountDetailMock, iPaymentAccountMock, iPaymentExecutionDescriptionMock, iPaymentExecutionMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { B2bPaymentService } from './b2b-payment.service';

describe('B2bPaymentService', () => {
  let service: B2bPaymentService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(B2bPaymentService);
    httpController = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
    httpController.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should execute Payment', () => {
    service.executePayment(iPaymentExecutionMock).subscribe({
      next: (response) => {
        expect(response).toEqual(iPaymentExecutionDescriptionMock)
      }
    })

    const url: string = '/v1/back-to-back/execute/payment';
    const req = httpController.expectOne(url);
    req.flush(iPaymentExecutionDescriptionMock);
    expect(req.request.body).toEqual(iPaymentExecutionMock)
    expect(req.request.method).toEqual('POST')
  })

  it('should get B2b List', () => {

    service.getB2bList().subscribe({
      next: (response) => {
        expect(response).toEqual([iPaymentAccountMock])
      }
    })

    const url: string = '/v1/back-to-back';
    const req = httpController.expectOne(url);
    req.flush([iPaymentAccountMock]);
    expect(req.request.method).toEqual('GET')

  })

  it('should get B2b Account Detail', () => {
    service.getB2bAccountDetail('asda', 55).subscribe({
      next: (response) => {
        expect(response).toEqual(iPaymentAccountDetailMock)
      }
    })

    const url: string = `/v1/back-to-back/payment/loan?b2bID=asda&b2b-amount=55`;
    const req = httpController.expectOne(url);
    req.flush(iPaymentAccountDetailMock);
    expect(req.request.method).toEqual('GET')
  })
});
