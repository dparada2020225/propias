import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StateManagerService {

    click: number = 0;
    statusInfo: boolean = true;
    private serviceInfo = new Subject<any>();
    public serviceInfo$ = this.serviceInfo.asObservable();

    constructor(
    ) {
        // This is intentional
    }

    getData(): Observable<any> {
        return this.serviceInfo$;
    }

    accountant() {
        if (this.click === 4) {
            this.alert();
            this.click = 0;
        } else {
            this.click = ++this.click;
        }
    }

    alert() {
        this.statusInfo = !this.statusInfo;
        this.serviceInfo.next(this.statusInfo);
    }

    status() {
        return this.statusInfo;
    }
}
