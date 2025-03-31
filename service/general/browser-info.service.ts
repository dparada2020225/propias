import {Injectable} from '@angular/core';
import { BrowserInfo } from '../../modules/shared/models/browser-info';

import {detect} from 'detect-browser';


/**
 * @author Eder Santos
 * @date 22/03/21
 *
 * Provide a way to identify the browser
 */
@Injectable({
  providedIn: 'root'
})
export class BrowserInfoService {

  /**
   * Detect the browser and return the information
   * @return An object with the detected browser information, the values will be unknown if unable to detect
   */
  getBrowserInfo(): BrowserInfo {
    const browser = detect();
    const browserInfo: BrowserInfo = new BrowserInfo();
    if (browser) {
      browserInfo.name = browser.name;
      browserInfo.version = browser.version ?? '';
      browserInfo.operatingSystem = browser.os ?? '';
      browserInfo.mobile = (browser.os === 'iOS' || browser.os === 'Android OS' || browser.os === 'BlackBerry OS'
        || browser.os === 'Amazon OS' || browser.os === 'Windows Mobile');
    }
    return browserInfo;
  }
}
