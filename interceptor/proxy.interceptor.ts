import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * @author Fabian Serrano
 * @date 24/03/21
 *
 * interceptor in charge of overwriting the urls with
 * the prefix "/ service /" so that they are taken by
 * the proxy. it is activated from the environment file
 * attribute "proxy"
 */
@Injectable()
export class ProxyInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let activeProxy = environment.proxy;

        if (activeProxy && req.url.indexOf('v1') > -1) {
            let urlLength = req.url.length;
            let routing = req.url.substring((req.url.indexOf('v1')), urlLength);
            let newUrl = '/service/' + routing;

            const httpRequest = new HttpRequest(<any>req.method, newUrl, req.body, { params: req.params, headers: req.headers });
            req = Object.assign(req, httpRequest);
        }

      if (activeProxy && req.url.indexOf('v3') > -1) {
        let urlLength = req.url.length;
        let routing = req.url.substring((req.url.indexOf('v3')), urlLength);
        let newUrl = '/service/' + routing;

        const httpRequest = new HttpRequest(<any>req.method, newUrl, req.body, { params: req.params, headers: req.headers });
        req = Object.assign(req, httpRequest);
      }


        return next.handle(req);
    }
}
