import { Injectable } from '@angular/core';
import { Subject, Observable} from 'rxjs';

/**
 * @author Fabian Serrano
 * @date 10/05/21
 *
 * service that allows us to obtain the value of the hotp
 */
@Injectable({
  providedIn: 'root',
})
export class PrivateMainFrameService {
  private source = new Subject<any>();
  private loadSecurityOption = new Subject<string>();
  loadSecOption$ = this.loadSecurityOption.asObservable();
  getSharedData(): Observable<any> {
    return this.source.asObservable();
  }
  send(value: any) {
    this.source.next(value);
  }
  reloadSecurityOption(){
    this.loadSecurityOption.next('');
  }
}
