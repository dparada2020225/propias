import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';

/**
 * @author Fabian Serrano
 * @date 24/03/21
 *
 * service that allows us to obtain the value of the hotp X-4226
 */
@Injectable(
    { providedIn: 'root' }
)
export class HotpService {

    getHotp() {
        const timevar = new Date().getTime();
        const rawStr = CryptoJS.enc.Utf8.parse(timevar);
        return CryptoJS.enc.Base64.stringify(rawStr);
    }
}
