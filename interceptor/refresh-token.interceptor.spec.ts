import { TestBed } from '@angular/core/testing';

import { AuthenticationService, StorageService } from '@adf/security';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { mockObservableError } from 'src/assets/testing';
import { HotpService } from '../service/interceptors-services/hotp.service';
import { MenuService } from '../service/shared/menu.service';
import { RefreshTokenInterceptor } from './refresh-token.interceptor';

describe('RefreshTokenInterceptor', () => {

  let interceptor: RefreshTokenInterceptor;
  let storage: jasmine.SpyObj<StorageService>;
  let authenticationService: jasmine.SpyObj<AuthenticationService>;
  let hotpService: jasmine.SpyObj<HotpService>;
  let translateService: jasmine.SpyObj<TranslateService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let httpRequest: HttpRequest<any>;
  let mockHttpHandler: HttpHandler;

  beforeEach(() => {

    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem'])
    const authenticationServiceSpy = jasmine.createSpyObj('AuthenticationService', ['logout'])
    const menuServiceSpy = jasmine.createSpyObj('MenuService', ['notifyErrorToLogin'])
    const hotpServiceSpy = jasmine.createSpyObj('HotpService', ['getHotp'])
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant'])
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['dismissAll'])

    TestBed.configureTestingModule({
      providers: [
        RefreshTokenInterceptor,
        { provide: StorageService, useValue: storageSpy },
        { provide: AuthenticationService, useValue: authenticationServiceSpy },
        { provide: MenuService, useValue: menuServiceSpy },
        { provide: HotpService, useValue: hotpServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
      ]
    })

    interceptor = TestBed.inject(RefreshTokenInterceptor);
    storage = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    authenticationService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    hotpService = TestBed.inject(HotpService) as jasmine.SpyObj<HotpService>;
    translateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;

  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should Refresh Token Interceptor return error', () => {

    mockHttpHandler = {
      handle: jasmine.createSpy().and.callFake((req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        const mockResponse = new HttpErrorResponse({ error: 'test error', status: 401, url: 'secure-identity/otp/sync/manual', statusText: 'test error' });
        return mockObservableError(mockResponse);
      })
    };
    httpRequest = new HttpRequest<any>('GET', 'secure-identity/otp/sync/manual');

    interceptor.intercept(httpRequest, mockHttpHandler).subscribe({
      next: (response: any) => {
        expect(mockHttpHandler.handle).toHaveBeenCalledWith(jasmine.any(HttpRequest));
      },
      error: (err: HttpErrorResponse) => {
        expect(err.url).toEqual('secure-identity/otp/sync/manual');
        expect(err.status).toEqual(401)
      },
    })

  })

  it('should Refresh Token Interceptor return error when url.includes tokens && error.status !== 401', () => {

    mockHttpHandler = {
      handle: jasmine.createSpy().and.callFake((req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        const mockResponse = new HttpErrorResponse({
          error: 'test error',
          status: 404,
          url: 'tokens',
          statusText: 'test error'
        });
        return mockObservableError(mockResponse);
      })
    };
    httpRequest = new HttpRequest<any>('GET', 'tokens');

    interceptor.intercept(httpRequest, mockHttpHandler).subscribe({
      next: (response: any) => {
        expect(mockHttpHandler.handle).toHaveBeenCalledWith(jasmine.any(HttpRequest));
      },
      error: (err: HttpErrorResponse) => {
        expect(err.url).toEqual('tokens');
        expect(err.status).toEqual(404)
      },
    })

  })

  it('should Refresh Token Interceptor return error when url.includes token', () => {
    mockHttpHandler = {
      handle: jasmine.createSpy().and.callFake((req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        const mockResponse = new HttpErrorResponse({
          error: 'test error',
          status: 401,
          url: 'token',
          statusText: 'test error'
        });
        return mockObservableError(mockResponse);
      })
    };
    httpRequest = new HttpRequest<any>('GET', 'token');

    interceptor.intercept(httpRequest, mockHttpHandler).subscribe({
      next: (response: any) => {
        expect(mockHttpHandler.handle).toHaveBeenCalledWith(jasmine.any(HttpRequest));
      },
      error: (err: HttpErrorResponse) => {
        expect(err.url).toEqual('token');
        expect(err.status).toEqual(401)
      },
      complete() {
        expect(modalService.dismissAll).toHaveBeenCalled();
        expect(authenticationService.logout).toHaveBeenCalled();
        expect(translateService.instant).toHaveBeenCalledWith('expired_session')
      }
    })
  })

  it('should Refresh Token Interceptor return error when url.includes token and error.error.code', () => {
    mockHttpHandler = {
      handle: jasmine.createSpy().and.callFake((req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        const mockResponse = new HttpErrorResponse({
          error: {
            code: 401,
          },
          status: 401,
          url: 'token',
          statusText: 'test error'
        });
        return mockObservableError(mockResponse);
      })
    };
    httpRequest = new HttpRequest<any>('GET', 'token');

    interceptor.intercept(httpRequest, mockHttpHandler).subscribe({
      next: (response: any) => {
        expect(mockHttpHandler.handle).toHaveBeenCalledWith(jasmine.any(HttpRequest));
      },
      error: (err: HttpErrorResponse) => {
        expect(err.url).toEqual('token');
        expect(err.status).toEqual(401)
      }
    })
  })

  it('should Refresh Token Interceptor return error when not include url and (error.status !== 401', () => {
    mockHttpHandler = {
      handle: jasmine.createSpy().and.callFake((req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        const mockResponse = new HttpErrorResponse({
          error: {
            code: 401,
          },
          status: 401,
          url: 'transfer',
          statusText: 'test error'
        });
        return mockObservableError(mockResponse);
      })
    };
    httpRequest = new HttpRequest<any>('GET', 'transfer');

    interceptor.intercept(httpRequest, mockHttpHandler).subscribe({
      next: (response: any) => {
        expect(mockHttpHandler.handle).toHaveBeenCalledWith(jasmine.any(HttpRequest));
      },
      error: (err: HttpErrorResponse) => {
      },
      complete() {
        expect(modalService.dismissAll).toHaveBeenCalled();
        expect(authenticationService.logout).toHaveBeenCalled();
        expect(translateService.instant).toHaveBeenCalledWith('expired_session')
      }
    })
  })

  it('should add Authentication Token', () => {
    const requestMock = jasmine.createSpyObj('Request', ['clone']);
    hotpService.getHotp.and.returnValue('test')
    storage.getItem.and.returnValue(JSON.stringify({ access_token: 'ASDJDSO' }))
    interceptor.addAuthenticationToken(requestMock)
    expect(storage.getItem).toHaveBeenCalled();
    expect(hotpService.getHotp).toHaveBeenCalled();
  })

});
