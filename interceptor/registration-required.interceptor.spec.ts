import {TestBed} from '@angular/core/testing';

import {HttpEvent, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {mockObservable} from 'src/assets/testing';
import {Base64Service} from '../service/common/base64.service';
import {UtilService} from '../service/common/util.service';
import {TokenService} from '../service/private/token/token.service';
import {RegistrationRequiredInterceptor} from './registration-required.interceptor';

xdescribe('RegistrationRequiredInterceptor', () => {

  let interceptor: RegistrationRequiredInterceptor;
  let base64: jasmine.SpyObj<Base64Service>;
  let utils: jasmine.SpyObj<UtilService>;
  let httpRequest: HttpRequest<any>;
  let mockHttpHandler: HttpHandler;

  beforeEach(() => {

    const base64Spy = jasmine.createSpyObj('Base64Service', ['decoded', 'encryption'])
    const tokenServiceSpy = jasmine.createSpyObj('TokenService', ['notifyErrorToLogin'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['valueIsIncludeInBlackList'])

    TestBed.configureTestingModule({
      providers: [
        RegistrationRequiredInterceptor,
        {provide: Base64Service, useValue: base64Spy},
        {provide: TokenService, useValue: tokenServiceSpy},
        {provide: UtilService, useValue: utilsSpy},
      ]
    })

    interceptor = TestBed.inject(RegistrationRequiredInterceptor);
    base64 = TestBed.inject(Base64Service) as jasmine.SpyObj<Base64Service>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;


  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should Registration Required Interceptor response succesfully', () => {

    mockHttpHandler = {
      handle: jasmine.createSpy().and.callFake((req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        const headers = req.headers.set('X-User-Agent', 'value-for-X-User-Agent')
          .set('X-4226', 'value-for-X-4226')
          .set('X-6239', 'value-for-X-6239')
        const mockResponse = new HttpResponse({body: {message: 'Mock Response'}, headers: headers});
        return mockObservable(mockResponse);
      })
    };
    httpRequest = new HttpRequest<any>('DELETE', 'check-profile')

    utils.valueIsIncludeInBlackList.and.returnValue(false);
    interceptor.validateSecurity = true;
    base64.decoded.and.returnValue('ljñkf')
    base64.encryption.and.returnValue('value-for-X-6239')

    interceptor.intercept(httpRequest, mockHttpHandler).subscribe({
      next: (response: HttpEvent<any>) => {
        expect(response['statusText']).toEqual('OK');
      }
    })

  })


});
