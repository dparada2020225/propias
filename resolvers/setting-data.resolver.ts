import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ISettingData } from '../models/setting-interface';
import { SettingDataService } from '../service/common/setting-data.service';

/**
 * @author Fabian Serrano
 * @date 02/06/22
 *
 */
@Injectable({
    providedIn: 'root'
})
export class SettingDataResolver implements Resolve<Observable<ISettingData>>{

    constructor(
        private settingData: SettingDataService
    ) { }

    resolve(): Observable<ISettingData> {
        return this.settingData.getSetting().pipe(catchError(error => of(error)));
    }
}
