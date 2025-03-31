import { TestBed } from '@angular/core/testing';

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mockObservableError } from 'src/assets/testing';
import { StatusMessageHeader500Interceptor } from './status-message-header500.interceptor';

describe('StatusMessageHeader500Interceptor', () => {
  let interceptor: StatusMessageHeader500Interceptor;
  let httpRequest: HttpRequest<any>;
  let mockHttpHandler: HttpHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StatusMessageHeader500Interceptor
      ]
    })

    interceptor = TestBed.inject(StatusMessageHeader500Interceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should return internal server error', () => {
    mockHttpHandler = {
      handle: jasmine.createSpy().and.callFake((req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        const mockResponse = new HttpErrorResponse({ error: 'test error', status: '500' as any, url: 'secure-identity/otp/sync/manual', statusText: 'test error' });
        return mockObservableError(mockResponse);
      })
    };
    httpRequest = new HttpRequest<any>('GET', 'secure-identity/otp/sync/manual');
    interceptor.intercept(httpRequest, mockHttpHandler).subscribe({
      next: (response: any) => {

        expect(mockHttpHandler.handle).toHaveBeenCalledWith(jasmine.any(HttpRequest));
      },
      error: (err: HttpErrorResponse) => {
        expect(err.error.message).toEqual('internal_server_error');
      },
    })
  })

  it('should return error', () => {
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
        expect(err.error).toEqual('test error');
      },
    })
  })

});
