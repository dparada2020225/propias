import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OnboardingModalComponent} from './onboarding-modal.component';
import {HomePrivateService} from "../../../service/private/home-private.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {MockTranslatePipe} from "../../../../assets/mocks/public/tranlatePipeMock";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";

describe('OnboardingModalComponent', () => {
  let component: OnboardingModalComponent;
  let fixture: ComponentFixture<OnboardingModalComponent>;

  let activeModal: jasmine.SpyObj<NgbActiveModal>;
  let onboardingService: jasmine.SpyObj<HomePrivateService>;

  beforeEach(async () => {

    const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close'])
    const onboardingServiceSpy = jasmine.createSpyObj('HomePrivateService', ['onBoardingLow'])

    await TestBed.configureTestingModule({
      declarations: [ OnboardingModalComponent, MockTranslatePipe ],
      providers: [
        { provide: NgbActiveModal, useValue: activeModalSpy },
        { provide: HomePrivateService, useValue: onboardingServiceSpy },
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
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingModalComponent);
    component = fixture.componentInstance;

    activeModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;
    onboardingService = TestBed.inject(HomePrivateService) as jasmine.SpyObj<HomePrivateService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
