import { AuthenticationService, StorageService } from '@adf/security';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, lastValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HotpService } from '../service/interceptors-services/hotp.service';
import { MenuService } from '../service/shared/menu.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  // Refresh Token Subject tracks the current token, or is null if no token is currently
  // available (e.g. refresh pending).
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private storage: StorageService,
    private authenticationService: AuthenticationService,
    private menuService: MenuService,
    private hotpService: HotpService,
    public translateService: TranslateService,
    private modalService: NgbModal
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // We don't want to refresh token for some requests like login or refresh token itself
          // So we verify url and we throw an error if it's the case
          if (
            request.url.includes('token') ||
            request.url.includes('login') ||
            request.url.includes('secure-identity/otp/sync/auto') ||
            request.url.includes('secure-identity/otp/sync/manual')
          ) {
            // We do another check to see if refresh token failed
            // In this case we want to logout user and to redirect it to login page

            if (request.url.includes('tokens') && error.status !== 401) {
              return throwError(() => error);
            }

            if (request.url.includes('token') && !request.url.includes('soft-token') && !request.url.includes('/agreement/token-service')) {
              if (error.error && error.error.code) {
                return throwError(() => error);
              }
              this.doLogout(request.url);
            }

            return throwError(() => error);
          }

          // If error status is different than 401 we want to skip refresh token
          // So we check that and throw the error if it's the case
          if (error.status !== 401) {
            return throwError(() => error);
          }

          this.doLogout(request.url);
        })
     );
  }

  doLogout(url: string): never {
    this.modalService.dismissAll();
    const authenticationService = this.authenticationService.logout();
    lastValueFrom(authenticationService).finally(() => {
      this.menuService.notifyErrorToLogin(this.translateService.instant('expired_session'));
    });

    return throwError(() => 'Error interno') as never;
  }

  addAuthenticationToken(request) {
    // Get access token from Local Storage
    const accessToken = this.storage.getItem('currentToken');
    const jwt = JSON.parse(accessToken)['access_token'];
    const hotp = this.hotpService.getHotp();

    // If access token is null this means that user is not logged in
    // And we return the original request
    if (!jwt) {
      return request;
    }

    // We clone the request, because the original request is immutable
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${jwt}`,
        'X-4226': hotp,
      },
    });
  }
}
