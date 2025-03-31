import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CheckProfileService } from './check-profile.service';

describe('CheckProfileService', () => {
  let service: CheckProfileService;
  let httpClient: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(CheckProfileService);
    httpClient = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpClient.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should notify Error To Login', () => {
    spyOn(service.errorLoggingEvent, 'emit');
    service.notifyErrorToLogin('error');
    expect(service.errorLoggingEvent.emit).toHaveBeenCalledWith('error');
  })

  it('should get Profile', () => {
    const dto: string = 'costumer'
    const dataMock: any = { success: 'ok', status: 200 }

    service.getProfile(dto).subscribe({
      next: (value) => {
        expect(value.body).toEqual(dataMock)
      },
    })

    const url: string = '/v1/sec-profile/new-security-profile/check-profile?customer=costumer';
    const req = httpClient.expectOne(url)
    req.flush(dataMock);
    expect(req.request.method).toEqual('GET')
  })

  it('should post pone Register Profile', () => {
    const dto = 'data';
    const dataMock = 'response';

    service.postponeRegisterProfile(dto).subscribe({
      next: (value) => {
        expect(value).toEqual(dataMock)
      },
    })

    const url = '/v1/sec-profile/new-security-profile/postpone-profile';
    const req = httpClient.expectOne(url)
    req.flush(dataMock)
    expect(req.request.body).toEqual(dto);
    expect(req.request.method).toEqual('POST')
  })

  it('should validate User', () => {
    const dataMock = 'response';

    service.validateUser().subscribe({
      next: (value) => {
        expect(value).toEqual(dataMock)
      },
    })

    const url = '/v1/sec-profile/new-security-profile/validate-user';
    const req = httpClient.expectOne(url)
    req.flush(dataMock)
    expect(req.request.method).toEqual('GET')
  })

});
