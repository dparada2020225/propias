import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EProfile } from '../../enums/profile.enum';
import { FindServiceCodeService } from './find-service-code.service';
import { StorageService } from '@adf/security';
import { UpdateDataSettingsProperty } from 'src/app/view/private/security-option/update-data/enum/update-data-status.interfaces';
import { EStokenBISVRequiredToken, ESTokenSettingsProperty, ETypeToken } from 'src/app/view/private/soft-token/modules/stoken-bisv/enums/stkn-bisv.enum';
import { ParameterManagementService } from '../navegation-parameters/parameter-management.service';
@Injectable({
  providedIn: 'root',
})
export class FeatureManagerService{
  profile: string = environment.profile;

  constructor(
    private findServiceCode: FindServiceCodeService,
    private storageService: StorageService,
    private parameterManager: ParameterManagementService
  ) {}

  get isOnBoardingEnabled(): boolean {
    switch (this.profile) {
      case EProfile.HONDURAS:
        return true;
      case EProfile.SALVADOR:
        return false;
      case EProfile.PANAMA:
        return false;
      default:
        return false;
    }
  }

  smartCoreImplement(): boolean {
    switch (this.profile) {
      case EProfile.HONDURAS:
        return true;
      case EProfile.SALVADOR:
        return true;
      case EProfile.PANAMA:
        return false;
      default:
        return false;
    }
  }


  implementMethod(): boolean {
    switch (this.profile) {
      case EProfile.SALVADOR:
      case EProfile.HONDURAS:
        return false;
      case EProfile.PANAMA:
        return true;
      default:
        return false;
    }
  }

  labelSpinnerLogOut(): boolean {
    switch (this.profile) {
      case EProfile.HONDURAS:
      case EProfile.PANAMA:
        return true;
      case EProfile.SALVADOR:
        return false;
      default:
        return false;
    }
  }

  softTokenAllow(): boolean {
    const isBIPAProfile = this.profile === EProfile.PANAMA;
    return this.findServiceCode.validateCustomFeature(ESTokenSettingsProperty.STOKEN, isBIPAProfile);
  }

  stknBisvAllow(): boolean {
    const isBISVProfile = this.profile === EProfile.SALVADOR;
    const settings = JSON.parse(this.storageService.getItem('securityParameters'));
    const stokenCodeValue = settings?.customFeatures['stoken']
    const stokenServiceCode = stokenCodeValue === 'true' ?  'stoken' : '';
    return this.findServiceCode.validateCustomFeature(stokenServiceCode, isBISVProfile);
  }

  updateDataAllow(): boolean {
    const isBISV= this.profile === EProfile.SALVADOR;
    return this.findServiceCode.validateCustomFeature(UpdateDataSettingsProperty.UPDATE_DATA, isBISV);
  }


  handleRegionalConnection() {
    const settings = JSON.parse(this.storageService.getItem('securityParameters'));
    const regConec = settings.customFeatures ? settings.customFeatures['reg-connec'] || 'false' : 'false';
    if (regConec === 'true' && this.handleRegionalConnectionProfile()) {
      return true;
    } else {
      return false;
    }
  }

  handleRegionalConnectionProfile() {
    switch (this.profile) {
      case EProfile.SALVADOR:
        return true;
      case EProfile.HONDURAS:
        return false;
      case EProfile.PANAMA:
        return false;
      default:
        return false;
    }
  }

  isSignatureTrackingMultipleOperationsEnabled(): boolean {
    return this.profile === EProfile.HONDURAS;
  }

  isStBisvMultipleEnabled() {
    if (this.profile !== EProfile.SALVADOR) return true;

    const settings = JSON.parse(this.storageService.getItem('securityParameters'));
    const isEnabled = settings.customFeatures ? settings.customFeatures['st-multiple'] || 'false' : 'false';
    return this.profile === EProfile.SALVADOR && isEnabled === 'true';
  }

  isBisvSignatureTrackingFeaturesEnabled(): boolean {
    return this.profile === EProfile.SALVADOR;
  }

  isMultipleParameterRequiredForSignatureTracking() {
    return this.profile === EProfile.HONDURAS;
  }

  isUserLigth(): boolean {
    const tokenControl = this.parameterManager.getParameter('tokenControl') !== EStokenBISVRequiredToken.NOT_REQUIRED_TOKEN && this.parameterManager.getParameter('typeToken') !== ETypeToken.TYPE_NEW_USER_STOKEN ;
    return tokenControl;
  }
}
