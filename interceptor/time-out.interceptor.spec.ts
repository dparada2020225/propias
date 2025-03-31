import { TestBed } from '@angular/core/testing';

import { HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mockObservable, mockObservableError } from 'src/assets/testing';
import { TimeoutService } from '../service/private/time-out/timeout.service';
import { TimeOutInterceptor } from './time-out.interceptor';

describe('TimeOutInterceptor', () => {

  let interceptor: TimeOutInterceptor;
  let httpRequest: HttpRequest<any>;
  let mockHttpHandler: HttpHandler;

  beforeEach(() => {

    const timeoutServiceSpy = jasmine.createSpyObj('TimeoutService', ['send'])

    TestBed.configureTestingModule({
      providers: [
        TimeOutInterceptor,
        { provide: TimeoutService, useValue: timeoutServiceSpy },
      ]
    })

    interceptor = TestBed.inject(TimeOutInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should be intercep time out', () => {
    mockHttpHandler = {
      handle: jasmine.createSpy().and.callFake((req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        const headers = req.headers.set('time-request', 'VALUE-time-request');
        const mockResponse = new HttpResponse({ body: { message: 'Mock Response' }, headers: headers });
        return mockObservable(mockResponse);
      })
    };
    httpRequest = new HttpRequest<any>('DELETE', "/service/v1/agreement/agreement/menu")
    interceptor.timeoutServiceFlag = true;
    spyOn(interceptor.blackList, 'indexOf' as never).and.returnValue(-1 as never)

    interceptor.intercept(httpRequest, mockHttpHandler).subscribe({
      next: (event: HttpEvent<any>) => {
        expect(event['status']).toEqual(200 as any)
        expect(event['body'].message).toEqual('Mock Response')
      }
    })
  })

  it('should be intercep time out but response error', (doneFn) => {
    mockHttpHandler = {
      handle: jasmine.createSpy().and.callFake((req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        const headers = req.headers.set('time-request', 'VALUE-time-request');
        const mockResponse = new HttpResponse({ body: { message: 'Mock Response' }, headers: headers });
        return mockObservableError(mockResponse);
      })
    };
    httpRequest = new HttpRequest<any>('DELETE', "/service/v1/agreement/agreement/menu")
    interceptor.timeoutServiceFlag = true;
    spyOn(interceptor.blackList, 'indexOf' as never).and.returnValue(-1 as never)

    interceptor.intercept(httpRequest, mockHttpHandler).subscribe({
      next: (event: HttpEvent<any>) => {
        expect(event['body'].message).toEqual('Mock Response')
        doneFn();
      },
      error: (error: any) => {
        expect(error['body'].message).toEqual('Mock Response')
        doneFn();
      }
    })
  })

});
