import {BankingAuthenticationService, RSACryptographyService, StorageService} from '@adf/security';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {RsaKey} from '../models/encryption-keys.interface';
import {CustomUserAgentService} from '../service/interceptors-services/custom-user-agent.service';
import {HotpService} from '../service/interceptors-services/hotp.service';
import {TokenizerAccountsService} from '../service/token/tokenizer-accounts.service';
import {HandleTokenRequestService} from '../service/common/handle-token-request.service';
import {ISettingData} from '../models/setting-interface';

/**
 * @author Fabian Serrano
 * @date 24/03/21
 *
 * provides a way to add headers without needing
 * to modify the service
 */
@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  urlsWithoutToken = environment.urlsWithoutBearerToken;
  security = environment.security;
  blacklist = environment.blacklist;
  key = environment.security.clientId + ':' + environment.security.clientSecret;

  constructor(
    private hotpService: HotpService,
    private customUserAgenteService: CustomUserAgentService,
    private rsaCryptographyService: RSACryptographyService,
    private bankingService: BankingAuthenticationService,
    private encriptService: TokenizerAccountsService,
    private storageService: StorageService,
    private handleTokenRequest: HandleTokenRequestService,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let fromHeaders = req.headers;
    let fromBody = req.body;

    let isInBlacklist = false;
    const settings: ISettingData = JSON.parse(this.storageService.getItem('securityParameters'));
    if (settings.regionalConnectionPriv) {
      this.blacklist.push(settings.regionalConnectionPriv)
    }

    for (const url of this.blacklist) {
      if (req.url.indexOf(url) > -1) {
        isInBlacklist = true;
        break;
      }
    }

    if (!isInBlacklist) {
      let hotp = '';

      if (environment.hotp) {
        hotp = this.hotpService.getHotp();
        fromHeaders = fromHeaders.append('X-4226', hotp);
      }

      // Creación de valor Random de 32 caracteres
      const keyRandom = 'e9j7XJaRwjvtmS6oHf4c25352TJufI2uO';
      const currentMilis = Date.now(); // Se obtiene la fecha actual en milisegundos

      // Encripción RSA con llave pública (Se encripta Random-Fecha_milis)
      const encryptData = this.bankingService.encrypt(`${keyRandom}-${currentMilis}`);

      const otp = this.storageService.getItem("ne");

      // Se inicializa llave RSA
      const rsaKeys: RsaKey = new RsaKey();
      rsaKeys.public = this.rsaCryptographyService.addCertificate(this.security.key, 'public'); // Se agrega certificado a PKey

      fromHeaders = fromHeaders.append('X-User-Agent', this.customUserAgenteService.getUserAgent());
      fromHeaders = fromHeaders.append('X-6238', `${encryptData}`);

      if (otp) {
        fromHeaders = fromHeaders.append('X-1010', `${this.bankingService.encrypt(otp.toString())}`);
      }

      if (req.url.includes('oauth/token')) {
        fromHeaders = fromHeaders.append('X-ENCRYPT-ENABLED', environment.encryptionEnabled.toString())
      }

      if (req.url.includes('update-contact')) {
        fromHeaders = fromHeaders.append('X-4226a', this.encriptService.tokenizer(hotp));
      }

      if (this.handleTokenRequest.isUrlSetTokenRequiredHeader(req) && !this.handleTokenRequest.isRequestHasTokenRequiredHeader(req)) {
        let test = this.handleTokenRequest.isRequestHasTokenRequiredHeader(req)
        const headerValue = this.bankingService.encrypt(String(this.handleTokenRequest.isRequestHasTokenRequiredHeader(req))) as string;
        fromHeaders = fromHeaders.append('X-8070b', headerValue);
      }

      const headerList = JSON.parse(this.storageService.getItem("headerList"));

      if (headerList) {
        for (const key in headerList) {
          fromHeaders = fromHeaders.append(key, headerList[key]);
        }
      }

      const isUrlWithToken = !this.urlsWithoutToken.some(url => req.urlWithParams.indexOf(url) > -1);
      const currentToken = this.storageService.getItem('currentToken');

      if (isUrlWithToken && currentToken) {
        // Adding jwt
        const jwt = JSON.parse(currentToken)['access_token'];
        fromHeaders = fromHeaders.append('Authorization', `Bearer ${jwt}`);
      }
    }


    const headers = req.clone({
      headers: fromHeaders,
      body: fromBody
    });

    return next.handle(headers);
  }
}
