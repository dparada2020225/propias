import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginActiveService {
  private serviceInfo = new Subject<any>();
  public serviceInfo$ = this.serviceInfo.asObservable();

  getData(): Observable<any> {
    return this.serviceInfo$;
  }

  send(value: any) {
    this.serviceInfo.next(value);
  }
}
