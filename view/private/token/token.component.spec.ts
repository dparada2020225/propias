import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdfButtonComponent, AdfComponentsModule, AdfInputComponent} from '@adf/components';
import {AuthenticationService, StorageService} from '@adf/security';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {StyleManagementService} from 'src/app/service/common/style-management.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {SecurityService} from 'src/app/service/private/security.service';
import {SecureIndentityService} from 'src/app/service/private/token/secure-indentity.service';
import {TokenService} from 'src/app/service/private/token/token.service';
import {MenuService} from 'src/app/service/shared/menu.service';
import {mockModal} from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import {MockTranslatePipe} from 'src/assets/mocks/public/tranlatePipeMock';
import {clickElement, mockObservable, mockObservableError, mockPromise} from 'src/assets/testing';
import {TokenComponent} from './token.component';

class TokenServiceMock {
  errorLoggingEvent = {
    subscribe: jasmine.createSpy('subscribe'),
  }

  notifyErrorToLogin(): any {
    return {
      message: 'test'
    }
  }

  getTokenValidate(): any {
    return mockObservable({status: 200})
  }

  tokenGenerate(): any {
    return mockObservable({message: 'token', code: '0', digitCode: '10'})
  }

}

describe('TokenComponent', () => {
  let component: TokenComponent;
  let fixture: ComponentFixture<TokenComponent>;

  let route: jasmine.SpyObj<Router>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let secureIndentityService: jasmine.SpyObj<SecureIndentityService>;
  let authenticationService: jasmine.SpyObj<AuthenticationService>;
  let menuService: jasmine.SpyObj<MenuService>;
  let storage: jasmine.SpyObj<StorageService>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let parameterManager: jasmine.SpyObj<ParameterManagementService>;
  let formBuilder: FormBuilder;


  beforeEach(async () => {

    const routeSpy = jasmine.createSpyObj('Router', ['navigate'])
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['dismissAll', 'open'])
    const secureIndentityServiceSpy = jasmine.createSpyObj('SecureIndentityService', ['getAutoSync', 'manualSync'])
    const authenticationServiceSpy = jasmine.createSpyObj('AuthenticationService', ['logout', 'registerSecureNavigation'])
    const menuServiceSpy = jasmine.createSpyObj('MenuService', ['getMenu', 'notifyMenuLoaded'])
    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem', 'addItem'])
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide'])
    const securityServiceSpy = jasmine.createSpyObj('SecurityService', [''])
    const parameterManagerSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter'])
    const StyleManagementServiceSpy = jasmine.createSpyObj('StyleManagementService', ['corporateImageApplication'])

    await TestBed.configureTestingModule({
      declarations: [TokenComponent, AdfInputComponent, AdfButtonComponent, MockTranslatePipe],
      providers: [
        TokenServiceMock,
        {provide: Router, useValue: routeSpy},
        {provide: NgbModal, useValue: modalServiceSpy},
        {provide: SecureIndentityService, useValue: secureIndentityServiceSpy},
        {provide: AuthenticationService, useValue: authenticationServiceSpy},
        {provide: MenuService, useValue: menuServiceSpy},
        {provide: StorageService, useValue: storageSpy},
        {provide: StorageService, useValue: storageSpy},
        {provide: NgxSpinnerService, useValue: spinnerSpy},
        {provide: SecurityService, useValue: securityServiceSpy},
        {provide: ParameterManagementService, useValue: parameterManagerSpy},
        {provide: StyleManagementService, useValue: StyleManagementServiceSpy},
        {
          provide: ActivatedRoute, useValue: {

            snapshot: {
              data: {
                tokenType: 'S'
              }
            }

          }
        },
        {provide: TokenService, useClass: TokenServiceMock}
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        ReactiveFormsModule,
        FormsModule,
        AdfComponentsModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TokenComponent);
    component = fixture.componentInstance;

    route = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    secureIndentityService = TestBed.inject(SecureIndentityService) as jasmine.SpyObj<SecureIndentityService>;
    authenticationService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    menuService = TestBed.inject(MenuService) as jasmine.SpyObj<MenuService>;
    storage = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    parameterManager = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    formBuilder = TestBed.inject(FormBuilder);

    spinner.show.and.returnValue(mockPromise(true));
    spinner.hide.and.returnValue(mockPromise(true));

    storage.getItem.and.returnValue(
      JSON.stringify({
        token: {
          sms: {
            min: 4,
            max: 6
          },
          physical: {
            max: 4,
            min: 6
          },
        }
      })
    );


    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should back To Login when show is true', () => {
    component.show = true;
    clickElement(fixture, 'backToLogin', true)
    fixture.detectChanges();
    expect(spinner.show).toHaveBeenCalledWith('main-spinner')
    expect(modalService.dismissAll).toHaveBeenCalled();
    expect(authenticationService.logout).toHaveBeenCalled();
  })

  it('should back To Login when show is false', () => {
    component.show = false;
    clickElement(fixture, 'backToLogin', true)
    fixture.detectChanges();
    expect(component.show).toBeTruthy();
  })

  it('clock when form have error´s and show is true', () => {
    clickElement(fixture, 'clock', true)
    fixture.detectChanges();
    expect(component.tokenForm.markAllAsTouched).toBeTruthy();
    expect(component.tokenForm.controls['token'].errors).toBeTruthy();
  })

  it('clock when form VALID, attempCounter < 3 and show is true', () => {
    spyOn(component, 'handleValidateToken')
    component.tokenForm.patchValue({
      token: '12345'
    })
    component.attemptCounter = 1
    clickElement(fixture, 'clock', true)
    fixture.detectChanges();
    expect(component.tokenForm.controls['token'].errors).toBeNull();
    expect(component.handleValidateToken).toHaveBeenCalled();
  })

  it('clock when form VALID, attempCounter > 3 and show is true', () => {
    spyOn(component, 'handleAutoSyncToken')
    component.tokenForm.patchValue({
      token: '12345'
    })
    component.attemptCounter = 4
    clickElement(fixture, 'clock', true)
    fixture.detectChanges();
    expect(component.tokenForm.controls['token'].errors).toBeNull();
    expect(component.handleAutoSyncToken).toHaveBeenCalled();
  })

  it('should handle Validate Token', () => {
    spyOn(component, 'getMenuData')
    component.tokenForm.patchValue({
      token: '12345'
    })

    component.handleValidateToken();
    expect(component.getMenuData).toHaveBeenCalled()
  })

  it('should handle Validate Token have error', () => {
    const serv = TestBed.inject(TokenService)
    spyOn(serv, 'getTokenValidate').and.returnValue(mockObservableError({
      message: 'Validation Error',
      error: {message: 'Validation Error'}
    }))
    component.handleValidateToken();
    expect(component.errors).toBeTruthy()
    expect(component.showMessage).toBeTruthy()
  })

  it('should handle Validate Token have error with type token "F"', () => {
    component.tokenTypeResponse = 'F'
    const serv = TestBed.inject(TokenService)
    spyOn(serv, 'getTokenValidate').and.returnValue(mockObservableError({status: 400}))
    component.handleValidateToken();
    expect(component.tokenValidateStatus).toEqual(400)
    expect(component.errors).toBeTruthy()
    expect(component.showMessage).toBeTruthy()
  })

  it('should handle Auto Sync Token', () => {
    component.tokenForm.patchValue({
      token: '12345'
    })
    secureIndentityService.getAutoSync.and.returnValue(mockObservable({} as any))
    component.handleAutoSyncToken();

    expect(component.attemptCounter).toBe(0)
    expect(component.remainingAttempts).toBe(3)
    expect(component.autoSync).toBeTruthy();
  })

  it('should handle Auto Sync Token but have error http', () => {
    modalService.open.and.returnValue(mockModal as NgbModalRef)
    component.tokenForm.patchValue({
      token: '12345'
    })
    secureIndentityService.getAutoSync.and.returnValue(mockObservableError({} as any))
    component.handleAutoSyncToken();

    expect(component.attemptCounter).toBe(0)
    expect(component.remainingAttempts).toBe(3)
    expect(component.show).toBeFalsy();
    expect(modalService.open).toHaveBeenCalled()
  })

  it('should handle Manual Sync Token', () => {
    const formGroup: FormGroup = formBuilder.group({
      vclock: ['12345', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      vclockDos: ['12345', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
    });
    component.vclockForm = formGroup;
    secureIndentityService.manualSync.and.returnValue(mockObservable({}))
    component.handleManualSyncToken();
    expect(component.autoSync).toBeTruthy();
    expect(component.show).toBeTruthy();
  })

  it('should handle Manual Sync Token BUT have an error', () => {
    const formGroup: FormGroup = formBuilder.group({
      vclock: ['12345', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      vclockDos: ['12345', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
    });
    component.vclockForm = formGroup;
    secureIndentityService.manualSync.and.returnValue(mockObservableError({}))
    component.handleManualSyncToken();
    expect(component.autoSync).toBeTruthy();
    expect(component.show).toBeTruthy();
  })

  it('should get menu data', () => {
    route.navigate.and.returnValue(mockPromise(true))
    parameterManager.getParameter.and.returnValue({userType: 'A'})
    menuService.getMenu.and.returnValue(mockObservable({
      body: [
        {
          service: 'mnu-admin',
          child: []
        }
      ]
    }))
    component.getMenuData({status: 200});

    expect(storage.addItem).toHaveBeenCalled();
    expect(menuService.notifyMenuLoaded).toHaveBeenCalled();
    expect(component.tokenValidateStatus).toEqual(200)
    expect(authenticationService.registerSecureNavigation).toHaveBeenCalled();
    expect(route.navigate).toHaveBeenCalledWith(["/routing-security-option"])
  })

  it('should get menu data have an error', () => {

    menuService.getMenu.and.returnValue(mockObservableError({
      status: 400,
      message: 'error test'
    }))

    component.getMenuData({status: 400});

    expect(component.tokenValidateStatus).toEqual(400)
    expect(component.attemptCounter).toEqual(1)
    expect(component.remainingAttempts).toEqual(2)
  })

  it('should open Alert', () => {

    const type = 'success'
    const message = 'Login succesfully'

    component.openAlert(type, message)

    expect(component.show).toBeTruthy()
    expect(component.messageAlert).toEqual(message)

  })

});
