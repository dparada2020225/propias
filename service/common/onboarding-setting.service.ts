import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { Base64Service } from './base64.service';

@Injectable({
  providedIn: 'root'
})
export class OnboardingSettingService {

  constructor(
    private utils: UtilService,
    private base64: Base64Service,
  ) { }

  closeModalSavedUser(key: string) {
    const userName = this.utils.getUserName();
    const userStorage = localStorage.getItem(key) ?? '[]';
    const users: string[] = JSON.parse(userStorage);
    users.push(this.base64.encryption(userName));
    localStorage.setItem(key, JSON.stringify(users));
  }

  validateIsOpenOnboardingAtFirstTime(key: string) {
    const userName = this.utils.getUserName();
    const userStorage = localStorage.getItem(key) ?? '[]';
    const users: string[] = JSON.parse(userStorage);
    const userMapped = users.map(user => {
      return this.base64.decoded(user);
    });

    return {
      isOpenAtFirstTime: userMapped.includes(userName),
      userName,
    }
  }
}
