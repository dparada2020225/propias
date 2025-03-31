import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import timeOutServiceList from './../../assets/data/time-out-service-list.json';
import blackListTimeOutServiceList from './../../assets/data/black-list-timeout-service.json';
import { environment } from '../../environments/environment';
import { InfoServiceAlert, TimeoutService } from '../service/private/time-out/timeout.service';

/**
 * @author Fabian Serrano
 * @date 14/06/21
 *
 */
@Injectable()
export class TimeOutInterceptor implements HttpInterceptor {
  private timeOutServiceList: Array<any> = timeOutServiceList;
  serviceList = {};
  timeoutServiceFlag = environment.timeoutService
  blackList = blackListTimeOutServiceList;

  constructor(
    private timeoutService: TimeoutService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const indexBL = this.blackList.indexOf(req.url);

    if (this.timeoutServiceFlag && indexBL === -1) {
      const isFoundUrl = this.timeOutServiceList.find((service) => req.url.indexOf(service.url) > -1);

      if (isFoundUrl) {
        let fromHeaders = req.headers;
        const timeRequest = Date.now();
        fromHeaders = fromHeaders.append('time-request', timeRequest.toString());

        const reqClone = req.clone({
          headers: fromHeaders,
        });

        this.countingStart(isFoundUrl.time, req.url, timeRequest);

        return next.handle(reqClone)
          .pipe(
            map(data => {
              this.handleNextResponse(data, reqClone);
              return data;
            }),
            catchError((error: HttpErrorResponse) => {
              this.handleErrorResponseRequest(reqClone);
              return throwError(() => error)
            })
          )
      }


    }

    return next.handle(req);
  }

  private handleNextResponse(data: HttpEvent<any>, request: HttpRequest<any>) {
    if (data.type !== 0) {
      const timeRequestHeader = request.headers.get('time-request');
      const urlTimeOut = request.url + timeRequestHeader;
      const index = Object.keys(this.serviceList).indexOf(urlTimeOut);

      if (index >= 0) {
          clearTimeout(this.serviceList[urlTimeOut]);
          delete this.serviceList[urlTimeOut];
      }
    }
  }

  private handleErrorResponseRequest(request: HttpRequest<any>) {
    let alertService: InfoServiceAlert = new InfoServiceAlert();
    alertService.type = 'error'
    alertService.service = request.url;
    this.timeoutService.send(alertService);

    const timeRequestHeader = request.headers.get('time-request');
    const urlTimeOut = request.url + timeRequestHeader;
    const index = Object.keys(this.serviceList).indexOf(urlTimeOut);

    if (index >= 0) {
        clearTimeout(this.serviceList[urlTimeOut]);
        delete this.serviceList[urlTimeOut];
    }
  }

  private countingStart(time, url, timeRequest) {
    const urlTimeOut = url + timeRequest;

    this.serviceList[urlTimeOut] = setTimeout(() => {
      let alertService: InfoServiceAlert = new InfoServiceAlert();
      alertService.type = 'warning'
      alertService.service = url;

      this.timeoutService.send(alertService);

      const index = Object.keys(this.serviceList).indexOf(urlTimeOut);

      if (index >= 0) {
        delete this.serviceList[urlTimeOut];
      }
    }, time);
  }
}
