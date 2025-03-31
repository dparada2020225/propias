import { TestBed } from '@angular/core/testing';

import { HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mockObservable } from 'src/assets/testing';
import { environment } from 'src/environments/environment';
import { ProxyInterceptor } from './proxy.interceptor';

describe('ProxyInterceptor', () => {

  let interceptor: ProxyInterceptor;
  let httpRequest: HttpRequest<any>;
  let mockHttpHandler: HttpHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProxyInterceptor
      ]
    })

    interceptor = TestBed.inject(ProxyInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should Intercep Proxy', () => {

    mockHttpHandler = {
      handle: jasmine.createSpy().and.callFake((req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        const mockResponse = new HttpResponse({ body: { message: 'Mock Response' }});
        return mockObservable(mockResponse);
      })
    };
    httpRequest = new HttpRequest<any>('DELETE', 'v1/token')

    environment.proxy = true;

    interceptor.intercept(httpRequest, mockHttpHandler).subscribe({
      next: (event: HttpEvent<any>) => {

        expect(event['status']).toEqual(200)

      }
    })
    
  })

});
