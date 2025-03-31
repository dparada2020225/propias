import { Injectable } from '@angular/core';
import * as forge from 'node-forge';
import { AESCryptographyService, RSACryptographyService } from '@adf/security';
import { Base64Service } from '../common/base64.service';
import { AesKey, RsaKey } from '../../models/encryption-keys.interface';
import { UtilService } from '../common/util.service';

@Injectable({
  providedIn: 'root'
})
export class CryptographyService {
  chunkSize = 190;

  constructor(
    private base64: Base64Service,
    private aesCryptographyService: AESCryptographyService,
    private rsaCryptographyService: RSACryptographyService,
    private utils: UtilService,
  ) { }

  decrypt(rsaKey: RsaKey, contentBase64): any {

    let aesKey: AesKey = new AesKey();
    const content = this.base64.decoded(contentBase64);
    const firstArray = content.split('.');
    const rsaChunks = this.base64.decoded(firstArray[0]);
    let fragmentKey;
    let rsaDecoded;
    if (rsaChunks.indexOf('.') != -1) {
      const rsaChunksList = rsaChunks.split('.');
      rsaChunksList.forEach(element => {
        const elementDecoded = this.rsaCryptographyService.decrypt(rsaKey, this.base64.decoded(element));
        rsaDecoded = rsaDecoded ? rsaDecoded + elementDecoded : elementDecoded;
      });
      fragmentKey = this.base64.decoded(rsaDecoded);
    } else {
      fragmentKey = this.base64.decoded(this.rsaCryptographyService.decrypt(rsaKey, this.base64.decoded(rsaChunks)));
    }
    const aesKeyAndIv = fragmentKey.split('.');
    aesKey.key = this.base64.decoded(aesKeyAndIv[0]);
    aesKey.iv = this.base64.decoded(aesKeyAndIv[1]);
    const data = this.base64.decoded(firstArray[1]);
    const byteStringBuffer = new forge.util.ByteStringBuffer(data);
    return this.aesCryptographyService.decrypt(aesKey, byteStringBuffer);
  }

  encrypt(rsaKey: RsaKey, content): string {
    const aesKey: AesKey = this.aesCryptographyService.genKey();
    const fragmentKey = this.base64.encryption(this.base64.encryption(aesKey.key) + '.' + this.base64.encryption(aesKey.iv));
    const rsaChunksBase64 = this.base64.encryption(this.rsaWithChunks(rsaKey, fragmentKey));
    const aesEncrypt = this.aesCryptographyService.encrypt(aesKey, content);
    const aesEncryptBase64 = this.base64.encryption(aesEncrypt.data);
    return this.base64.encryption(rsaChunksBase64 + '.' + aesEncryptBase64);
  }

  rsaWithChunks(rsaKey: RsaKey, value: string): string {
    if (value.length > this.chunkSize) {
      const numberIterations = +(value.length / this.chunkSize).toFixed();
      let init = 0;
      let end = this.chunkSize;
      let chunkList;
      for (let i = 0; i < numberIterations + 1; i++) {
        if ((numberIterations - 1) === i) {
          const fragmentEncrypt = this.base64.encryption(this.rsaCryptographyService.encrypt(rsaKey, this.utils.substr(value, init, end)));
          chunkList = chunkList + '.' + fragmentEncrypt;
        } else {
          const fragment = this.utils.substr(value, init, end);
          const fragmentEncrypt = this.base64.encryption(this.rsaCryptographyService.encrypt(rsaKey, fragment));

          chunkList = chunkList ? chunkList + '.' + fragmentEncrypt : fragmentEncrypt;
          init = init + end;
          if (value.length < init + end) {
            end = (init + end) - value.length;
          }
        }
      }
      return chunkList;
    } else {
      return this.base64.encryption(this.rsaCryptographyService.encrypt(rsaKey, value));
    }
  }
}
