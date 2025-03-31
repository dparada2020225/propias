import { AESCryptographyService } from '@adf/security';
import { Injectable } from '@angular/core';
import { Base64Service } from '../common/base64.service';

@Injectable({
  providedIn: 'root',
})
export class StepService {
  constructor(
    private base64: Base64Service,
    private y:  AESCryptographyService) {}

  s(mE: string)  {
    if (!mE) {
      return null;
    }

    const mA = mE.split('.');
    const cK = this.base64.decoded(mA[0]);
    const c = this.base64.decoded(mA[1]);
    const kA = cK.split('.');

    let x = {
      z: this.base64.decoded(kA[0]),
      y: this.base64.decoded(kA[1]),
    };

    return this.y.dH(x, c);
  }
}
