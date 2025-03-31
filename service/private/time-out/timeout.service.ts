import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export class InfoServiceAlert {
  service!: string;
  type!: string;
}

@Injectable({
  providedIn: 'root'
})
export class TimeoutService {  

  private serviceInfo = new Subject<InfoServiceAlert>();
  public serviceInfo$ = this.serviceInfo.asObservable();

  getSharedData(): Observable<InfoServiceAlert> {
      return this.serviceInfo$;
  }

  send(value: InfoServiceAlert) {
      this.serviceInfo.next(value);
  }
}
