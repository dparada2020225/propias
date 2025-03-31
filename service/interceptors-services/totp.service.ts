import {Injectable} from '@angular/core';
import * as SHA from "jssha";

/**
 * @author Eder Santos
 * @date 02/09/21
 *
 * generate a TOTP to be used in the header X-6238
 */
@Injectable(
  {providedIn: 'root'}
)
export class TotpService {

  getTotp(key: string, dateTime: string) {
    return this.getToken(key, {
      algorithm: 'SHA-256',
      period: 5,
      digits: 6
    }, dateTime);

  }

  getToken(key, options, dateTime) {
    options = options || {};
    let epoch, time, shaObj, hmac, offset, otp;
    options.period = options.period || 30;
    options.algorithm = options.algorithm || 'SHA-1';
    options.digits = options.digits || 6;
    key = this.base32tohex(key);
    epoch = Math.round(dateTime / 1000.0);
    time = this.leftpad(this.dec2hex(Math.floor(epoch / options.period)), 16, '0');
    shaObj = new SHA.default(options.algorithm, "HEX");
    shaObj.setHMACKey(key, 'HEX');
    shaObj.update(time);
    hmac = shaObj.getHMAC('HEX');
    offset = this.hex2dec(hmac.substring(hmac.length - 1));
    otp = (this.hex2dec(hmac.substr(offset * 2, 8)) & this.hex2dec('7fffffff')) + '';
    otp = otp.substr(otp.length - options.digits, options.digits);
    return otp;
  }

  hex2dec(s) {
    return parseInt(s, 16);
  }

  dec2hex(s) {
    return (s < 15.5 ? '0' : '') + Math.round(s).toString(16);
  }

  base32tohex(base32) {
    const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let bits = '';
    let hex = '';

    base32 = base32.replace(/=+$/, '');

    for (let i = 0; i < base32.length; i++) {
      const val = base32chars.indexOf(base32.charAt(i).toUpperCase());
      if (val === -1) {
        throw new Error('Invalid base32 character in key');
      }
      bits += this.leftpad(val.toString(2), 5, '0');
    }

    for (let i = 0; i + 8 <= bits.length; i += 8) {
      const chunk = this.substr(bits, i);
      hex = hex + this.leftpad(parseInt(chunk, 2).toString(16), 2, '0');
    }
    return hex;
  }

  substr(value: string, idx: number) {
    const INITIAL_VALUE = 8;

    return value.substring(idx, (idx + INITIAL_VALUE));
  }

  leftpad(str, len, pad) {
    if (len + 1 >= str.length) {
      str = Array(len + 1 - str.length).join(pad) + str;
    }
    return str;
  }
}
