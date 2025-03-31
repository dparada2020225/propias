import { Injectable } from '@angular/core';
import * as uuid from 'uuid';
import { StorageService } from '@adf/security';
import { environment } from '../../../environments/environment';
import { userAgentProfile } from '../../enums/profile.enum';
import { BrowserInfoService } from '../general/browser-info.service';

/**
 * @author Eder Santos
 * @date 22/03/21
 *
 * Build the user agent header with the client information
 */
@Injectable({
  providedIn: 'root'
})
export class CustomUserAgentService {

  /**
   * @param browserInfoService A service that can detect the browser information
   */
  constructor(
    private browserInfoService: BrowserInfoService,
    private storage: StorageService
  ) { }

  /**
   * Build the custom user agent header
   * @return A String containing the header, example `BancaMovilBI/1.0 (Web 1; Linux; chrome; 87.0.4280) ID/1.0
   * (PC; 5821a4b7-245a-4537-8a10-c2603ed4a2aa; 5821a4b7-245a-4537-8a10-c2603ed4a2aa;HN-3.0.1)`
   */
  getUserAgent(): string {
    const info = this.browserInfoService.getBrowserInfo();
    const deviceType = (info.mobile) ? 'PHONE' : 'PC';

    let deviceName;
    if (this.storage.getItem('uuid')) {
      deviceName = this.storage.getItem('uuid');
    } else {
      deviceName = uuid.v4();
      this.storage.addItem('uuid', deviceName);
    }

    return `BancaMovilBI/1.0 (Web 1; ${info.operatingSystem}; ${info.name}; ${info.version}) ID/1.0 (${deviceType}; ${deviceName}; ${deviceName}; ${userAgentProfile[environment.profile]}-${environment.appVersion})`;
  }
}
