import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SecureIndentityService } from './secure-indentity.service';

describe('SecureIndentityService', () => {
  let service: SecureIndentityService;
  let http: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(SecureIndentityService);
    http = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
    http.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get manual Sync', (doneFn) => {
    const dto = { vclock1: 1, vclock2: 2 };
    const mock = '200'

    service.manualSync(dto.vclock1, dto.vclock2).subscribe({
      next(value) {
        expect(value).toEqual(mock);
        doneFn();
      },
    })

    const url: string = '/v1/facephi/secure-identity/otp/sync/manual';
    const req = http.expectOne(url);
    req.flush(mock)
    expect(req.request.body).toEqual(dto)
    expect(req.request.method).toEqual('POST')
  })

  it('should get get Auto Sync', () => {

    const dto: number = 8;
    const mock = 'success';

    service.getAutoSync(dto).subscribe({
      next:(value) => {
          expect(value.body).toEqual(mock);
          expect(value.status).toEqual(200);
      },
    })

    const url: string = '/v1/facephi/secure-identity/otp/sync/auto';
    const req = http.expectOne(url);
    req.flush(mock);
    expect(req.request.body).toEqual({ otp: dto });
    expect(req.request.method).toEqual('POST')
  })

});
