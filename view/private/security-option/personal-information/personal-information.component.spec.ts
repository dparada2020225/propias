import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {AdfInputComponent} from '@adf/components';
import {StorageService} from '@adf/security';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslatePipe,
  TranslateService
} from '@ngx-translate/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {EProfile} from 'src/app/enums/profile.enum';
import {StyleManagementService} from 'src/app/service/common/style-management.service';
import {CheckProfileService} from 'src/app/service/general/check-profile.service';
import {SecurityOptionService} from 'src/app/service/private/security-option/security-option.service';
import {ErrorMessageService} from 'src/app/service/shared/error-message.service';
import {mockModal} from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import {MockTranslatePipe} from 'src/assets/mocks/public/tranlatePipeMock';
import {clickElement, mockObservable, mockObservableError, mockPromise} from 'src/assets/testing';
import {LocalStorageServiceMock} from '../../../../../assets/mocks/public/mockLocalStorageServiceMock';
import {PersonalInformationComponent} from './personal-information.component';

describe('PersonalInformationComponent', () => {
  let component: PersonalInformationComponent;
  let fixture: ComponentFixture<PersonalInformationComponent>;

  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let checkProfileService: jasmine.SpyObj<CheckProfileService>;
  let securityOptionService: jasmine.SpyObj<SecurityOptionService>;
  let router: jasmine.SpyObj<Router>;
  let error: jasmine.SpyObj<ErrorMessageService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let styleManagement: jasmine.SpyObj<StyleManagementService>;

  beforeEach(async () => {
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['hide', 'show']);
    const checkProfileServiceSpy = jasmine.createSpyObj('CheckProfileService', ['validateUser', 'postponeRegisterProfile']);
    const securityOptionServiceSpy = jasmine.createSpyObj('SecurityOptionService', ['updateContact', 'sendAffiliationCode', 'setPhone']);
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const errorSpy = jasmine.createSpyObj('ErrorMessageService', ['getTranslateKey']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    const styleManagementSpy = jasmine.createSpyObj('StyleManagementService', ['corporateImageApplication']);

    await TestBed.configureTestingModule({
      declarations: [PersonalInformationComponent, MockTranslatePipe, AdfInputComponent, TranslatePipe],
      providers: [
        LocalStorageServiceMock,
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: CheckProfileService, useValue: checkProfileServiceSpy },
        { provide: SecurityOptionService, useValue: securityOptionServiceSpy },
        { provide: TranslateService, useValue: translateSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ErrorMessageService, useValue: errorSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: StorageService, useClass: LocalStorageServiceMock },
        { provide: StyleManagementService, useValue: styleManagementSpy },
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

    fixture = TestBed.createComponent(PersonalInformationComponent);
    component = fixture.componentInstance;

    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    checkProfileService = TestBed.inject(CheckProfileService) as jasmine.SpyObj<CheckProfileService>;
    securityOptionService = TestBed.inject(SecurityOptionService) as jasmine.SpyObj<SecurityOptionService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    error = TestBed.inject(ErrorMessageService) as jasmine.SpyObj<ErrorMessageService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    styleManagement = TestBed.inject(StyleManagementService) as jasmine.SpyObj<StyleManagementService>;

    component.profile = {
      phone: '1589 6357',
      codeOperator: '+502',
      code: 1,
      email: 'test@example.com',
    } as any;

    component.phoneCompanies = [
      {
        channel: '2',
        code: '1',
        description: 'tigo',
      },
      {
        channel: '3',
        code: '2',
        description: 'claro',
      },
    ];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should clear info', () => {
    router.navigate.and.returnValue(mockPromise(true));
    checkProfileService.validateUser.and.returnValue(mockObservable({ postponeTimes: 2 }));
    checkProfileService.postponeRegisterProfile.and.returnValue(mockObservable({}));
    clickElement(fixture, 'clear', true);
    fixture.detectChanges();

    expect(checkProfileService.validateUser).toHaveBeenCalled();
    expect(checkProfileService.postponeRegisterProfile).toHaveBeenCalled();
    expect(spinner.hide).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  xit('should clear info with validateUserService <= 0', () => {
    modalService.open.and.returnValue(mockModal as NgbModalRef);
    checkProfileService.validateUser.and.returnValue(mockObservable({ postponeTimes: -2 }));
    clickElement(fixture, 'clear', true);
    fixture.detectChanges();

    expect(checkProfileService.validateUser).toHaveBeenCalled();
    expect(modalService.open).toHaveBeenCalled();
  });
  xit('should clear info but have error http', () => {
    router.navigate.and.returnValue(mockPromise(true));
    checkProfileService.validateUser.and.returnValue(mockObservableError({ postponeTimes: 2 }));
    checkProfileService.postponeRegisterProfile.and.returnValue(mockObservable({}));
    clickElement(fixture, 'clear', true);
    fixture.detectChanges();

    expect(checkProfileService.validateUser).toHaveBeenCalled();
    expect(checkProfileService.postponeRegisterProfile).toHaveBeenCalled();
    expect(spinner.hide).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should go Clear Info have error http', () => {
    error.getTranslateKey.and.returnValue('error');
    checkProfileService.postponeRegisterProfile.and.returnValue(mockObservableError({ error: 'error' }));

    component.goClearInfo();
    expect(checkProfileService.postponeRegisterProfile).toHaveBeenCalled();
  });

  xit('should send info', () => {
    spyOn(component, 'handleSendInfoByProfileWithoutBIPAProfile');
    clickElement(fixture, 'send', true);
    fixture.detectChanges();
    expect(component.showAlert).toBeFalsy();
    expect(component.personalInformation.valid).toBeTruthy();
    expect(component.handleSendInfoByProfileWithoutBIPAProfile).toHaveBeenCalled();
  });

  it('should build Form For BIPA Profile', () => {
    component.buildFormForBIPAProfile('504');
    expect(component.personalInformation.get('mail')?.value).toEqual('test@example.com');
    expect(component.personalInformation.get('mailConfirmation')?.value).toEqual('test@example.com');
    expect(component.personalInformation.get('phoneCompany')?.value).toEqual('504');
    expect(component.personalInformation.get('phoneCompanyInput')?.value).toEqual('504');
  });

  it('should selected Company', () => {
    const event = 'test company';
    component.selectedCompany(event);
    expect(component.personalInformation.controls['phoneCompany'].value).toEqual(event);
  });

  it('should selected Area Code', () => {
    component.personalInformation = new FormGroup({
      phoneCompanyInput: new FormControl('', [Validators.required]),
      phoneCompany: new FormControl('', [Validators.required]),
      areaCode: new FormControl('', [Validators.required]),
    });

    component.deploymentProfile = EProfile.PANAMA;
    const event = '+507';
    component.optionList = [
      {
        value: 'p',
        name: 'P',
      },
    ];
    component.selectedAreaCode(event);
    expect(component.personalInformation.get('areaCode')?.value).toEqual('+507');
  });

  it('should bipa flox with sms', () => {
    spyOn(component, 'openModal');
    securityOptionService.sendAffiliationCode.and.returnValue(mockObservable({}));
    component.sendSms = true;
    component.bipaFlow();
    expect(component.openModal).toHaveBeenCalled();
    expect(spinner.hide).toHaveBeenCalled();
    expect(securityOptionService.sendAffiliationCode).toHaveBeenCalled();
  });

  it('should bipa flox with sms but have error http', () => {
    securityOptionService.sendAffiliationCode.and.returnValue(mockObservableError({}));
    component.sendSms = true;
    component.bipaFlow();
    expect(spinner.hide).toHaveBeenCalled();
    expect(securityOptionService.sendAffiliationCode).toHaveBeenCalled();
    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual('so_sending_affiliation-code');
  });

  it('should bipa flow to have called with email', fakeAsync(() => {
    component.configurationType = 1;
    spyOn(component.dataUpdate, 'emit');
    securityOptionService.updateContact.and.returnValue(mockObservable({}));
    router.navigate.and.returnValue(mockPromise(true));
    component.sendSms = false;
    component.bipaFlow();
    tick(2000);
    expect(component.dataUpdate.emit).toHaveBeenCalled();
    expect(component.typeAlert).toEqual('success');
    expect(component.messageAlert).toEqual('so_update_info_success');
    expect(router.navigate).toHaveBeenCalledWith(['/' + component.home]);
  }));

  it('should bipa flow to have called with email but have error http', () => {
    securityOptionService.updateContact.and.returnValue(mockObservableError({}));
    component.sendSms = false;
    component.bipaFlow();
    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual('so_update_info_error');
  });

  it('should handle Send Info By Profile Without BIPA Profile with sms', () => {
    spyOn(component, 'openModal');
    component.sendSms = true;
    securityOptionService.updateContact.and.returnValue(mockObservable({}));
    component.handleSendInfoByProfileWithoutBIPAProfile();
    expect(spinner.hide).toHaveBeenCalled();
    expect(component.openModal).toHaveBeenCalled();
  });

  it('should handle Send Info By Profile Without BIPA Profile with email', () => {
    spyOn(component.dataUpdate, 'emit');
    spyOn(component, 'redirectHome');
    component.sendSms = false;
    securityOptionService.updateContact.and.returnValue(mockObservable({}));
    component.handleSendInfoByProfileWithoutBIPAProfile();
    expect(component.dataUpdate.emit).toHaveBeenCalled();
    expect(component.typeAlert).toEqual('success');
    expect(component.messageAlert).toEqual('so_update_info_success');
    expect(component.redirectHome).toHaveBeenCalled();
  });

  it('should handle Send Info By Profile Without BIPA Profile', () => {
    securityOptionService.updateContact.and.returnValue(mockObservableError({}));
    component.handleSendInfoByProfileWithoutBIPAProfile();
    expect(spinner.hide).toHaveBeenCalled();
    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual('so_update_info_error');
  });

  it('should return error to show', () => {
    const error = {
      pattern: true,
    };
    fixture.detectChanges();
    const res = component.errorToShow(error);
    expect(res).toEqual('error_regex_mail');

    const error2 = {
      doNotMatch: true,
    };
    fixture.detectChanges();
    const res2 = component.errorToShow(error2);
    expect(res2).toEqual('cp_do_not_match');

    const error3 = {
      doNotDuplicate: true,
    };
    fixture.detectChanges();
    const res3 = component.errorToShow(error3);
    expect(res3).toEqual('cp_do_not_duplicate');

    const error4 = {
      minlength: true,
    };
    fixture.detectChanges();
    const res4 = component.errorToShow(error4);
    expect(res4).toEqual('so_error_minLength');

    const error5 = 'otro';
    fixture.detectChanges();
    const res5 = component.errorToShow(error5);
    expect(res5).toEqual('unknown');
  });

  it('should open Modal', () => {
    spyOn(component, 'handleResponseFromOpenModal');
    modalService.open.and.returnValue(mockModal as NgbModalRef);
    component.openModal();
    expect(modalService.open).toHaveBeenCalled();
  });

  it('should handle Response From Open Modal', () => {
    spyOn(component.dataUpdate, 'emit');
    spyOn(component, 'redirectHome');
    securityOptionService.updateContact.and.returnValue(mockObservable({}));
    component.handleResponseFromOpenModal('0');
    expect(spinner.show).toHaveBeenCalled();
    expect(component.sendSms).toBeFalsy();
    expect(component.dataUpdate.emit).toHaveBeenCalled();
    expect(component.typeAlert).toEqual('success');
    expect(component.messageAlert).toEqual('so_update_info_success');
    expect(component.redirectHome).toHaveBeenCalled();
  });

  it('should handle Response From Open Modal with http response failed', () => {
    securityOptionService.updateContact.and.returnValue(mockObservableError({}));
    component.handleResponseFromOpenModal('0');
    expect(spinner.show).toHaveBeenCalled();
    expect(spinner.hide).toHaveBeenCalled();
    expect(component.sendSms).toBeFalsy();
    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual('so_update_info_error');
  });

  it('should is corporate Image Application', () => {
    styleManagement.corporateImageApplication.and.returnValue(true);

    const res = component.corporateImageApplication();

    expect(res).toBeTruthy();
  });
});
