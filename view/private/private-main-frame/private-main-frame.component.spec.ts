import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {ChangeLanguageService} from '@adf/components';
import {AuthenticationService, StorageService} from '@adf/security';
import {ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Idle} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import {TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {of, Subscription} from 'rxjs';
import {EProfile} from 'src/app/enums/profile.enum';
import {StyleManagementService} from 'src/app/service/common/style-management.service';
import {UtilService} from 'src/app/service/common/util.service';
import {CheckProfileService} from 'src/app/service/general/check-profile.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {CurrenciesService} from 'src/app/service/private-main/currencies.service';
import {ExchangeRateService} from 'src/app/service/private-main/exchange-rate.service';
import {PermissionsService} from 'src/app/service/private-main/permissions.service';
import {PrivateMainFrameService} from 'src/app/service/private-main/private-main-frame.service';
import {StateManagerService} from 'src/app/service/private-main/state-manager.service';
import {RestarIldeService} from 'src/app/service/private/restar-ilde.service';
import {SecurityService} from 'src/app/service/private/security.service';
import {StepService} from 'src/app/service/private/step.service';
import {TimeoutService} from 'src/app/service/private/time-out/timeout.service';
import {MenuService} from 'src/app/service/shared/menu.service';
import {LocalStorageServiceMock} from 'src/assets/mocks/public/mockLocalStorageServiceMock';
import {MockTranslatePipe} from 'src/assets/mocks/public/tranlatePipeMock';
import {environment} from 'src/environments/environment';
import {PrivateMainFrameComponent} from './private-main-frame.component';
import {RcExecuteFlowService} from 'src/app/service/private/regional-connection/rc-execute-flow.service';

class MenuServiceMock {
  menuLoadEvent = {
    emit: jasmine.createSpy('emit'),
    subscribe: jasmine.createSpy('subscribe'),
  };
}

class ChangeLanguageServiceMock {
  getCodeLanguage() {
    return of();
  }
}

class StateManagerServiceMock {
  getData() {
    return of();
  }
}

class KeepaliveMock {
  interval() {
    return;
  }

  onPing = {
    subscribe: jasmine.createSpy('subscribe'),
  };
}

class IdleMock {
  onIdleStart = {
    subscribe: jasmine.createSpy('subscribe'),
  };
  onIdleEnd = {
    subscribe: jasmine.createSpy('subscribe'),
  };
  onTimeout = {
    subscribe: jasmine.createSpy('subscribe'),
  };
  onTimeoutWarning = {
    subscribe: jasmine.createSpy('subscribe'),
  };

  setIdle() {
    return;
  }

  setTimeout() {
    return;
  }

  setInterrupts() {
    return;
  }

  watch() {
    return;
  }
}

class RestarIldeServiceMock {
  activeRestar = jasmine.createSpy('activeRestar').and.returnValue({
    subscribe: jasmine.createSpy('subscribe'),
  });
}

class PrivateMainFrameServiceMock {
  getSharedData = jasmine.createSpy('getSharedData').and.returnValue({
    subscribe: jasmine.createSpy('subscribe'),
  });
}

class TimeoutServiceMock {
  getSharedData = jasmine.createSpy('getSharedData').and.returnValue({
    subscribe: jasmine.createSpy('subscribe'),
  });
}

class ExchangeRateServiceMock {
  getExchangeRate = jasmine.createSpy('getExchangeRate').and.returnValue({
    subscribe: jasmine.createSpy('subscribe'),
  });
}

class PermissionsServiceMock {
  isValid = {
    subscribe: jasmine.createSpy('subscribe').and.returnValue(true),
  };
}

xdescribe('PrivateMainFrameComponent', () => {
  let component: PrivateMainFrameComponent;
  let fixture: ComponentFixture<PrivateMainFrameComponent>;

  let authenticationService: jasmine.SpyObj<AuthenticationService>;
  let timeoutService: jasmine.SpyObj<TimeoutService>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let exchangeChange: jasmine.SpyObj<ExchangeRateService>;
  let checkProfileService: jasmine.SpyObj<CheckProfileService>;
  let parameterManagemen: jasmine.SpyObj<ParameterManagementService>;
  let util: jasmine.SpyObj<UtilService>;
  let step: jasmine.SpyObj<StepService>;
  let router: Router;
  let regionalConnectionExecuteService: jasmine.SpyObj<RcExecuteFlowService>;

  beforeEach(async () => {
    const authenticationServiceSpy = jasmine.createSpyObj('AuthenticationService', ['activateTimeoutKeepAliveService', 'logout']);
    const cdRefSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['hide', 'show']);
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    const currencySpy = jasmine.createSpyObj('CurrenciesService', ['getCurrency']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['dismissAll']);
    const checkProfileServiceSpy = jasmine.createSpyObj('CheckProfileService', ['validateUser']);
    const parameterManagemenSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters']);
    const persistStepStateServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters']);
    const styleManagementSpy = jasmine.createSpyObj('StyleManagementService', ['corporateImageApplication']);
    const sanitizerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);
    const utilSpy = jasmine.createSpyObj('UtilService', ['getLoader', 'getUrlTransferOwn', 'resetStorage']);
    const stepSpy = jasmine.createSpyObj('StepService', ['s']);

    await TestBed.configureTestingModule({
      declarations: [PrivateMainFrameComponent, MockTranslatePipe],
      providers: [
        PrivateMainFrameComponent,
        LocalStorageServiceMock,
        MenuServiceMock,
        StateManagerServiceMock,
        ChangeLanguageServiceMock,
        IdleMock,
        KeepaliveMock,
        PrivateMainFrameServiceMock,
        RestarIldeServiceMock,
        TimeoutServiceMock,
        ExchangeRateServiceMock,
        PermissionsServiceMock,
        {provide: AuthenticationService, useValue: authenticationServiceSpy},
        {provide: ChangeDetectorRef, useValue: cdRefSpy},
        {provide: Idle, useClass: IdleMock},
        {provide: Keepalive, useClass: KeepaliveMock},
        {provide: PrivateMainFrameService, useClass: PrivateMainFrameServiceMock},
        {provide: TimeoutService, useClass: TimeoutServiceMock},
        {provide: SecurityService, useValue: {}},
        {provide: NgxSpinnerService, useValue: spinnerSpy},
        {provide: TranslateService, useValue: translateSpy},
        {provide: ExchangeRateService, useClass: ExchangeRateServiceMock},
        {provide: CurrenciesService, useValue: currencySpy},
        {provide: StateManagerService, useClass: StateManagerServiceMock},
        {provide: NgbModal, useValue: modalServiceSpy},
        {provide: CheckProfileService, useValue: checkProfileServiceSpy},
        {provide: ParameterManagementService, useValue: parameterManagemenSpy},
        {provide: PermissionsService, useClass: PermissionsServiceMock},
        {provide: RestarIldeService, useClass: RestarIldeServiceMock},
        {provide: ParameterManagementService, useValue: persistStepStateServiceSpy},
        {provide: StyleManagementService, useValue: styleManagementSpy},
        {provide: ChangeLanguageService, useClass: ChangeLanguageServiceMock},
        {provide: DomSanitizer, useValue: sanitizerSpy},
        {provide: UtilService, useValue: utilSpy},
        {provide: StepService, useValue: stepSpy},
        {provide: StorageService, useClass: LocalStorageServiceMock},
        {provide: MenuService, useClass: MenuServiceMock},
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              firstChild: {
                data: 'data',
              },
              data: {
                userInfo: {
                  expiryTime: 10,
                  firstName: 'John',
                  firstLastname: 'Smith',
                },
              },
            },
          },
        },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivateMainFrameComponent);
    component = fixture.componentInstance;

    authenticationService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    timeoutService = TestBed.inject(TimeoutService) as jasmine.SpyObj<TimeoutService>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    exchangeChange = TestBed.inject(ExchangeRateService) as jasmine.SpyObj<ExchangeRateService>;
    checkProfileService = TestBed.inject(CheckProfileService) as jasmine.SpyObj<CheckProfileService>;
    parameterManagemen = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    step = TestBed.inject(StepService) as jasmine.SpyObj<StepService>;
    timeoutService.getSharedData.and.returnValue(of());
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get Exchange Rate', () => {
    exchangeChange.getExchangeRate.and.returnValue(
      of([
        {
          buy: {exchange: 'buy'},
          sell: {exchange: 'sell'},
        },
      ])
    );
    environment.profile = EProfile.HONDURAS;
    component.getExchangeRate();
    expect(component.getExchangeRate).toBeDefined();
    expect(exchangeChange.getExchangeRate).toHaveBeenCalled();
    expect(component.buyAmount).toEqual('buy');
    expect(component.sellAmount).toEqual('sell');
  });

  it('should call preLoggedGuard and logout if preLoggedGuard returns true', () => {
    spyOn(component, 'preLoggedGuard').and.returnValue(true);
    spyOn(component, 'logout');
    component.onPopState(null);
    expect(component.preLoggedGuard).toHaveBeenCalled();
    expect(component.logout).toHaveBeenCalledWith('login');
  });

  it('should restar Idle', () => {
    component.restarIdle();
    expect(component.idleState).toEqual('NOT_IDLE');
    expect(component.countdown).toBeUndefined();
    expect(component.lastPing).toBeUndefined();
    expect(component.timedOut).toBeFalsy();
  });

  it('should go To Home', () => {
    component.home = 'home';
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.goToHome();
    expect(router.navigate).toHaveBeenCalledWith(['home']);
    expect(parameterManagemen.sendParameters).toHaveBeenCalled();
  });

  it('should go To Transfer', () => {
    util.getUrlTransferOwn.and.returnValue('transfer/own');
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.goToTransfer();
    expect(router.navigate).toHaveBeenCalledWith(['transfer/own']);
  });

  it('should navigate to login page if preLogoutNavigation returns true', () => {
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    spyOn(component, 'preLogoutNavigation').and.returnValue(true);
    component.logout();
    expect(router.navigate).toHaveBeenCalledWith(['login']);
    expect(spinner.hide).toHaveBeenCalledWith('main-spinner-logout');
  });

  it('should call authenticationService.logout and navigate to login page after 5 seconds if preLogoutNavigation returns false', fakeAsync(() => {
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    spyOn(component, 'preLogoutNavigation').and.returnValue(false);
    authenticationService.logout.and.returnValue(of(null) as any);
    component.logout();
    tick(5000);
    expect(router.navigate).not.toHaveBeenCalledWith(['login']);
    expect(spinner.hide).toHaveBeenCalledWith('main-spinner-logout');
  }));

  it('should return true if router URL contains "change-password"', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('http://localhost/change-password');
    expect(component.preLogoutNavigation()).toBeTrue();
  });

  it('should return false if router URL does not contain "change-password"', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('http://localhost/some-other-page');
    expect(component.preLogoutNavigation()).toBeFalse();
  });

  it('should navigate', () => {
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.navigate('test');
    expect(router.navigate).toHaveBeenCalledWith(['/test']);
    expect(component.isMenuCollapsed).toBeTruthy();
  });

  it('should return true if the URL matches a light navbar item', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/logout');
    expect(component.lightNavbar()).toBeTrue();
  });

  it('should return false if the URL does not match a light navbar item', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/non-light-navbar-item');
    expect(component.lightNavbar()).toBeFalse();
  });

  it('should return true if URL contains preLoggedGuardList element', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('change-password');
    expect(component.preLoggedGuard()).toBeTrue();
  });

  it('should return false if URL does not contain preLoggedGuardList element', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/some-other-url');
    expect(component.preLoggedGuard()).toBeFalse();
  });

  it('should imageNavigate', () => {
    spyOn(component, 'handleValidateUserPreLogged');
    component.imageNavigate();
    expect(component.handleValidateUserPreLogged).toHaveBeenCalled();
  });

  it('should navigate to login if preLoggedGuard returns true and validateUserService returns 0', () => {
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    spyOn(component, 'preLoggedGuard').and.returnValue(true);
    checkProfileService.validateUser.and.returnValue(of({postponeTimes: 2}));

    component.handleValidateUserPreLogged();

    expect(checkProfileService.validateUser).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to home if component is home and component is not private-help', () => {
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    spyOn(component, 'preLoggedGuard').and.returnValue(false);
    component.simpleNavbar = false;

    component.handleValidateUserPreLogged();

    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should call handleShowAlertForEncryptionTest with true status when encryptionTest is true', () => {
    spyOn(component, 'handleShowAlertForEncryptionTest');
    component.encryptionTest = true;
    component.showAlertTest(true);
    expect(component.handleShowAlertForEncryptionTest).toHaveBeenCalledWith(true);
  });

  it('should call handleShowAlertForBlockingTimeTest with true status when blockingTimeTest is true', () => {
    spyOn(component, 'handleShowAlertForBlockingTimeTest');
    component.blockingTimeTest = true;
    component.showAlertTest(true);
    expect(component.handleShowAlertForBlockingTimeTest).toHaveBeenCalledWith(true);
  });

  it('should unsubscribe from menuLoadSubscription', () => {
    const menuLoadSubscription = new Subscription();
    component.menuLoadSubscription = menuLoadSubscription;

    component.ngOnDestroy();

    expect(menuLoadSubscription.closed).toBe(true);
  });

  it('should unsubscribe from onIdleStartSubscription', () => {
    const onIdleStartSubscription = new Subscription();
    component.onIdleStartSubscription = onIdleStartSubscription;

    component.ngOnDestroy();

    expect(onIdleStartSubscription.closed).toBe(true);
  });

  it('should unsubscribe from onIdleEndSubscription', () => {
    const onIdleEndSubscription = new Subscription();
    component.onIdleEndSubscription = onIdleEndSubscription;

    component.ngOnDestroy();

    expect(onIdleEndSubscription.closed).toBe(true);
  });

  it('should unsubscribe from onTimeoutSubscription', () => {
    const onTimeoutSubscription = new Subscription();
    component.onTimeoutSubscription = onTimeoutSubscription;

    component.ngOnDestroy();

    expect(onTimeoutSubscription.closed).toBe(true);
  });

  it('should unsubscribe from onTimeoutWarningSubscription', () => {
    const onTimeoutWarningSubscription = new Subscription();
    component.onTimeoutWarningSubscription = onTimeoutWarningSubscription;

    component.ngOnDestroy();

    expect(onTimeoutWarningSubscription.closed).toBe(true);
  });

  it('should unsubscribe from onPingSubscription', () => {
    const onPingSubscription = new Subscription();
    component.onPingSubscription = onPingSubscription;

    component.ngOnDestroy();

    expect(onPingSubscription.closed).toBe(true);
  });

  it('should return undefined if regional connection URL is not present in settings', () => {
    component.profile = EProfile.SALVADOR;
    const result = component.linkRegionalConnection;
    expect(result).toBeUndefined();
  });

  it('should handle Expiry Time', () => {
    component.profile = EProfile.SALVADOR;
    step.s.and.returnValue('12');
    component.handleExpiryTime();
    expect(environment.blockingTime).toEqual(12);
  });

  it('should storage and show call in ngOnInit', () => {
    component.blockingTimeTest = true;
    environment.profile = EProfile.SALVADOR;
    component.ngOnInit();
    expect(component.timeOut).toBeTruthy();
    expect(component.show).toBeTruthy();
  });

  it('should call execute method when regional connection status is true', async () => {
    // Arrange
    const regionalConnectionStatus = true;
    spyOn(regionalConnectionExecuteService, 'validateRegionalConnectionStatus').and.returnValue(Promise.resolve(regionalConnectionStatus));
    spyOn(regionalConnectionExecuteService, 'execute');

    // Act
    await component.executeRegionalConnection();

    // Assert
    expect(regionalConnectionExecuteService.execute).toHaveBeenCalled();
  });

});
