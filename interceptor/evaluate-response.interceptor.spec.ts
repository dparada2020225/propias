import {TestBed} from '@angular/core/testing';

import {AuthenticationService} from '@adf/security';
import {HttpEvent, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {mockObservable} from 'src/assets/testing';
import {environment} from 'src/environments/environment';
import {Base64Service} from '../service/common/base64.service';
import {UtilService} from '../service/common/util.service';
import {MenuService} from '../service/shared/menu.service';
import {EvaluateResponseInterceptor} from './evaluate-response.interceptor';

xdescribe('EvaluateResponseInterceptor', () => {

  let interceptor: EvaluateResponseInterceptor;
  let base64: jasmine.SpyObj<Base64Service>;
  let authenticationService: jasmine.SpyObj<AuthenticationService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let utils: jasmine.SpyObj<UtilService>;
  let httpRequest: HttpRequest<any>;
  let mockHttpHandler: HttpHandler;

  beforeEach(() => {

    const base64Spy = jasmine.createSpyObj('Base64Service', ['decoded', 'encryption'])
    const authenticationServiceSpy = jasmine.createSpyObj('AuthenticationService', ['logout'])
    const menuServiceSpy = jasmine.createSpyObj('MenuService', ['notifyErrorToLogin'])
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant'])
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['dismissAll'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['valueIsIncludeInBlackList'])

    TestBed.configureTestingModule({
      providers: [
        EvaluateResponseInterceptor,
        { provide: Base64Service, useValue: base64Spy },
        { provide: AuthenticationService, useValue: authenticationServiceSpy },
        { provide: MenuService, useValue: menuServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: UtilService, useValue: utilsSpy },
      ]
    })

    interceptor = TestBed.inject(EvaluateResponseInterceptor);
    base64 = TestBed.inject(Base64Service) as jasmine.SpyObj<Base64Service>;
    authenticationService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;

  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should be Evaluate Response Interceptor return succesfully', (doneFn) => {
    mockHttpHandler = {
      handle: jasmine.createSpy().and.callFake((req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        const headers = req.headers.set('X-1145', 'value-for-X-1145').set('X-4226', 'value-for-X-4226');
        const mockResponse = new HttpResponse({ body: { message: 'Mock Response' }, headers: headers });
        return mockObservable(mockResponse);
      })
    };
    httpRequest = new HttpRequest<any>('DELETE', 'oauth/token')

    interceptor.validateSecurity = true;
    utils.valueIsIncludeInBlackList.and.returnValue(false);
    base64.decoded.and.returnValue('QSVGRE')

    base64.encryption.and.returnValue('value-for-X-1145')

    interceptor.intercept(httpRequest, mockHttpHandler).subscribe({
      next: (event: HttpEvent<any>) => {
        expect(mockHttpHandler.handle).toHaveBeenCalledWith(jasmine.any(HttpRequest));
        expect(event['status']).toEqual(200)
        doneFn();
      }
    })
  })

  describe('errors', () => {

    it('for validateSecurity', (doneFn) => {
      mockHttpHandler = {
        handle: jasmine.createSpy().and.callFake((req: HttpRequest<any>): Observable<HttpEvent<any>> => {
          const headers = req.headers.set('X-1145', 'value-for-X-1145').set('X-4226', 'value-for-X-4226');
          const mockResponse = new HttpResponse({ body: { message: 'Mock Response' }, headers: headers });
          return mockObservable(mockResponse);
        })
      };
      httpRequest = new HttpRequest<any>('DELETE', 'oauth/token')
      environment.validateSecurity = false;
      interceptor.validateSecurity = false;

      base64.encryption.and.returnValue('value-for-X-1145')

      interceptor.intercept(httpRequest, mockHttpHandler).subscribe({
        next: (event: HttpEvent<any>) => {
          expect(mockHttpHandler.handle).toHaveBeenCalledWith(jasmine.any(HttpRequest));
          expect(event['body']).toEqual({ message: 'Mock Response' })
          doneFn();
        }
      })
    })

    it('for headers x1145 not exist', (doneFn) => {
      mockHttpHandler = {
        handle: jasmine.createSpy().and.callFake((req: HttpRequest<any>): Observable<HttpEvent<any>> => {
          const headers = req.headers.set('X-4226', 'value-for-X-4226');
          const mockResponse = new HttpResponse({ body: { message: 'Mock Response' }, headers: headers });
          return mockObservable(mockResponse);
        })
      };
      httpRequest = new HttpRequest<any>('DELETE', 'oauth/token')
      authenticationService.logout.and.returnValue(mockObservable({ access_token: 'xsxetgh' } as any))
      utils.valueIsIncludeInBlackList.and.returnValue(false);
      interceptor.validateSecurity = true;

      interceptor.intercept(httpRequest, mockHttpHandler).subscribe({
        next: (event: any) => {
          expect(modalService.dismissAll).toHaveBeenCalled()
          expect(mockHttpHandler.handle).toHaveBeenCalledWith(jasmine.any(HttpRequest));
          doneFn();
        },
        error: (error: any) => {
          expect(error).toEqual('Hemos detectado un problema de seguridad en tu sesión.')
        }
      })
    })

  })



});
