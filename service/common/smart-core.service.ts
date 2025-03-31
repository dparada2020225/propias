import {AuthenticationService, IOperation, SmartidNavigationService, StorageService} from '@adf/security';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {FeatureManagerService} from './feature-manager.service';

@Injectable({
  providedIn: 'root',
})
export class SmartCoreService {
  constructor(
    private storage: StorageService,
    private authenticationService: AuthenticationService,
    private smartIdNavigationService: SmartidNavigationService,
    private featureManagerService: FeatureManagerService
  ) {
  }

  personalizationOperation(operation: IOperation) {
    if (environment.smartCore && this.featureManagerService.smartCoreImplement()) {
      const finalOperation = this.smartIdNavigationService.setChannelToSmartCoreOperation(operation);
      this.authenticationService.personalizationOperation(finalOperation);
    }
  }
}
