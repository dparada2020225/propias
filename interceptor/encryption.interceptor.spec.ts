import {TestBed} from '@angular/core/testing';

import {RSACryptographyService, StorageService} from '@adf/security';
import {HttpEvent, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {mockObservable, mockObservableError} from 'src/assets/testing';
import {Base64Service} from '../service/common/base64.service';
import {ParseUtf8Service} from '../service/common/parse-utf8.service';
import {CryptographyService} from '../service/interceptors-services/cryptography.service';
import {EncryptionInterceptor} from './encryption.interceptor';
import {LocalStorageServiceMock} from "../../assets/mocks/public/mockLocalStorageServiceMock";

describe('EncryptionInterceptor', () => {

  let interceptor: EncryptionInterceptor;
  let cryptographyService: jasmine.SpyObj<CryptographyService>;
  let parseUtf8: jasmine.SpyObj<ParseUtf8Service>;
  let httpRequest: HttpRequest<any>;
  let mockHttpHandler: HttpHandler;

  beforeEach(() => {

    const cryptographyServiceSpy = jasmine.createSpyObj('CryptographyService', ['encrypt', 'decrypt'])
    const rsaCryptographyServiceSpy = jasmine.createSpyObj('RSACryptographyService', ['addCertificate'])
    const parseUtf8Spy = jasmine.createSpyObj('ParseUtf8Service', ['conversion'])
    const base64Spy = jasmine.createSpyObj('Base64Service', ['decoded'])

    TestBed.configureTestingModule({
      providers: [
        EncryptionInterceptor,
        LocalStorageServiceMock,
        { provide: CryptographyService, useValue: cryptographyServiceSpy },
        { provide: StorageService, useClass: LocalStorageServiceMock },
        { provide: RSACryptographyService, useValue: rsaCryptographyServiceSpy },
        { provide: ParseUtf8Service, useValue: parseUtf8Spy },
        { provide: Base64Service, useValue: base64Spy },
      ]
    })

    interceptor = TestBed.inject(EncryptionInterceptor);
    cryptographyService = TestBed.inject(CryptographyService) as jasmine.SpyObj<CryptographyService>;
    parseUtf8 = TestBed.inject(ParseUtf8Service) as jasmine.SpyObj<ParseUtf8Service>;
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should Encryption Interceptor request and perform checksum verification', (doneFn) => {
    mockHttpHandler = {
      handle: jasmine.createSpy().and.callFake((req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        const headers = req.headers.set('Accept', "*/*").set('Content-Type', 'application/bi+crypt');
        const mockResponse = new HttpResponse({ body: { message: 'Mock Response' }, headers: headers });
        return mockObservable(mockResponse);
      })
    };
    httpRequest = new HttpRequest<any>('DELETE', 'oauth/token')

    cryptographyService.decrypt.and.returnValue('ASDGHTR')
    parseUtf8.conversion.and.returnValue(JSON.stringify('ASDGHTR'))

    interceptor.encryptServices = true;
    interceptor.encryptionTest = true;

    interceptor.intercept(httpRequest, mockHttpHandler).subscribe({
      next: (response: HttpEvent<any>) => {
        expect(mockHttpHandler.handle).toHaveBeenCalledWith(jasmine.any(HttpRequest));
        expect(response['body']).toEqual('ASDGHTR')
        doneFn();
      }
    })

  })

  it('should Encryption Interceptor request but encryptServices = false', (doneFn) => {
    mockHttpHandler = {
      handle: jasmine.createSpy().and.callFake((req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        const headers = req.headers.set('Accept', "*/*").set('Content-Type', 'application/bi+crypt');
        const mockResponse = new HttpResponse({ body: { message: 'Mock Response' }, headers: headers });
        return mockObservable(mockResponse);
      })
    };
    httpRequest = new HttpRequest<any>('GET', "/v1/oauth/token/now")
    interceptor.encryptServices = false;
    interceptor.intercept(httpRequest, mockHttpHandler).subscribe({
      next: (response: HttpEvent<any>) => {
        expect(mockHttpHandler.handle).toHaveBeenCalledWith(jasmine.any(HttpRequest));
        expect(response['body']).toEqual({ message: 'Mock Response' })
        doneFn();
      }
    })

  })

  it('should Encryption Interceptor request but encryptServices = false and retur error', (doneFn) => {
    mockHttpHandler = {
      handle: jasmine.createSpy().and.callFake((req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        const headers = req.headers.set('Accept', "*/*").set('Content-Type', 'application/bi+crypt');
        const mockResponse = new HttpResponse({ body: { message: 'Mock Response' }, headers: headers });
        return mockObservableError(mockResponse);
      })
    };
    httpRequest = new HttpRequest<any>('GET', "/v1/oauth/token/now")
    interceptor.encryptServices = false;
    interceptor.intercept(httpRequest, mockHttpHandler).subscribe({
      next: (response: HttpEvent<any>) => {
        expect(response['body']).toEqual({ message: 'Mock Response' })
        doneFn();
      },
      error: (err) => {
        expect(mockHttpHandler.handle).toHaveBeenCalledWith(jasmine.any(HttpRequest));
        expect(err['body']).toEqual({ message: 'Mock Response' })
        doneFn();

      },
    })

  })

  it('should Encryption Interceptor request but url is In Blacklist ', (doneFn) => {
    mockHttpHandler = {
      handle: jasmine.createSpy().and.callFake((req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        const headers = req.headers.set('Accept', "*/*").set('Content-Type', 'application/bi+crypt');
        const mockResponse = new HttpResponse({ body: { message: 'Mock Response' }, headers: headers });
        return mockObservable(mockResponse);
      })
    };
    httpRequest = new HttpRequest<any>('GET', ("/sendemail"))
    interceptor.encryptServices = false;
    interceptor.intercept(httpRequest, mockHttpHandler).subscribe({
      next: (response: HttpEvent<any>) => {
        expect(mockHttpHandler.handle).toHaveBeenCalledWith(jasmine.any(HttpRequest));
        expect(response['body']).toEqual({ message: 'Mock Response' })
        doneFn();
      }
    })

  })

});
