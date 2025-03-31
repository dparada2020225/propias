import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestarIldeService {
  private source = new Subject<any>();

  activeRestar(): Observable<any> {
    return this.source.asObservable();
  }

  restar(value: any) {
    this.source.next(value);
  }
}
