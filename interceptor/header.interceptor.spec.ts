import { TestBed } from '@angular/core/testing';

import { BankingAuthenticationService, RSACryptographyService, StorageService } from '@adf/security';
import { HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mockObservable } from 'src/assets/testing';
import { environment } from 'src/environments/environment';
import { UtilService } from '../service/common/util.service';
import { CryptographyService } from '../service/interceptors-services/cryptography.service';
import { CustomUserAgentService } from '../service/interceptors-services/custom-user-agent.service';
import { HotpService } from '../service/interceptors-services/hotp.service';
import { TokenizerAccountsService } from '../service/token/tokenizer-accounts.service';
import { HeaderInterceptor } from './header.interceptor';

describe('HeaderInterceptor', () => {

  let interceptor: HeaderInterceptor;
  let hotpService: jasmine.SpyObj<HotpService>;
  let customUserAgenteService: jasmine.SpyObj<CustomUserAgentService>;
  let rsaCryptographyService: jasmine.SpyObj<RSACryptographyService>;
  let bankingService: jasmine.SpyObj<BankingAuthenticationService>;
  let storageService: jasmine.SpyObj<StorageService>;
  let httpRequest: HttpRequest<any>;
  let mockHttpHandler: HttpHandler;

  beforeEach(() => {

    const hotpServiceSpy = jasmine.createSpyObj('HotpService', ['getHotp'])
    const customUserAgenteServiceSpy = jasmine.createSpyObj('CustomUserAgentService', ['getUserAgent'])
    const cryptographyServiceSpy = jasmine.createSpyObj('CryptographyService', [''])
    const rsaCryptographyServiceSpy = jasmine.createSpyObj('RSACryptographyService', ['addCertificate'])
    const bankingServiceSpy = jasmine.createSpyObj('BankingAuthenticationService', ['encrypt'])
    const encriptServiceSpy = jasmine.createSpyObj('TokenizerAccountsService', ['tokenizer'])
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem'])
    const utilsSpy = jasmine.createSpyObj('UtilService', [''])

    TestBed.configureTestingModule({
      providers: [
        HeaderInterceptor,
        { provide: HotpService, useValue: hotpServiceSpy },
        { provide: CustomUserAgentService, useValue: customUserAgenteServiceSpy },
        { provide: CryptographyService, useValue: cryptographyServiceSpy },
        { provide: RSACryptographyService, useValue: rsaCryptographyServiceSpy },
        { provide: BankingAuthenticationService, useValue: bankingServiceSpy },
        { provide: TokenizerAccountsService, useValue: encriptServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: UtilService, useValue: utilsSpy },
      ]
    })

    interceptor = TestBed.inject(HeaderInterceptor);
    hotpService = TestBed.inject(HotpService) as jasmine.SpyObj<HotpService>;
    customUserAgenteService = TestBed.inject(CustomUserAgentService) as jasmine.SpyObj<CustomUserAgentService>;
    rsaCryptographyService = TestBed.inject(RSACryptographyService) as jasmine.SpyObj<RSACryptographyService>;
    bankingService = TestBed.inject(BankingAuthenticationService) as jasmine.SpyObj<BankingAuthenticationService>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should be Header Interceptor return succesfully', (doneFn) => {
    mockHttpHandler = {
      handle: jasmine.createSpy().and.callFake((req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        const headers = req.headers.set('X-User-Agent', 'value-for-X-User-Agent')
          .set('X-6238', 'value-for-X-6238')
          .set('X-1010', 'value-for-X-1010')
          .set('X-ENCRYPT-ENABLED', 'value-for-X-ENCRYPT-ENABLED')
        const mockResponse = new HttpResponse({ body: { message: 'Mock Response' }, headers: headers });
        return mockObservable(mockResponse);
      })
    };
    httpRequest = new HttpRequest<any>('DELETE', 'oauth/token')

    environment.hotp = true;
    bankingService.encrypt.and.returnValue('asorpm')
    storageService.getItem.and.returnValue(JSON.stringify({ ne: 'asorpm' }))

    interceptor.intercept(httpRequest, mockHttpHandler).subscribe({
      next: (event: HttpEvent<any>) => {
        expect(mockHttpHandler.handle).toHaveBeenCalledWith(jasmine.any(HttpRequest));
        expect(event['status']).toEqual(200)
        doneFn();
      },
      complete() {
        expect(hotpService.getHotp).toHaveBeenCalled();
        expect(customUserAgenteService.getUserAgent).toHaveBeenCalled();
        expect(rsaCryptographyService.addCertificate).toHaveBeenCalled();
      },
    })
  })


});
