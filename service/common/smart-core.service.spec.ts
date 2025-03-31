import {TestBed} from '@angular/core/testing';

import {AuthenticationService, SmartidNavigationService, StorageService} from '@adf/security';
import {EProfile} from 'src/app/enums/profile.enum';
import {environment} from 'src/environments/environment';
import {SmartCoreService} from './smart-core.service';
import {FeatureManagerService} from "./feature-manager.service";

describe('SmartCoreService', () => {
  let service: SmartCoreService;
  let authenticationService: jasmine.SpyObj<AuthenticationService>;
  let smartIdNavigationService: jasmine.SpyObj<SmartidNavigationService>;
  let featureManagerService: jasmine.SpyObj<FeatureManagerService>;

  beforeEach(() => {

    const storageSpy = jasmine.createSpyObj('StorageService', [''])
    const authenticationServiceSpy = jasmine.createSpyObj('AuthenticationService', ['personalizationOperation'])
    const smartIdNavigationServiceSpy = jasmine.createSpyObj('SmartidNavigationService', ['setChannelToSmartCoreOperation'])
    const featureManagerServiceSpy = jasmine.createSpyObj('FeatureManagerService', ['smartCoreImplement'])

    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageSpy },
        { provide: AuthenticationService, useValue: authenticationServiceSpy },
        { provide: SmartidNavigationService, useValue: smartIdNavigationServiceSpy },
        { provide: FeatureManagerService, useValue: featureManagerServiceSpy },
      ]
    });
    service = TestBed.inject(SmartCoreService);
    authenticationService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    smartIdNavigationService = TestBed.inject(SmartidNavigationService) as jasmine.SpyObj<SmartidNavigationService>;
    featureManagerService = TestBed.inject(FeatureManagerService) as jasmine.SpyObj<FeatureManagerService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should personalization Operation', () => {
    const data: any = 'data';

    environment.smartCore = true;
    environment.profile = EProfile.HONDURAS;
    featureManagerService.smartCoreImplement.and.returnValue(true);
    service.personalizationOperation(data);

    expect(smartIdNavigationService.setChannelToSmartCoreOperation).toHaveBeenCalledWith(data);
    expect(authenticationService.personalizationOperation).toHaveBeenCalled();
  })

});
