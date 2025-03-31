import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable, tap, throwError } from 'rxjs';
import * as forge from 'node-forge';
import { environment } from '../../environments/environment';
import { filter, map } from 'rxjs/operators';
import { AuthenticationService } from '@adf/security';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuService } from '../service/shared/menu.service';
import { Base64Service } from '../service/common/base64.service';
import { UtilService } from '../service/common/util.service';

/**
 * @author Raúl Méndez
 * @date 28/09/21
 *
 * provides a way to add headers without needing
 * to modify the service
 */
@Injectable()
export class EvaluateResponseInterceptor implements HttpInterceptor {
  blacklist = environment.blackList1145;
  validateSecurity = environment.validateSecurity;

  constructor(
    private base64: Base64Service,
    private authenticationService: AuthenticationService,
    private menuService: MenuService,
    private translateService: TranslateService,
    private modalService: NgbModal,
    private utils: UtilService,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      filter((event: any) => event instanceof HttpResponse),
      map((event: HttpResponse<any>) => {
          const isInBlacklist = this.utils.valueIsIncludeInBlackList(this.blacklist, req.url);

          if (event.status === 200 && !isInBlacklist) {
            const x1145 = event.headers.get('X-1145');
            const x4226 = event.headers.get('X-4226');
            const x4226Web = req.headers.get('X-4226');

            if (!this.validateSecurity) {
              return event;
            }

            if (!x1145) {
              this.doLogout();
              return throwError(() => 'Hemos detectado un problema de seguridad en tu sesión.');
            }

            const dateTimeBackend = this.base64.decoded(x4226 as string).toString();
            const dateTimeWeb = this.base64.decoded(x4226Web as string).toString();
            const validateURL = req.url.substring(this.validateUrl(req.url), req.url.length);
            const concatValue = `${validateURL}${req.method}${dateTimeWeb}${dateTimeBackend}${event.status}`;
            const contactValue64 = this.base64.encryption(concatValue);

            try {
              const md5 = forge.md.md5.create();
              md5.update(contactValue64);
              const responseHttp = md5.digest().toHex();

              const web1145 = this.base64.encryption(String.fromCharCode(...new Uint16Array(this.hexToBytes(responseHttp))));

              if (web1145.trim() !== x1145.trim()) {
                console.log('1145 logout', req, event);
                this.doLogout();
                return throwError(() => 'Hemos detectado un problema de seguridad en tu sesión.');
              }
            } catch (e) {
              this.doLogout();
              return throwError(() => 'Hemos detectado un problema de seguridad en tu sesión.');
            }
          }
          // only parse xml response, pass all other responses to other interceptors
          return event;
        }),
      tap({
        error: (error: HttpErrorResponse) => {
          // Operation failed; error is an HttpErrorResponse
          console.error(error);
        }
      })
    ) as Observable<HttpEvent<any>>;
  }

  validateUrl(url: string) {
    const v1Url = url.indexOf('/v1');
    const v3Url = url.indexOf('/v3');

    return v1Url < 0 ? v3Url : v1Url;
  }

  hexToBytes(hex: string) {
    let bytes = [];
    for (let c = 0; c < hex.length; c += 2) {
      bytes.push(parseInt(this.substr(hex, c), 16) as never);
    }
    return bytes;
  }

  substr(value: string, idx: number) {
    const INITIAL_VALUE = 2;

    return value.substring(idx, (idx + INITIAL_VALUE));
  }



  doLogout() {
    this.modalService.dismissAll();
    const logoutObservable = this.authenticationService.logout();

    lastValueFrom(logoutObservable).finally(() => {
      this.menuService.notifyErrorToLogin(this.translateService.instant('Hemos detectado un problema de seguridad en tu sesión.'))
    });
  }
}
