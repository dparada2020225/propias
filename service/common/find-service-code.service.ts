import {Injectable} from '@angular/core';
import menuServiceEquivalenceFeatureFlags from '../../../assets/data/menu-equivalency.service.json';
import {ECustomFeatureValue, IMenuEquivalency, IMenuEquivalencyElement,} from '../../models/service-menu.model';
import {ISettingData} from '../../models/setting-interface';
import {environment} from '../../../environments/environment';
import {IMenuOption} from '../../models/menu.interface';
import {StorageService} from '@adf/security';
import {StepService} from '../private/step.service';
import {ISettingEndPoint} from '../../models/token.interface';

@Injectable({
  providedIn: 'root',
})
export class FindServiceCodeService {
  private profile = environment.profile;

  constructor(
    private storage: StorageService,
    private stepService: StepService,
  ) {
  }

  /*
  * PLEASE TAKE CARE WITH THIS METHOD
  * this method takes two parameters serviceCode is everything in customFeatures from settings,
  *, and extra validation for your feature is single only one profile, example
  * This method can use in soft-token, because soft-token is only one profile
  * or limits in BISV Profile
  * */
  validateCustomFeature(serviceCode: string, extraValidation = false) {
    if (!serviceCode) return false;

    const settings: ISettingData = JSON.parse(this.storage.getItem('securityParameters'));
    const onlineCoreServices = settings?.customFeatures;

    if (!onlineCoreServices && extraValidation) return true;

    if (!onlineCoreServices && !extraValidation) return false;

    const isAllowed = onlineCoreServices[serviceCode];

    if ((isAllowed === undefined || isAllowed === null) && extraValidation) return true;

    if (isAllowed === ECustomFeatureValue.ENABLED && extraValidation) return true;

    if (isAllowed === ECustomFeatureValue.DISABLED) return false;

    return false;
  }

  getUrl(url: string) {
    if (!url) {
      return 'home';
    }
    const currentUrl = this.clearUrl(url);

    const serviceCodeList = menuServiceEquivalenceFeatureFlags[this.profile];
    if (!serviceCodeList) {
      return 'home';
    }

    const {serviceCode, currentElement} = this.findServiceCode(currentUrl, serviceCodeList) ?? {};

    if (!serviceCode || !currentElement) {
      return 'home';
    }

    return this.validateUrlEquivalence(serviceCode, currentElement);
  }

  validateUrlEquivalence(serviceCode: string, equivalence: IMenuEquivalencyElement) {
    const settings: ISettingData = JSON.parse(this.storage.getItem('securityParameters'));
    const onlineCoreServices = settings?.customFeatures;

    if (!onlineCoreServices) {
      return equivalence.url.default;
    }


    const serviceCodeFounded = this.validateFeatureFlagParameter(serviceCode);
    const isAllowed = onlineCoreServices[serviceCodeFounded];

    if (isAllowed === undefined || isAllowed === null) {
      return equivalence.url.default;
    }

    return isAllowed === ECustomFeatureValue.ENABLED ? equivalence.url.new : equivalence.url.old;
  }

  getServiceCode(url: string): string {
    const currentUrl = this.clearUrl(url);
    return this.searchServiceCodeByFeatureFlags(currentUrl) as string;
  }

  getTokenRequestSettings(settings: string) {
    try {
      return JSON.parse(this.stepService.s(settings) as string) as ISettingEndPoint
    } catch (e) {
      return {}
    }
  }

  getTokenRequestServiceCode(url: string) {
    let serviceCode: string | undefined = undefined;
    const settings: ISettingData = JSON.parse(this.storage.getItem('securityParameters'));
    const tokenRequestSettings = this.getTokenRequestSettings(settings?.tokenRequestSetting || '');

    for (const key in tokenRequestSettings) {
      const urls = tokenRequestSettings[key];

      if (urls && urls.length > 0) {
        for (const element of urls) {
          if (element.url === url) {
            serviceCode = key;
            break;
          }
        }
      }
    }

    return {
      serviceCode,
      tokenRequestSettings,
    }
  }

  searchMenuEquivalence(serviceCode: string, list: IMenuOption[]): boolean {
    if (list && list.length > 0) {
      return list.reduce((acc, menu) => {
        if (menu.service === serviceCode) {
          return menu.service === serviceCode;
        } else if (menu.child && (menu.child?.length ?? 0) > 0) {
          const found = this.searchMenuEquivalence(serviceCode, menu.child);
          if (found) return found;
        }

        return acc;
      }, false);
    }

    return false;
  }

  private findServiceCode(url: string, serviceCodeList: IMenuEquivalency) {
    let serviceCode: string | undefined = undefined;
    let currentElement: IMenuEquivalencyElement | undefined = undefined;

    for (const key in serviceCodeList) {
      const urls: IMenuEquivalencyElement[] = serviceCodeList[key];

      if (urls && urls.length > 0) {
        for (const element of urls) {
          if (element.url.new === url || element.url.old === url) {
            serviceCode = key;
            currentElement = element;
            break;
          }
        }
      }
    }

    return {serviceCode, currentElement};
  }

  private searchServiceCodeByFeatureFlags(url: string) {
    const settings: ISettingData = JSON.parse(this.storage.getItem('securityParameters'));
    const serviceCodeList = menuServiceEquivalenceFeatureFlags[this.profile];

    if (!serviceCodeList) {
      return undefined;
    }

    const {serviceCode, currentElement} = this.findServiceCode(url, serviceCodeList);
    const onlineCoreServices = settings?.customFeatures;

    if (!onlineCoreServices && url === currentElement?.url.default) {
      return serviceCode;
    }

    if (!onlineCoreServices && url === currentElement?.url.old) {
      return undefined
    }


    const serviceCodeParsed = this.validateFeatureFlagParameter(serviceCode as string);

    if (!serviceCodeParsed) {
      return undefined;
    }

    const isAllowed = onlineCoreServices[serviceCodeParsed];

    const isEmptyAllowed = isAllowed === undefined || isAllowed === null;

    if (isEmptyAllowed && url === currentElement?.url.default) {
      return serviceCode;
    }

    if (isEmptyAllowed && url === currentElement?.url.old) {
      return serviceCode;
    }

    if (isEmptyAllowed && url === currentElement?.url.new) {
      return serviceCode;
    }

    if (isAllowed === ECustomFeatureValue.ENABLED && currentElement?.url.new === url) {
      return serviceCode;
    }

    if (isAllowed === ECustomFeatureValue.DISABLED && currentElement?.url.old === url) {
      return serviceCode;
    }


    return undefined;
  }

  private validateFeatureFlagParameter(serviceCode: string) {
    const equivalenceMenuList = menuServiceEquivalenceFeatureFlags[this.profile];
    const serviceCodeFounded: IMenuEquivalencyElement[] = equivalenceMenuList[serviceCode];

    if (!serviceCodeFounded) return serviceCode;

    return serviceCodeFounded.reduce((acc, element) => {
      if (element?.url?.accessCode) {
        return element.url.accessCode ?? serviceCode;
      }

      return serviceCode;
    }, '');
  }

  private clearUrl(url: string) {
    const regex = /^\/|\/$/g;
    return url.replace(regex, '');
  }


}
