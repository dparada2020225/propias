import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as forge from 'node-forge';
import { Observable, tap } from 'rxjs';

import { filter, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Base64Service } from '../service/common/base64.service';
import { TokenService } from '../service/private/token/token.service';
import { UtilService } from '../service/common/util.service';
import { ISettingData } from '../models/setting-interface';
import { StorageService } from '@adf/security';


/**
 * @author Raúl Méndez
 * @date 01/12/21
 *
 * provides a way to add headers without needing
 * to modify the service
 */
@Injectable()
export class RegistrationRequiredInterceptor implements HttpInterceptor {
  blacklist = environment.blacklist;
  validateSecurity = environment.validateSecurity;

  constructor(
    private base64: Base64Service,
    private tokenService: TokenService,
    private utils: UtilService,
    private storageService: StorageService
    ) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      filter((event: any) => event instanceof HttpResponse),
      map((event: HttpResponse<any>) => {
          const fromHeaders = req.headers;
          const settings: ISettingData = JSON.parse(this.storageService.getItem('securityParameters'));
          if (settings.regionalConnectionPriv) {
            this.blacklist.push(settings.regionalConnectionPriv)
          }
          const isInBlacklist = this.utils.valueIsIncludeInBlackList(this.blacklist, req.url);

          if (req.url.includes('check-profile?') && !isInBlacklist) {

            // Se obtiene X-4226 header del request,
            // Esto para que coincida con el header X-4226,
            // que viene inmerso en el header X-6239
            const x4226 = fromHeaders.get('X-4226');
            const x6239 = event.headers.get('X-6239');

            if (!this.validateSecurity){
              return event;
            }

            if (!x4226 && !x6239) {
              this.tokenService.notifyErrorToLogin('Hemos detectado un problema de seguridad en tu sesión.');
              return;
            }

            const dateTime = this.base64.decoded(x4226 as string).toString();
            try {
              const registrationRequired = event.body.registrationRequired;
              const status = event.body.status;
              const concatValue = `e9j7XJaRwjvtmS6oHf4c25352TJufI2uO${dateTime}${registrationRequired}${status}`;
              const contactValue64 = this.base64.encryption(concatValue);
              const md5 = forge.md.md5.create();
              md5.update(contactValue64);
              const checksumWebApp = md5.digest().toHex();
              const checksumWebApp64 = this.base64.encryption(String.fromCharCode(...new Uint16Array(hexToBytes(checksumWebApp))));
              if (checksumWebApp64.trim() !== (x6239 as string ?? '').trim()) {
                this.tokenService.notifyErrorToLogin('Hemos detectado un problema de seguridad en tu sesión.');
                return;
              }
            } catch (e) {
              console.error(e);
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

    function hexToBytes(hex: string) {
      let bytes = [];
      for (let c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(substr(hex, c), 16) as never);
      }
      return bytes;
    }

    function substr(value: string, idx: number) {
      const INITIAL_VALUE = 2;

      return value.substring(idx, (idx + INITIAL_VALUE));
    }
  }
}
