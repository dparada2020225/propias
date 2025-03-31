import {Injectable} from '@angular/core';
import {ISettingEndPoint, ISettingsEndPointsItem} from '../../models/token.interface';
import {HttpRequest} from '@angular/common/http';
import {FindServiceCodeService} from './find-service-code.service';
import {ParameterManagementService} from '../navegation-parameters/parameter-management.service';
import {Router} from '@angular/router';
import { BankingAuthenticationService, StorageService } from '@adf/security';
import blackListHeaderTokenRequest from '../../../assets/data/black-list-header-token-request.json';
import {environment} from "../../../environments/environment";
import {EProfile} from "../../enums/profile.enum";

@Injectable({
  providedIn: 'root'
})
export class HandleTokenRequestService {
  private _blackList: string[] = blackListHeaderTokenRequest;
  private SIGNATURE_TRACKING_SERVICE_CODE = 'seg-statrx'
  private profile = environment.profile;

  get getIsTokenRequired(): boolean {
    return this.parameterManagement.getParameter('isTokenRequired');
  }

  constructor(
    private findServiceCode: FindServiceCodeService,
    private parameterManagement: ParameterManagementService,
    private router: Router,
    private bankingService: BankingAuthenticationService,
    private storage: StorageService,
  ) {
  }

  isTokenRequired(serviceCodeParam?: string): boolean {
    const { serviceCode } = this.getServiceCode(serviceCodeParam);
    const hasTokenRequired = this.getIsTokenRequired;
    const serviceCodeSettingsResponse = this.parameterManagement.getParameter('tokenRequestSettings');
    const serviceCodeInSettingsEncrypted = JSON.parse(this.storage.getItem('securityParameters'))?.tokenRequestSetting || '';
    const getServiceCodeBySettings = this.findServiceCode.getTokenRequestSettings(serviceCodeInSettingsEncrypted);
    const serviceCodeInSettings= Object.keys(getServiceCodeBySettings)
    const serviceCodeList = serviceCodeSettingsResponse?.status === 0 ? serviceCodeSettingsResponse.services : serviceCodeInSettings;
    const isNotFoundSettings = serviceCodeList.length === 0 && serviceCodeSettingsResponse?.status === 1;
    const isIncluded = isNotFoundSettings ? true : Boolean(serviceCodeList.includes(serviceCode));
    return isIncluded && hasTokenRequired;
  }


  isSetHeaderTokenRequired(service: string, serviceCodeParam?: string) {
    const {serviceCode, tokenRequestSettings} = this.getServiceCode(serviceCodeParam);
    const baseValidation = this.isTokenRequired(serviceCodeParam);

    const isEquivalente = this.isUrlEquivalence(this.cleanUrl(service), tokenRequestSettings, serviceCode);

    return {
      type: 'x-8070b',
      value: this.bankingService.encrypt(String(baseValidation && isEquivalente)),
      rawValue: baseValidation && isEquivalente,
    }
  }

  isRequestHasTokenRequiredHeader(req: HttpRequest<any>) {
    return !!req.headers.get('x-8070b');
  }

  isUrlSetTokenRequiredHeader(req: HttpRequest<any>) {
    return !this._blackList.some(url => req.urlWithParams.indexOf(url) > -1);
  }

  private isUrlInSignatureTrackingFlow(url: string, endpoints: ISettingEndPoint) {
    return this.validateUrlEquivalence(url, endpoints[this.SIGNATURE_TRACKING_SERVICE_CODE] || []);
  }

  private isUrlEquivalence(url: string, endpoints: ISettingEndPoint, serviceCode: string) {
    const equivalence = endpoints[serviceCode];
    if (!url || !equivalence) return false;

    if (this.isUrlInSignatureTrackingFlow(url, endpoints)) return true;

    return this.validateUrlEquivalence(url, equivalence);
  }


  private validateUrlEquivalence(url: string, equivalence: ISettingsEndPointsItem[]) {
    return equivalence.some((equivalenceUrl: ISettingsEndPointsItem) => {
      return equivalenceUrl.service === url;
    });
  }

  private cleanUrl(url: string) {
    const regex = /^\/service/;
    const regexManagmentFlow = /\/\d+$/;
    const newUrl = url.replace(regexManagmentFlow, '');

    if (regex.test(newUrl)) {
      return newUrl.replace(regex, '');
    }

    return newUrl;
  }

  private getServiceCode(serviceCodeParam?: string) {
    const url = this.router.url.substring(1).split('?')[0];
    const {serviceCode, tokenRequestSettings} = this.findServiceCode.getTokenRequestServiceCode(url) || '';

    return {
      serviceCode: serviceCodeParam || serviceCode as string,
      tokenRequestSettings,
    }
  }
}
