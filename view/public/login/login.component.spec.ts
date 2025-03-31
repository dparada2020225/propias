import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdfButtonComponent, AdfComponentsModule, AdfInputComponent, SnackBarComponent} from '@adf/components';
import {AuthenticationService, StorageService} from '@adf/security';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBarModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, Router, UrlTree} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {Observable, of, throwError} from 'rxjs';
import {EProfile} from 'src/app/enums/profile.enum';
import {CustomPhonePipe} from 'src/app/pipes/custom-phone.pipe';
import {SmartCoreService} from 'src/app/service/common/smart-core.service';
import {StyleManagementService} from 'src/app/service/common/style-management.service';
import {CheckProfileService} from 'src/app/service/general/check-profile.service';
import {WorkerService} from 'src/app/service/general/worker.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {StateManagerService} from 'src/app/service/private-main/state-manager.service';
import {SecurityService} from 'src/app/service/private/security.service';
import {TokenService} from 'src/app/service/private/token/token.service';
import {MenuService} from 'src/app/service/shared/menu.service';
import {mockModal} from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import {LocalStorageServiceMock} from 'src/assets/mocks/public/mockLocalStorageServiceMock';
import {MockTranslatePipe} from 'src/assets/mocks/public/tranlatePipeMock';
import {mockObservable, mockObservableError} from 'src/assets/testing';
import {environment} from 'src/environments/environment';
import defaultSettingsJson from '../../../../assets/settings/settings-data.json';
import {LoginComponent} from './login.component';

xdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let formBuilder: FormBuilder;
  let router: Router;
  let authenticationService: jasmine.SpyObj<AuthenticationService>;
  let smartCore: jasmine.SpyObj<SmartCoreService>;
  let menuService: MenuService;
  let checkProfileService: CheckProfileService;
  let tokenService: TokenService;
  let securityService: jasmine.SpyObj<SecurityService>;
  let stateManagerTestService: StateManagerService;
  let modalService: jasmine.SpyObj<NgbModal>;
  let styleManagement: StyleManagementService;
  let parameterManager: jasmine.SpyObj<ParameterManagementService>;
  let translate: jasmine.SpyObj<TranslateService>;
  let snackBarComponent: SnackBarComponent; // Mocked snackBarComponent

  let mockUrlTree: UrlTree;
  let mockForm: FormGroup;

  beforeEach(async () => {
    const authenticationServiceSpy = jasmine.createSpyObj('AuthenticationService', [
      'currentTokenValue',
      'personalizationIntegrity',
      'login',
      'logout',
    ]);
    const smartCoreSpy = jasmine.createSpyObj('SmartCoreService', ['personalizationOperation']);
    const securityServiceSpy = jasmine.createSpyObj('SecurityService', ['getUserInfo']);
    const workerServiceSpy = jasmine.createSpyObj('WorkerService', ['checkForUpdates']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    const parameterManagerSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters', 'getParameter']);
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent, CustomPhonePipe, AdfButtonComponent, MockTranslatePipe, AdfInputComponent],
      providers: [
        LoginComponent,
        LocalStorageServiceMock,
        {provide: AuthenticationService, useValue: authenticationServiceSpy},
        {provide: TranslateService, useValue: null},
        {provide: SmartCoreService, useValue: smartCoreSpy},
        {provide: StorageService, useClass: LocalStorageServiceMock},
        {provide: SecurityService, useValue: securityServiceSpy},
        {provide: WorkerService, useValue: workerServiceSpy},
        {provide: NgbModal, useValue: modalServiceSpy},
        {provide: ParameterManagementService, useValue: parameterManagerSpy},
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                returnUrl: 'http://localhost/login',
              },
            },
          },
        },
        {provide: TranslateService, useValue: translateSpy},
        SnackBarComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        AdfComponentsModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    formBuilder = TestBed.inject(FormBuilder);
    router = TestBed.inject(Router);
    tokenService = TestBed.inject(TokenService);
    menuService = TestBed.inject(MenuService);
    stateManagerTestService = TestBed.inject(StateManagerService);
    authenticationService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    smartCore = TestBed.inject(SmartCoreService) as jasmine.SpyObj<SmartCoreService>;
    checkProfileService = TestBed.inject(CheckProfileService);
    securityService = TestBed.inject(SecurityService) as jasmine.SpyObj<SecurityService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    styleManagement = TestBed.inject(StyleManagementService);
    parameterManager = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    snackBarComponent = TestBed.inject(SnackBarComponent);

    mockUrlTree = router.createUrlTree([], {
      queryParams: {
        token: 'token simulado',
        institucion: 'institución simulada',
      },
    });

    formBuilder = new FormBuilder();
    mockForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      token: [''],
    });

    component.loginForm = mockForm;

    spyOn(router, 'parseUrl').and.returnValue(mockUrlTree);
    spyOn(stateManagerTestService, 'getData').and.returnValue(of(new Observable()));
    spyOn(tokenService, 'errorLoggingEvent').and.returnValue(new EventEmitter());
    spyOn(menuService, 'errorLoggingEvent').and.returnValue(new EventEmitter());
    spyOn(checkProfileService, 'errorLoggingEvent').and.returnValue(new EventEmitter());
    spyOn(snackBarComponent, 'openSnackBar').and.callThrough();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true is corporateImageApplication', () => {
    spyOn(styleManagement, 'corporateImageApplication').and.returnValue(true);
    const rta = component.corporateImageApplication();
    expect(rta).toBeTruthy();
  });

  it('should get Country Login Bisv', () => {
    environment.profile = EProfile.SALVADOR;
    component.getCountryLogin();
    expect(component.countryLogin).toEqual('country_login');
  });

  it('should get Country Login bipa', () => {
    environment.profile = EProfile.PANAMA;
    component.getCountryLogin();
    expect(component.countryLogin).toEqual('country_login');
  });

  it('should get startSmartCore', () => {
    component.startSmartCore();
    expect(smartCore.personalizationOperation).toHaveBeenCalledWith({
      model: {
        channelId: 0,
        transaction: {
          category: 'login',
          type: 'traditional',
          description: 'login',
        },
      },
    });
  });

  it('it was called function buttonClicked but form is wrong', () => {
    component.buttonClicked();
    expect(component.showAlert).toBeFalsy();
    expect(component.loading).toBeFalsy();
    expect(component.submitted).toBeTruthy();
    expect(authenticationService.personalizationIntegrity).toHaveBeenCalled();
    expect(component.loginForm.markAllAsTouched).toBeTruthy();
  });

  it('it was called function buttonClicked WHEN form is valid and go to login Handler', () => {
    spyOn(component, 'loginHandler');
    authenticationService.login.and.returnValue(
      mockObservable({
        access_token: 'token',
        app_id: 'app_id',
        expires_in: new Uint8Array([100]),
        fullname: 'fullname',
        jti: 'j',
        key: 'key',
        required_token: true,
        scope: 'scope',
        token_type: 'A',
        device_status: '#',
      })
    );
    component.loginForm.controls['username'].setValue('valid_username');
    component.loginForm.controls['password'].setValue('valid_password');
    fixture.detectChanges();
    component.buttonClicked();
    expect(component.showAlert).toBeFalsy();
    expect(component.loading).toBeTruthy();
    expect(component.submitted).toBeTruthy();
    expect(authenticationService.personalizationIntegrity).toHaveBeenCalled();
    expect(component.loginForm.valid).toBeTruthy();
    expect(component.loginHandler).toHaveBeenCalled();
  });

  it('it was called function buttonClicked WHEN form is valid but authenticationService failed', () => {
    spyOn(component, 'loginErrorHandler');
    authenticationService.login.and.returnValue(mockObservableError({}));
    component.loginForm.controls['username'].setValue('valid_username');
    component.loginForm.controls['password'].setValue('valid_password');
    fixture.detectChanges();
    component.buttonClicked();
    expect(component.showAlert).toBeFalsy();
    expect(component.loading).toBeTruthy();
    expect(component.submitted).toBeTruthy();
    expect(authenticationService.personalizationIntegrity).toHaveBeenCalled();
    expect(component.loginForm.valid).toBeTruthy();
    expect(component.loginErrorHandler).toHaveBeenCalled();
  });

  it('should handle error code 104', () => {
    const errorData = {
      error: {
        code: '104',
        message: 'Invalid credentials',
      },
      status: 401,
    };
    spyOn(component, 'handlerErrorCode104Login');
    component.loginErrorHandler(errorData);
    expect(component.handlerErrorCode104Login).toHaveBeenCalledWith(errorData);
    expect(component.error).toBe('');
  });

  it('should handle error code 901', () => {
    const errorData = {
      error: {
        code: '901',
        message: 'Account locked',
      },
      status: 401,
    };
    spyOn(component, 'handlerErrorCode901Login');
    component.loginErrorHandler(errorData);
    expect(component.handlerErrorCode901Login).toHaveBeenCalled();
    expect(component.error).toBe('');
  });

  it('should handle error code 902', () => {
    const errorData = {
      error: {
        code: '902',
        message: 'Account expired',
      },
      status: 401,
    };
    spyOn(component, 'handlerErrorCode902Login');
    component.loginErrorHandler(errorData);
    expect(component.handlerErrorCode902Login).toHaveBeenCalled();
    expect(component.error).toBe('');
  });

  it('should handle error code other', () => {
    const errorData = {
      error: {
        code: 'other',
        message: 'Account expired',
      },
      status: 401,
    };
    component.loginErrorHandler(errorData);
    expect(component.error).toBe(errorData.error.message);
  });

  it('should handle error code null', () => {
    const error: string = 'error.http.500';
    translate.instant.and.returnValue(error);
    component.loginErrorHandler(null);
    expect(component.error).toEqual(error);
  });

  it('should handler Error Code 104 Login', () => {
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    const errorData = {
      error: {
        message: 'Error message, typeToken, requiredToken',
      },
    };

    component.handlerErrorCode104Login(errorData);
    expect(parameterManager.sendParameters).toHaveBeenCalledWith({
      requiredToken: ' requiredToken',
      typeToken: ' typeToken',
    });
    expect(router.navigate).toHaveBeenCalledWith(['/change-password']);
  });

  it('should handler Error Code 902 Login', () => {
    modalService.open.and.returnValue(mockModal as NgbModalRef);
    component.handlerErrorCode902Login();
    expect(modalService.open).toHaveBeenCalled();
  });

  it('should call getUserInfo if requiredToken is false', () => {
    securityService.getUserInfo.and.returnValue(mockObservable({}));
    spyOn(component, 'userInfohandler');
    component.loginHandler({required_token: false});
    expect(securityService.getUserInfo).toHaveBeenCalled();
    expect(component.userInfohandler).toHaveBeenCalled();
  });

  it('should call getUserInfo if requiredToken is false and securityService response failed', () => {
    securityService.getUserInfo.and.returnValue(mockObservableError({}));
    spyOn(component, 'getMenuData');
    component.loginHandler({required_token: false});
    expect(securityService.getUserInfo).toHaveBeenCalled();
    expect(component.getMenuData).toHaveBeenCalled();
  });

  it('should call getUserInfo if requiredToken is true', () => {
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.loginHandler({required_token: true});
    expect(router.navigate).toHaveBeenCalledWith(['/token']);
  });

  it('should get user info handler', () => {
    spyOn(component, 'getMenuData');
    component.userInfohandler('data fake');
    expect(component.userInformation).toEqual('data fake');
    expect(component.getMenuData).toHaveBeenCalled();
  });

  it('should session Is Active ', () => {
    modalService.open.and.returnValue(mockModal as NgbModalRef);
    component.sessionIsActive();
    expect(modalService.open).toHaveBeenCalled();
  });

  it('test_user_cancels_password_change', () => {
    const modalServiceSpy = modalService.open.and.returnValue({
      result: Promise.resolve(false),
      componentInstance: {
        data: {},
      },
    } as any);
    const buttonClickedSpy = spyOn(component, 'buttonClicked').and.callThrough();
    component.sessionIsActive();
    expect(modalServiceSpy).toHaveBeenCalled();
    expect(buttonClickedSpy).not.toHaveBeenCalled();
  });

  it('should add userMenu and userLoggedIn to storage', () => {
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    const data = {body: [{service: 'mnu-admin', child: []}]};
    spyOn(menuService, 'getMenu').and.returnValue(of(data as any));
    component.userInformation = {userType: 'A'};

    component.getMenuData();

    expect(router.navigate).toHaveBeenCalledWith(['/routing-security-option']);
  });

  it('should handle error and set loading to false', () => {
    spyOn(menuService, 'getMenu').and.returnValue(throwError(() => ({statusText: 'error'})));
    component.getMenuData();
    expect(component.loading).toBe(false);
  });

  it('should navigate to recover password', () => {
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.recoverPassword();
    expect(router.navigate).toHaveBeenCalledWith(['/recover-password']);
  });

  it('should stateManager', () => {
    spyOn(stateManagerTestService, 'accountant');
    component.stateManager();
    expect(stateManagerTestService.accountant).toHaveBeenCalled();
  });

  it('should is Show Alert Class Name', () => {
    component.showAlert = true;
    expect(component.isShowAlertClassName).toEqual('');
  });

  // Tests that encryptionTest is true, storage is updated and snackbar is opened with success message
  it('test_encryption_true', () => {
    component.encryptionTest = true;
    component.showAlertTest(true);
    expect(snackBarComponent.openSnackBar).toBeDefined();
    expect(translate.instant).toHaveBeenCalledWith('Cifrado híbrido activado');
  });

  // Tests that blockingTimeTest is true, storage is updated and snackbar is opened with success message
  it('test_blocking_time_true', () => {
    component.blockingTimeTest = true;
    component.showAlertTest(true);
    expect(snackBarComponent.openSnackBar).toBeDefined();
    expect(translate.instant).toHaveBeenCalledWith('Tiempo de bloqueo de 10 min activado');
  });

  // Tests that encryptionTest and blockingTimeTest are true, storage is updated and snackbar is opened with success message
  it('test_encryption_blocking_time_true', () => {
    component.encryptionTest = true;
    component.blockingTimeTest = true;
    component.showAlertTest(true);
    expect(snackBarComponent.openSnackBar).toBeDefined();
    expect(translate.instant).toHaveBeenCalledWith('Cifrado híbrido y tiempo de bloqueo de 10 min activado');
  });

  // Tests that encryptionTest is false, storage is updated and snackbar is opened with error message
  it('test_encryption_false', () => {
    component.encryptionTest = true;
    component.showAlertTest(false);
    expect(snackBarComponent.openSnackBar).toBeDefined();
    expect(translate.instant).toHaveBeenCalledWith(
      'Encriptación híbrida desactivada (si se desactiva antes del login no se podra activar hasta hacer logout)'
    );
  });

  // Tests that blockingTimeTest is false, storage is updated and snackbar is opened with error message
  it('test_blocking_time_false', () => {
    component.encryptionTest = false;
    component.blockingTimeTest = true;
    component.showAlertTest(false);
    expect(snackBarComponent.openSnackBar).toBeDefined();
    expect(translate.instant).toHaveBeenCalledWith('Tiempo de bloqueo de 10 min cambiado a 30 segundos');
  });

  // Tests that encryptionTest and blockingTimeTest are false, storage is updated and snackbar is opened with error message
  it('test_encryption_blocking_time_false', () => {
    component.encryptionTest = true;
    component.blockingTimeTest = true;
    component.showAlertTest(false);
    expect(snackBarComponent.openSnackBar).toBeDefined();
    expect(translate.instant).toHaveBeenCalledWith(
      'Encriptación híbrida desactivada (si se desactiva antes del login no se podra activar hasta hacer logout) y tiempo de bloqueo de 10 min cambiado a 30 segundos'
    );
  });

  it('test_happy_path_login_banners_is_null_or_undefined', () => {
    component.settingsData = null as any;

    component.getPublicBanners();

    expect(component.imageDesktopList).toEqual(defaultSettingsJson[environment.profile].loginBanners.pc);
    expect(component.imageTabletList).toEqual(defaultSettingsJson[environment.profile].loginBanners.tablet);
  });
});
