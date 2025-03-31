import { TestBed } from '@angular/core/testing';

import { StorageService } from '@adf/security';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EProfile } from 'src/app/enums/profile.enum';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;
  let httpController: HttpTestingController;
  let storageService: jasmine.SpyObj<StorageService>;

  beforeEach(() => {

    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem'])

    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageServiceSpy },
      ],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(TokenService);
    httpController = TestBed.inject(HttpTestingController);
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit value when notifyErrorToLogin is called', (done) => {
    const testMessage = 'test message';
    service.errorLoggingEvent.subscribe(message => {
      expect(message).toBe(testMessage);
      done();
    });
    service.notifyErrorToLogin(testMessage);
  });

  it('should get Token Typenc', (doneFn) => {
    const dataMock = 'response';

    service.getTokenTypenc().subscribe({
      next: (value) => {
        expect(value.body).toEqual(dataMock);
        expect(value.status).toEqual(200);
        doneFn();
      },
    })

    const url = '/v1/tokens/types';
    const req = httpController.expectOne(url)
    req.flush(dataMock);
    expect(req.request.method).toEqual('GET')
  })

  it('should get Token Validate', () => {
    environment.encryptionEnabled = false;
    const dto: string = 'ASF#34';
    const mock = '200';

    service.getTokenValidate(dto).subscribe({
      next: (value) => {
        expect(value).toEqual(mock);
      },
    })

    const url = `/v1/tokens/validate`;
    const req = httpController.expectOne(url);
    req.flush(mock);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(dto)
  })

  it('should get Token Validate encryptionEnabled = true', () => {
    environment.encryptionEnabled = true;
    const dto: string = 'ASF#34';
    const mock = '200';

    service.getTokenValidate(dto).subscribe({
      next: (value) => {
        expect(value).toEqual(mock);
      },
    })

    const url = `/v1/tokens/validate-token`;
    const req = httpController.expectOne(url);
    req.flush(mock);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ token: dto })
  })

  it('should token Generate = EProfile.PANAMA', (doneFn) => {
    environment.profile = EProfile.PANAMA;
    storageService.getItem.and.returnValue('Test');
    const dto = { typeTransaction: 'Transaction', user: 'VCONTRERAS2' };
    const dataMock = 'Succesfully';

    service.tokenGenerate(dto.typeTransaction, dto.user).subscribe({
      next: (value) => {
        expect(value).toEqual(dataMock);
        doneFn();
      },
    })

    const url = `/v1/exposed/tokens/generate-token`;
    const req = httpController.expectOne(url);
    req.flush(dataMock);
    expect(req.request.method).toEqual('POST')
    expect(req.request.body).toEqual({
      transaction: dto.typeTransaction,
      username: dto.user
    })

  })

  it('should token Generate = EProfile.HONDURAS', (doneFn) => {
    environment.profile = EProfile.HONDURAS;
    storageService.getItem.and.returnValue('Test');
    const dto = { typeTransaction: 'Transaction', user: 'VCONTRERAS2' };
    const dataMock = 'Succesfully';

    service.tokenGenerate(dto.typeTransaction, dto.user).subscribe({
      next: (value) => {
        expect(value).toEqual(dataMock);
        doneFn();
      },
    })

    const url = `/v1/tokens/generate-token`;
    const req = httpController.expectOne(url);
    req.flush(dataMock);
    expect(req.request.method).toEqual('POST')
    expect(req.request.body).toEqual({
      transaction: dto.typeTransaction
    })

  })

});
