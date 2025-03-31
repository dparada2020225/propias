import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {StateManagerService} from '../service/private-main/state-manager.service';
import {RSACryptographyService, StorageService} from '@adf/security';
import {CryptographyService} from '../service/interceptors-services/cryptography.service';
import {ParseUtf8Service} from '../service/common/parse-utf8.service';
import {Base64Service} from '../service/common/base64.service';
import backList from "../../assets/data/blacklist-skip-encrypted.json"
import {CharacterMap, RsaKey} from '../models/encryption-keys.interface';
import {ISettingData} from "../models/setting-interface";
import specialCharactersListResponse from '../../assets/data/parse-response-utf8.json'
import specialCharactersListRequest from '../../assets/data/parse-request-utf8.json'

@Injectable()
export class EncryptionInterceptor implements HttpInterceptor {
  encryptServices = environment.encryptionEnabled;
  encryptionTest: boolean = true;
  private blackList = backList;
  private objToParseResponse: CharacterMap = specialCharactersListResponse;
  private objToParseResquest: CharacterMap = specialCharactersListRequest;

  constructor(
    private cryptographyService: CryptographyService,
    private storage: StorageService,
    private rsaCryptographyService: RSACryptographyService,
    private parseUtf8: ParseUtf8Service,
    private encryptionTestService: StateManagerService,
    private base64: Base64Service,
    private storageService: StorageService
  ) {
    this.encryptionTestService.getData().subscribe((data) => {
      this.encryptionTest = data;
    });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const requestToken: boolean = req.url.indexOf("/v1/oauth/token") <= -1;
    const settings: ISettingData = JSON.parse(this.storageService.getItem('securityParameters'));

    if (settings.regionalConnectionPriv) {
      this.blackList.push(settings.regionalConnectionPriv);
    }

    let isInBlacklist = false;
    for (const url of this.blackList) {
      if (req.url.indexOf(url) > -1) {
        isInBlacklist = true;
        break;
      }
    }

    if (
      !isInBlacklist
      && this.encryptServices
      && this.encryptionTest) {

      let fromHeaders = req.headers;
      const rsaKeys: RsaKey = new RsaKey();
      fromHeaders = fromHeaders.append("Accept", "*/*");
      fromHeaders = fromHeaders.append("Content-Type", "application/bi+crypt");
      rsaKeys.public = this.storage.getItem("publicKey");
      rsaKeys.private = this.storage.getItem("privateKey");

      let contentBody = req.body;

      if (req.body) {
        contentBody = this.cryptographyService.encrypt(rsaKeys, this.parseUtf8.conversion(JSON.stringify(req.body), this.objToParseResquest));
      }

      const newReq = req.clone({
        responseType: "text",
        headers: fromHeaders,
        body: contentBody
      });

      return next.handle(newReq).pipe(
        map((data) => {
          if (data.type !== 0 && data["body"]) {
            let body = this.cryptographyService.decrypt(rsaKeys, data["body"]);

            if (body.length > 0) {
              body = this.parseUtf8.conversion(body, this.objToParseResponse);
            }

            data["body"] = JSON.parse(body) as never;
          }
          return data;
        }),
        catchError((error) => {
          if (error?.status === 401 || error?.status === 200) {
            return throwError(() => error);
          } else {
            const encryptionError = error?.error;
            let decryptionError = this.cryptographyService.decrypt(rsaKeys, encryptionError);

            if (decryptionError.length > 0) {
              decryptionError = this.parseUtf8.conversion(decryptionError, this.objToParseResponse);
            }

            error.error = JSON.parse(decryptionError);

            return throwError(() => error);
          }

        })
      );
    } else if (!requestToken) {
      return next.handle(req).pipe(
        map(
          (data) => {
            let decryptedData = data;
            if (data.type !== 0 && data["body"]) {
              let apiGpublicKey = data["body"]["key"];
              if (!apiGpublicKey) {
                apiGpublicKey = data["body"]["public_key"];
              }
              let publicKey = this.rsaCryptographyService.addCertificate(this.base64.decoded(apiGpublicKey), 'public');
              this.storage.addItem("publicKey", publicKey);
            }
            return decryptedData;
          },
        ),
        catchError((error) => {
          return throwError(() => error);
        })
      );
    } else {
      return next.handle(req);
    }
  }
}
