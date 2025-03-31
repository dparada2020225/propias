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
import { MenuService } from '../service/shared/menu.service';
import { UtilService } from '../service/common/util.service';
import { ISettingData } from '../models/setting-interface';
import { StorageService } from '@adf/security';


/**
 * @author Raúl Méndez
 * @date 28/09/21
 *
 * provides a way to add headers without needing
 * to modify the service
 */

@Injectable()
export class ChecksumInterceptor implements HttpInterceptor {
  blacklist = environment.blacklist;

  constructor(
    private menuService: MenuService,
    private base64: Base64Service,
    private utils: UtilService,
    private storageService: StorageService
    ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      filter((event: any) => event instanceof HttpResponse),
      map((event: HttpResponse<any>) => {
          const settings: ISettingData = JSON.parse(this.storageService.getItem('securityParameters'));
          if (settings.regionalConnectionPriv) {
            this.blacklist.push(settings.regionalConnectionPriv)
          }
          const isInBlacklist = this.utils.valueIsIncludeInBlackList(this.blacklist, req.url);

          if (req.url.includes('oauth/token') && !isInBlacklist) {
            const x4226 = event.headers.get('X-4226');
            const x6238 = event.headers.get('X-6238');

            if (x4226 != null && x6238 != null) {
              const dateTime = this.base64.decoded(x4226).toString();

              try {
                const requiredToken = event.body.required_token;
                const concatValue = `e9j7XJaRwjvtmS6oHf4c25352TJufI2uO${dateTime}${requiredToken}`;
                const contactValue64 = this.base64.encryption(concatValue);

                const md5 = forge.md.md5.create();
                md5.update(contactValue64);
                const checksumWebApp = md5.digest().toHex();

                const checksumWebApp64 = this.base64.encryption(String.fromCharCode(...new Uint16Array(hexToBytes(checksumWebApp))));

                if (checksumWebApp64.trim() !== x6238.trim()) {
                  this.menuService.notifyErrorToLogin('Hemos detectado un problema de seguridad en tu sesión.');
                  return;
                }
              } catch (e) {
                console.error(e);
              }
            } else {
              this.menuService.notifyErrorToLogin('Hemos detectado un problema de seguridad en tu sesión.');
              return;
            }
          }
          return event;
        },
      ),
      tap({
        error: (error: HttpErrorResponse) => {
          // Operation failed; error is an HttpErrorResponse
          console.error(error);
        }
      })
    ) as Observable<HttpEvent<any>>;

    function hexToBytes(hex) {
      let bytes = [];
      for (let c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(hex.substr(c, 2), 16) as never);
      }
      return bytes;
    }
  }
}
