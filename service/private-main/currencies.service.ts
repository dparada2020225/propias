import { StorageService } from '@adf/security';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { ISettingData } from 'src/app/models/setting-interface';

const CURRENCIES = {
  'HNL': 'L',
  'USD': 'US$',
  'EUR': 'EUR'
}

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {

  private settingStorage!: ISettingData;

  constructor(
    private storage: StorageService
  ) { }

  getCurrency(): Observable<string> {
    this.settingStorage = JSON.parse(this.storage.getItem('securityParameters'));

    return new Observable(observer => {
      observer.next(CURRENCIES[this.settingStorage.currency] || '');
      observer.complete();
    });
  }
}
