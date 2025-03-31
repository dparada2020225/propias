import { StorageService } from '@adf/security';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { ISettingData } from 'src/app/models/setting-interface';
import { environment } from 'src/environments/environment';
import settingDataJson from '../../../assets/settings/settings-data.json';

@Injectable({
  providedIn: 'root'
})
export class SettingDataService {

  constructor(
    private storage: StorageService,
    private httpClient: HttpClient
  ) { }

  getSetting(): Observable<ISettingData> {
    return this.httpClient.get<ISettingData>('/v1/settings/')
      .pipe(
        map((settingsData) => {
          this.storage.addItem('securityParameters', JSON.stringify(settingsData));
            return settingsData;
          }
        ),
        catchError((error) => {
            this.storage.addItem('securityParameters', JSON.stringify(settingDataJson[environment.profile]));
            return throwError(() => error);
          }),
        retry(1)
      );
  }
}
