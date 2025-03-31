import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpStatusCode } from '../enums/http-status-code.enum';

/**
 * @author Fabian Serrano
 * @date 12/09/22
 */
@Injectable()
export class StatusMessageHeader500Interceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        if (!error?.status || !error?.error) {
          return throwError(() => ({
            code: HttpStatusCode.INTERNAL_SERVER_ERROR,
            statusText: error.statusText,
            url: error.url,
            message: 'fatal_error_encryption_504',
          }));
        }

        if (error.status == HttpStatusCode.INTERNAL_SERVER_ERROR || error.status == HttpStatusCode.TIME_OUT) {
          const defaultMessage = {
            code: HttpStatusCode.INTERNAL_SERVER_ERROR,
            statusText: error.statusText,
            url: error.url,
            message: 'internal_server_error',
          };

          const errorResponce = {
            error: defaultMessage,
          };
          return throwError(() => errorResponce);
        } else {
          return throwError(() => error);
        }
      })
    );
  }
}
