import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdfComponentsModule, AdfInputComponent} from '@adf/components';
import {AuthenticationService, StorageService} from '@adf/security';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {of, Subject} from 'rxjs';
import {EProfile} from 'src/app/enums/profile.enum';
import {FeatureManagerService} from 'src/app/service/common/feature-manager.service';
import {StyleManagementService} from 'src/app/service/common/style-management.service';
import {StepService} from 'src/app/service/private/step.service';
import {PasswordRecoveryService} from 'src/app/service/public/password-recovery.service';
import {ErrorMessageService} from 'src/app/service/shared/error-message.service';
import {mockModal} from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import {LocalStorageServiceMock} from 'src/assets/mocks/public/mockLocalStorageServiceMock';
import {mockObservableError} from 'src/assets/testing';
import {HttpStatusCode} from '../../../enums/http-status-code.enum';
import {CustomPhonePipe} from '../../../pipes/custom-phone.pipe';
import {RecoverPasswordComponent} from './recover-password.component';
import {ItokenInfo} from './user-model';

class PasswordRecoveryServiceMock {
  getInfoTokenUser() {
    return of({
      tokenRequired: 'true',
      tokenType: 'normas',
    });
  }

  getPassword() {
    return of({
      status: '200',
      error: 'error',
      data: 'data fake',
    });
  }
}

xdescribe('RecoverPasswordComponent', () => {
  let component: RecoverPasswordComponent;
  let fixture: ComponentFixture<RecoverPasswordComponent>;

  let formBuilder: FormBuilder;
  let router: Router;
  let modalService: jasmine.SpyObj<NgbModal>;
  let stepService: jasmine.SpyObj<StepService>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let managementMethod: FeatureManagerService;

  let mockForm: FormGroup;

  beforeEach(async () => {
    const authenticationServiceSpy = jasmine.createSpyObj('AuthenticationService', ['currentTokenValue']);
    const errorMessageServiceSpy = jasmine.createSpyObj('ErrorMessageService', ['getTranslateKey']);
    const styleManagementSpy = jasmine.createSpyObj('StyleManagementService', ['corporateImageApplication']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    const stepServiceSpy = jasmine.createSpyObj('StepService', ['s']);
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      declarations: [RecoverPasswordComponent, CustomPhonePipe, AdfInputComponent],
      providers: [
        RecoverPasswordComponent,
        LocalStorageServiceMock,
        PasswordRecoveryServiceMock,
        {provide: AuthenticationService, useValue: authenticationServiceSpy},
        {provide: PasswordRecoveryService, useClass: PasswordRecoveryServiceMock},
        {provide: StorageService, useClass: LocalStorageServiceMock},
        {provide: ErrorMessageService, useValue: errorMessageServiceSpy},
        {provide: StyleManagementService, useValue: styleManagementSpy},
        {provide: NgbModal, useValue: modalServiceSpy},
        {provide: StepService, useValue: stepServiceSpy},
        {provide: NgxSpinnerService, useValue: spinnerSpy},
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                attReturnUrl: 'https/api/v1/',
              },
            },
          },
        },
      ],
      imports: [
        AdfComponentsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        ReactiveFormsModule,
        FormsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecoverPasswordComponent);
    component = fixture.componentInstance;

    formBuilder = TestBed.inject(FormBuilder);
    router = TestBed.inject(Router);
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    stepService = TestBed.inject(StepService) as jasmine.SpyObj<StepService>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    managementMethod = TestBed.inject(FeatureManagerService);

    formBuilder = new FormBuilder();
    mockForm = formBuilder.group({
      username: ['', Validators.required],
    });

    component.loginForm = mockForm;
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    spinner.show.and.returnValue(Promise.resolve());
    spinner.hide.and.returnValue(Promise.resolve());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show and hidden spinner', () => {
    component.showSpinner();
    expect(spinner.show).toHaveBeenCalled();
    component.hiddenSpinner();
    expect(spinner.hide).toHaveBeenCalled();
  });

  it('should openAlert and hiddenAlert', () => {
    component.openAlert(null as any, 'success');
    expect(component.showAlert).toBeTruthy();
    expect(component.messageAlert).toEqual('success');

    component.hiddenAlert();
    expect(component.messageAlert).toBeNull();
    expect(component.typeAlert).toBeNull();
  });

  it('should return to login page', () => {
    component.reverse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should recoverPassword with form error', () => {
    component.loginForm.reset();
    component.recoverPassword('email');
    expect(component.loginForm.markAllAsTouched).toBeTruthy();
  });

  it('should recoverPassword with implementMethod is false', () => {
    spyOn(managementMethod, 'implementMethod').and.returnValue(false);
    spyOn(component, 'hiddenAlert');
    spyOn(component, 'evaluateExecute');
    component.loginForm.controls['username'].setValue('valid_username');
    component.recoverPassword('email');
    expect(component.hiddenAlert).toHaveBeenCalled();
    expect(component.evaluateExecute).toHaveBeenCalled();
  });

  it('test_recover_password_successfully_by_username', () => {
    spyOn(managementMethod, 'implementMethod').and.returnValue(true);
    component.loginForm.controls['username'].setValue('valid_username');
    modalService.open.and.returnValue(mockModal as NgbModalRef);
    stepService.s.and.returnValue('true');
    // Act
    component.recoverPassword('email');

    // Assert
    expect(component.showAlert).toBeFalsy();
    expect(component.showButton).toBeTruthy();
    expect(component.showText).toBeTruthy();
  });

  it('test_recover_password_successfully_by_username with token not required', () => {
    spyOn(managementMethod, 'implementMethod').and.returnValue(true);
    spyOn(component, 'executeRecoverPassword');
    component.loginForm.controls['username'].setValue('valid_username');
    stepService.s.and.returnValue('false');
    // Act
    component.recoverPassword('email');

    // Assert
    expect(component.executeRecoverPassword).toHaveBeenCalled();
  });

  it('should open Token Modal', () => {
    modalService.open.and.returnValue(mockModal as NgbModalRef);
    component.openTokenModal(dto, 'recoverPassword');
    expect(modalService.open).toHaveBeenCalled();
  });

  it('should evaluate Method is typeRecover is mobile', () => {
    spyOn(component, 'executeMobile');
    component.typeRecover = 'mobile';
    component.evaluateMethod('mobile', 'result');
    expect(component.executeMobile).toHaveBeenCalled();
  });

  it('should evaluateExecute with mobile', () => {
    spyOn(component, 'handleRecoverPasswordBySMS');
    component.typeRecover = 'mobile';
    component.evaluateExecute();
    expect(component.handleRecoverPasswordBySMS).toHaveBeenCalled();
  });

  it('should evaluateExecute with email', () => {
    spyOn(component, 'handleRecoverPasswordByEmail');
    component.typeRecover = 'email';
    component.evaluateExecute();
    expect(component.handleRecoverPasswordByEmail).toHaveBeenCalled();
  });

  it('should executeMobile with succes transaction', () => {
    spyOn(managementMethod, 'implementMethod').and.returnValue(true);
    component.executeMobile({
      status: '200',
      error: 'error',
      data: 'data fake',
      message: 'message fake test',
    });
    expect(component.showAlert).toBeFalsy();
    expect(component.showText).toBeTruthy();
  });

  it('should executeMobile with  is false', () => {
    spyOn(managementMethod, 'implementMethod').and.returnValue(false);
    component.executeMobile({
      status: '200',
      error: 'error',
      data: 'data fake',
      message: 'message fake test',
      phone: '74525698',
    });
    expect(component.showAlert).toBeFalsy();
    expect(component.showButton).toBeFalsy();
    expect(component.passwordChangeResponse).toEqual('****5698');
  });

  it('should executeEmail with succes transaction', () => {
    spyOn(managementMethod, 'implementMethod').and.returnValue(true);
    component.executeEmail({
      status: '200',
      error: 'error',
      data: 'data fake',
      message: 'message fake test',
    });
    expect(component.showAlert).toBeFalsy();
    expect(component.showText).toBeTruthy();
  });

  it('should executeEmail with  is false', () => {
    spyOn(managementMethod, 'implementMethod').and.returnValue(false);
    component.executeEmail({
      status: '200',
      error: 'error',
      data: 'data fake',
      message: 'message fake test',
      email: 'test@test.com',
    });
    expect(component.showAlert).toBeFalsy();
    expect(component.showButton).toBeFalsy();
    expect(component.passwordChangeResponse).toEqual('te**@test.com');
  });

  it('should executeRecoverPassword', () => {
    spyOn(component, 'handleRecoverPasswordBySMS');
    spyOn(component, 'showSpinner');
    component.typeConsult = 'mobile';
    component.executeRecoverPassword('asdas');
    expect(component.showSpinner).toHaveBeenCalled();
    expect(component.handleRecoverPasswordBySMS).toHaveBeenCalled();
  });

  it('should executeRecoverPassword', () => {
    spyOn(component, 'handleRecoverPasswordByEmail');
    spyOn(component, 'showSpinner');
    component.typeConsult = 'email';
    component.executeRecoverPassword('asdas');
    expect(component.showSpinner).toHaveBeenCalled();
    expect(component.handleRecoverPasswordByEmail).toHaveBeenCalled();
  });

  it('should handleRecoverPasswordBySMS with service response next', () => {
    spyOn(managementMethod, 'implementMethod').and.returnValue(true);
    component.handleRecoverPasswordBySMS(serviceResponse, 'asdas');
  });

  it('should handleRecoverPasswordBySMS', () => {
    spyOn(component, 'executeMobile');
    component.handleRecoverPasswordBySMS(serviceResponse, 'asdas');
    expect(component.executeMobile).toHaveBeenCalled();
  });

  it('should handleRecoverPasswordBySMS but getPassword have error http', () => {
    const message: string = 'user not found';
    const service = TestBed.inject(PasswordRecoveryService);
    spyOn(service, 'getPassword').and.returnValue(
      mockObservableError({
        error: {
          message,
        },
      })
    );
    component.handleRecoverPasswordBySMS(serviceResponse, 'asdas');
    expect(service.getPassword).toHaveBeenCalled();
  });

  it('should handleRecoverPasswordByEmail with service response next', () => {
    spyOn(managementMethod, 'implementMethod').and.returnValue(true);
    component.handleRecoverPasswordByEmail(serviceResponse, 'asdas');
  });

  it('should handleRecoverPasswordByEmail', () => {
    spyOn(component, 'executeEmail');
    component.handleRecoverPasswordByEmail(serviceResponse, 'asdas');
    expect(component.executeEmail).toHaveBeenCalled();
  });

  it('should set smsResponse and passwordChangeResponse if managementMethod is implemented', () => {
    const result = {status: HttpStatusCode.SUCCESS_TRANSACTION, data: {phone: '1234567890'}};
    spyOn(managementMethod, 'implementMethod').and.returnValue(true);

    component.executeMobile(result);

    expect(managementMethod.implementMethod).toHaveBeenCalled();
    expect(component.showText).toBeFalse();
    expect(component.smsResponse).toEqual(result.data);
    expect(component.showButton).toBeFalse();
    expect(component.passwordChangeResponse).toBe('****567890');
  });

  it('should set smsResponse with error Token', () => {
    const result = {status: HttpStatusCode.INVALID_TOKEN, error: 'SOME_ERROR', message: 'Error: Some error message'};
    spyOn(managementMethod, 'implementMethod').and.returnValue(true);

    component.executeMobile(result);

    expect(managementMethod.implementMethod).toHaveBeenCalled();
  });

  it('should set mail response if management method is implemented', () => {
    const result = {status: HttpStatusCode.SUCCESS_TRANSACTION, data: {email: 'test@example.com'}};
    spyOn(managementMethod, 'implementMethod').and.returnValue(true);

    component.executeEmail(result);

    expect(component.loginForm.get('username')!.hasError('customError')).toBeFalse();
    expect(component.mailResponse).toEqual(result.data);
    expect(component.showButton).toBeFalse();
    expect(component.showText).toBeFalse();
    expect(component.passwordChangeResponse).toBe('te**@example.com');
  });

  it('should handleRecoverPasswordByEmail but service response failed', () => {
    component.profile = EProfile.HONDURAS;
    const service = TestBed.inject(PasswordRecoveryService);
    spyOn(service, 'getPassword').and.returnValue(mockObservableError({}));

    component.handleRecoverPasswordByEmail();

    expect(component.showAlert).toBeTruthy();
  });
});

const dto: ItokenInfo = {
  tokenRequired: 'false',
  tokenType: 'normal',
};

const serviceResponse = new Subject();
