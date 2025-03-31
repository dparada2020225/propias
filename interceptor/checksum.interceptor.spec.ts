import {TestBed} from '@angular/core/testing';

import {HttpEvent, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Observable} from 'rxjs';
import {mockObservable, mockObservableError} from 'src/assets/testing';
import {Base64Service} from '../service/common/base64.service';
import {UtilService} from '../service/common/util.service';
import {MenuService} from '../service/shared/menu.service';
import {ChecksumInterceptor} from './checksum.interceptor';

xdescribe('ChecksumInterceptor', () => {
  let interceptor: ChecksumInterceptor;
  let menuService: jasmine.SpyObj<MenuService>;
  let base64: jasmine.SpyObj<Base64Service>;
  let utils: jasmine.SpyObj<UtilService>;

  beforeEach(() => {
    const menuServiceSpy = jasmine.createSpyObj('MenuService', ['notifyErrorToLogin'])
    const base64Spy = jasmine.createSpyObj('Base64Service', ['decoded', 'encryption'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['valueIsIncludeInBlackList'])

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ChecksumInterceptor,
        {provide: MenuService, useValue: menuServiceSpy},
        {provide: Base64Service, useValue: base64Spy},
        {provide: UtilService, useValue: utilsSpy},
      ]
    })

    interceptor = TestBed.inject(ChecksumInterceptor);
    menuService = TestBed.inject(MenuService) as jasmine.SpyObj<MenuService>;
    base64 = TestBed.inject(Base64Service) as jasmine.SpyObj<Base64Service>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;


  });


  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should intercept the request and perform checksum verification', (done: DoneFn) => {
    const mockHttpHandler: HttpHandler = {
      handle: jasmine.createSpy().and.callFake((req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        const headers = req.headers.set('X-4226', 'value-for-X-4226').set('X-6238', 'value-for-X-6238');
        const mockResponse = new HttpResponse({body: {message: 'Mock Response'}, headers: headers});
        return mockObservable(mockResponse);
      })
    };

    utils.valueIsIncludeInBlackList.and.returnValue(false);
    base64.decoded.and.returnValue('apoeryu');
    base64.encryption.and.returnValue('value-for-X-6238')

    interceptor.intercept(new HttpRequest<any>('GET', 'oauth/token'), mockHttpHandler).subscribe({
      next: (event) => {
        expect(mockHttpHandler.handle).toHaveBeenCalledWith(jasmine.any(HttpRequest));
        expect(menuService.notifyErrorToLogin).not.toHaveBeenCalled();
        expect(event['status']).toEqual(200)
        done();
      }
    });
  });

  it('should intercept the request and perform checksum verification is failed', (done: DoneFn) => {
    const mockHttpHandler: HttpHandler = {
      handle: jasmine.createSpy().and.callFake((req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        const headers = req.headers.set('X-4226', 'value-for-X-4226').set('X-6238', 'value-for-X-6238');
        const mockResponse = new HttpResponse({body: {message: 'Mock Response'}, headers: headers});
        return mockObservable(mockResponse);
      })
    };

    utils.valueIsIncludeInBlackList.and.returnValue(false);
    base64.decoded.and.returnValue('apoeryu');
    base64.encryption.and.returnValue('not-equal-value-for-X-6238')

    interceptor.intercept(new HttpRequest<any>('GET', 'oauth/token'), mockHttpHandler).subscribe({
      next: (event) => {
        expect(mockHttpHandler.handle).toHaveBeenCalledWith(jasmine.any(HttpRequest));
        expect(menuService.notifyErrorToLogin).toHaveBeenCalledWith('Hemos detectado un problema de seguridad en tu sesión.');
        expect(event).toBeUndefined();
        done();
      },
      error: (error) => {
        expect(mockHttpHandler.handle).toHaveBeenCalledWith(jasmine.any(HttpRequest));
        expect(menuService.notifyErrorToLogin).toHaveBeenCalledWith('Hemos detectado un problema de seguridad en tu sesión.');
        expect(error).toBeDefined();
        done();
      }
    });
  });

  it('should intercept the request have error', (done: DoneFn) => {
    const mockHttpHandler: HttpHandler = {
      handle: jasmine.createSpy().and.callFake((req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        const headers = req.headers.set('X-4226', 'value-for-X-4226').set('X-6238', 'value-for-X-6238');
        const mockResponse = new HttpResponse({body: {message: 'Mock Response'}, headers: headers});
        return mockObservableError(mockResponse);
      })
    };

    interceptor.intercept(new HttpRequest<any>('GET', 'oauth/token'), mockHttpHandler).subscribe({
      error: (error) => {
        expect(mockHttpHandler.handle).toHaveBeenCalledWith(jasmine.any(HttpRequest));
        expect(error.body.message).toEqual('Mock Response')
        done();
      }
    });
  });

});
