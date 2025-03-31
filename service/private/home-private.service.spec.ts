import {TestBed} from '@angular/core/testing';

import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from 'src/environments/environment';
import {HomePrivateService} from './home-private.service';

describe('HomePrivateService', () => {
  let service: HomePrivateService;
  let httpController: HttpTestingController;
  let dataMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(HomePrivateService);
    httpController = TestBed.inject(HttpTestingController);
    dataMock = {statusCode: 200, statusMessage: 'Success', value: 'S'};
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get Load Accounts Parameter', () => {

    service.getLoadAccountsParameter().subscribe((data) => {
      expect(data).toBeTruthy();
    })

    const url = `/v1/agreement/agreement/global-variable/${environment.coreVariable}`
    const req = httpController.expectOne(url);
    req.flush(dataMock);
    expect(req.request.method).toEqual('GET');
  })

  it('should get Available Products', () => {
    service.getAvailableProducts().subscribe((data) => {
      expect(data).toEqual(dataMock)
    })

    const url = '/v1/inquiries/account-product/all';
    const req = httpController.expectOne(url);
    req.flush(dataMock);

    expect(req.request.method).toEqual('GET');
  })

  it('should get Accounts By Product', () => {
    const dto = {productType: '1', subProductType: '2', currency: 'USD'}

    service.getAccountsByProduct(dto.productType, dto.subProductType, dto.currency).subscribe((data) => {
      expect(data).toEqual(dataMock)
    })

    const url = '/v1/inquiries/account-product/detail';
    const req = httpController.expectOne(url);
    req.flush(dataMock)
    expect(req.request.method).toEqual('POST')
    expect(req.request.body).toEqual(dto)
  })

});
