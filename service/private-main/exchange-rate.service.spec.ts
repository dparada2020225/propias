import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExchangeRateService } from './exchange-rate.service';

describe('ExchangeRateService', () => {
  let service: ExchangeRateService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(ExchangeRateService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get Exchange Rate', () => {
    const dataMock = { response: 200 }

    service.getExchangeRate().subscribe((data) => {
      expect(data).toEqual(dataMock)
    })

    const url = '/v1/exchanges/rates';
    const req = httpController.expectOne(url)
    req.flush(dataMock);
    expect(req.request.method).toEqual('GET');
  })

});
