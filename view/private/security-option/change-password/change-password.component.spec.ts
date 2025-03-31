import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdfComponentsModule, AdfInputComponent, ChangeLanguageService} from '@adf/components';
import {AuthenticationService, StorageService} from '@adf/security';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule, MatInputModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {of} from 'rxjs';
import {StyleManagementService} from 'src/app/service/common/style-management.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {PasswordValidationService} from 'src/app/service/private/security-option/password-validation.service';
import {ChangePasswordService} from 'src/app/service/public/change-password.service';
import {ErrorMessageService} from 'src/app/service/shared/error-message.service';
import {LocalStorageServiceMock} from 'src/assets/mocks/public/mockLocalStorageServiceMock';
import {MockTranslatePipe} from 'src/assets/mocks/public/tranlatePipeMock';
import {ChangePasswordComponent} from './change-password.component';

xdescribe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;

  let changePasswordService: jasmine.SpyObj<ChangePasswordService>;
  let authenticationService: jasmine.SpyObj<AuthenticationService>;
  let translate: jasmine.SpyObj<TranslateService>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let router: jasmine.SpyObj<Router>;
  let passwordValidationService: jasmine.SpyObj<PasswordValidationService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let error: jasmine.SpyObj<ErrorMessageService>;
  let changeLanguageService: jasmine.SpyObj<ChangeLanguageService>;
  let styleManagement: jasmine.SpyObj<StyleManagementService>;
  let parameterManager: jasmine.SpyObj<ParameterManagementService>;

  beforeEach(async () => {
    const changePasswordServiceSpy = jasmine.createSpyObj('ChangePasswordService', ['sendNewPassword']);
    const authenticationServiceSpy = jasmine.createSpyObj('AuthenticationService', ['currentTokenValue']);
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['hide', 'show']);
    const routerSpy = jasmine.createSpyObj('Router', ['url', 'navigate']);
    const passwordValidationServiceSpy = jasmine.createSpyObj('PasswordValidationService', [
      'validation',
      'validationPasswordSv',
      'passwordEvaluationSv',
    ]);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    const errorSpy = jasmine.createSpyObj('ErrorMessageService', ['getTranslateKey']);
    const changeLanguageServiceSpy = jasmine.createSpyObj('ChangeLanguageService', ['getCodeLanguage']);
    const styleManagementSpy = jasmine.createSpyObj('StyleManagementService', ['corporateImageApplication']);
    const parameterManagerSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter']);

    await TestBed.configureTestingModule({
      declarations: [ChangePasswordComponent, MockTranslatePipe, AdfInputComponent],
      providers: [
        ChangePasswordComponent,
        LocalStorageServiceMock,
        {provide: ChangePasswordService, useValue: changePasswordServiceSpy},
        {provide: AuthenticationService, useValue: authenticationServiceSpy},
        {provide: TranslateService, useValue: translateSpy},
        {provide: NgxSpinnerService, useValue: spinnerSpy},
        {provide: Router, useValue: routerSpy},
        {provide: PasswordValidationService, useValue: passwordValidationServiceSpy},
        {provide: NgbModal, useValue: modalServiceSpy},
        {provide: ErrorMessageService, useValue: errorSpy},
        {provide: ChangeLanguageService, useValue: changeLanguageServiceSpy},
        {provide: StyleManagementService, useValue: styleManagementSpy},
        {provide: ParameterManagementService, useValue: parameterManagerSpy},
        {provide: StorageService, useClass: LocalStorageServiceMock},
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        AdfComponentsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;

    changePasswordService = TestBed.inject(ChangePasswordService) as jasmine.SpyObj<ChangePasswordService>;
    authenticationService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    passwordValidationService = TestBed.inject(PasswordValidationService) as jasmine.SpyObj<PasswordValidationService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    error = TestBed.inject(ErrorMessageService) as jasmine.SpyObj<ErrorMessageService>;
    changeLanguageService = TestBed.inject(ChangeLanguageService) as jasmine.SpyObj<ChangeLanguageService>;
    styleManagement = TestBed.inject(StyleManagementService) as jasmine.SpyObj<StyleManagementService>;
    parameterManager = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    changeLanguageService.getCodeLanguage.and.returnValue(of());
    parameterManager.getParameter.and.returnValue({typeToken: true, requiredToken: true});

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
