import {TestBed} from '@angular/core/testing';

import {OnboardingModalService} from './onboarding-modal.service';
import {HomePrivateService} from "../home-private.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {StorageService} from "@adf/security";
import {FeatureManagerService} from "../../common/feature-manager.service";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";

describe('OnboardingModalService', () => {
  let service: OnboardingModalService;

  let homePrivateService: jasmine.SpyObj<HomePrivateService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let storage: jasmine.SpyObj<StorageService>;
  let featureManager: jasmine.SpyObj<FeatureManagerService>;

  beforeEach(() => {

    const homePrivateServiceSpy = jasmine.createSpyObj('HomePrivateService', ['getOnBoardingDetail', 'onBoardingLow'])
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])
    const storageSpy = jasmine.createSpyObj('StorageService', ['addItem'])
    const featureManagerSpy = jasmine.createSpyObj('FeatureManagerService', ['isOnBoardingEnabled'])

    TestBed.configureTestingModule({
      providers: [
        { provide: HomePrivateService, useValue: homePrivateServiceSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: StorageService, useValue: storageSpy },
        { provide: FeatureManagerService, useValue: featureManagerSpy },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    service = TestBed.inject(OnboardingModalService);
    homePrivateService = TestBed.inject(HomePrivateService) as jasmine.SpyObj<HomePrivateService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    storage = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    featureManager = TestBed.inject(FeatureManagerService) as jasmine.SpyObj<FeatureManagerService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
