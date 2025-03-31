import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AdfButtonComponent } from '@adf/components';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';
import { ValidationTriggerTimeService } from 'src/app/service/common/validation-trigger-time.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import {
  accountsObj,
  iOwnTransferStateMockDefault,
  scheduleServiceMock,
} from 'src/assets/mocks/modules/transfer/service/own-transfer/own.data.mock';
import { AttributeFormTransferOwn } from '../../enum/own-transfer-control-name.enum';
import { EOwnTransferViewMode } from '../../enum/own-transfer.enum';
import { OteTransferManagerService } from '../../services/execution/ote-transfer-manager.service';
import { OwnHomeComponent } from './own-home.component';

describe('OwnHomeComponent', () => {
  let component: OwnHomeComponent;
  let fixture: ComponentFixture<OwnHomeComponent>;

  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let util: jasmine.SpyObj<UtilService>;
  let executionServiceManager: jasmine.SpyObj<OteTransferManagerService>;
  let router: jasmine.SpyObj<Router>;
  let validationTriggerTime: jasmine.SpyObj<ValidationTriggerTimeService>;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup;

  beforeEach(async () => {
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters', 'getParameter']);
    const utilSpy = jasmine.createSpyObj('UtilService', ['removeLayoutSelect', 'scrollToTop', 'showLoader', 'hideLoader']);
    const executionServiceManagerSpy = jasmine.createSpyObj('OteTransferManagerService', [
      'formScreenBuilderStep1',
      'changeAccountDebitedStep1',
      'changeAccountAccreditStep1',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const validationTriggerTimeSpy = jasmine.createSpyObj('ValidationTriggerTimeService', ['validate', 'isAvailableSchedule', 'openModal']);

    await TestBed.configureTestingModule({
      declarations: [OwnHomeComponent, AdfButtonComponent],
      providers: [
        { provide: ParameterManagementService, useValue: parameterManagementSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                view: EOwnTransferViewMode.DEFAULT,
                scheduleService: scheduleServiceMock,
                creditAccounts: iOwnTransferStateMockDefault.accreditAccount,
                debitAccounts: iOwnTransferStateMockDefault.debitedAccount,
              },
            },
          },
        },
        { provide: UtilService, useValue: utilSpy },
        { provide: OteTransferManagerService, useValue: executionServiceManagerSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ValidationTriggerTimeService, useValue: validationTriggerTimeSpy },
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(OwnHomeComponent);
    component = fixture.componentInstance;

    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    executionServiceManager = TestBed.inject(OteTransferManagerService) as jasmine.SpyObj<OteTransferManagerService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    validationTriggerTime = TestBed.inject(ValidationTriggerTimeService) as jasmine.SpyObj<ValidationTriggerTimeService>;
    formBuilder = TestBed.inject(FormBuilder);

    formGroup = formBuilder.group({
      [AttributeFormTransferOwn.ACCOUNT_DEBITED]: ['', [Validators.required]],
      [AttributeFormTransferOwn.ACCOUNT_ACCREDIT]: ['', [Validators.required]],
      [AttributeFormTransferOwn.AMOUNT]: [''],
      [AttributeFormTransferOwn.COMMENT]: [''],
    });

    const data = {
      error: 'error',
      layoutOwnTransfer: {},
      optionsList: [],
      ownTransferForm: formGroup,
    };

    executionServiceManager.formScreenBuilderStep1.and.returnValue(data as any);

    spyOn(component, 'handleFoundAccount').and.returnValue(accountsObj);

    const response = {
      accountDebitedSelected: '654614',
      accountCreditSelected: '635898',
      layoutOwnTransfer: {},
      optionsList: [],
    };

    executionServiceManager.changeAccountDebitedStep1.and.returnValue(response as any);
    executionServiceManager.changeAccountAccreditStep1.and.returnValue(response as any);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show alert', () => {
    component.showAlert('succes', 'Next step');

    expect(component.typeAlert).toEqual('succes');
    expect(component.messageAlert).toEqual('Next step');
  });

  it('should hidden alert', () => {
    component.hiddenAlert();

    expect(component.typeAlert).toEqual(null);
    expect(component.messageAlert).toEqual(null);
  });

  it('should reset storage', () => {
    component.resetStorage();
    expect(parameterManagement.sendParameters).toHaveBeenCalled();
  });

  it('scrollToTop', () => {
    component.scrollToTop();
    expect(util.scrollToTop).toHaveBeenCalled();
    expect(component.scrollToTop).toBeDefined();
  });

  it('should go To home with default view', fakeAsync(() => {
    router.navigate.and.returnValue(Promise.resolve(true));
    spyOn(component, 'resetStorage').and.callThrough();
    component.lastStep();
    tick(4000);
    expect(router.navigate).toHaveBeenCalledWith(['home']);
    expect(component.resetStorage).toHaveBeenCalled();
    expect(component.lastStep).toBeDefined();
  }));

  it('should go To home with transactionHistory view ', fakeAsync(() => {
    component.viewMode = EOwnTransferViewMode.SIGNATURE_TRACKING;
    fixture.detectChanges();
    router.navigate.and.returnValue(Promise.resolve(true));
    spyOn(component, 'resetStorage').and.callThrough();
    component.lastStep();
    tick(4000);
    expect(router.navigate).toHaveBeenCalledWith(['/transaction-manager/signature-tracking']);
    expect(component.resetStorage).toHaveBeenCalled();
    expect(component.lastStep).toBeDefined();
  }));

  it('nextStep with error', fakeAsync(() => {
    router.navigate.and.returnValue(Promise.resolve(true));
    component.ownTransferForm.reset();

    component.nextStep();
    tick(4000);
    expect(component.ownTransferForm.markAllAsTouched).toBeTruthy();
  }));

  it('changeCredit', () => {
    const dataMock = '310010019305';

    component.changeCredit(dataMock);
    expect(executionServiceManager.changeAccountAccreditStep1).toHaveBeenCalled();
    expect(component.changeCredit).toBeDefined();
  });

  it('changeDebit', () => {
    const dataMock = '310010019305';
    component.changeDebit(dataMock);
    expect(component.changeCredit).toBeDefined();
  });

  it('persistsFormValues', () => {
    component.persistsFormValues();
    expect(component.persistsFormValues).toBeDefined();
  });

  it('validationRangeTriggerTime', () => {
    component.validationRangeTriggerTime();
    expect(component.validationRangeTriggerTime).toBeDefined();
    expect(validationTriggerTime.validate).toHaveBeenCalled();
  });

  it('initMainDefinition', () => {
    spyOn(component, 'mainDefinition').and.callThrough();
    spyOn(component, 'resetStorage').and.callThrough();

    const parameterOfCalled = {
      title: 'own-transfer',
      subtitle: null as any,
    };
    component.initMainDefinition();
    expect(component.initMainDefinition).toBeDefined();
    expect(component.mainDefinition).toHaveBeenCalledWith(parameterOfCalled);
    expect(component.resetStorage).toHaveBeenCalled();
  });

  it('initMainDefinition with no EOwnTransferViewMode.DEFAULT', () => {
    spyOn(component, 'mainDefinition').and.callThrough();
    component.viewMode = EOwnTransferViewMode.SIGNATURE_TRACKING;

    const parameterOfCalled = {
      title: 'signature_tracking',
      subtitle: 'edit_transaction',
    };
    component.initMainDefinition();
    expect(component.mainDefinition).toHaveBeenCalledWith(parameterOfCalled);
  });

  describe('Test with form valid', () => {
    beforeEach(() => {
      component.ownTransferForm?.patchValue({
        accountDebited: '101141200',
        accountCredit: '574241',
        amount: '100',
        comment: 'test',
      });
    });

    it('nextStep', fakeAsync(() => {
      router.navigate.and.returnValue(Promise.resolve(true));
      component.nextStep();
      tick(4000);
      expect(router.navigate).toHaveBeenCalledWith(['/transfer/own/confirmation']);
      expect(parameterManagement.sendParameters).toHaveBeenCalled();
      expect(util.showLoader).toHaveBeenCalled();
      expect(util.hideLoader).toHaveBeenCalled();
      expect(component.nextStep).toBeDefined();
    }));

    it('nextStep with diferen view', fakeAsync(() => {
      component.viewMode = EOwnTransferViewMode.SIGNATURE_TRACKING;
      fixture.detectChanges();

      router.navigate.and.returnValue(Promise.resolve(true));
      component.nextStep();
      tick(4000);
      expect(router.navigate).toHaveBeenCalledWith(['/transfer/own/st-confirmation']);
      expect(parameterManagement.sendParameters).toHaveBeenCalled();
      expect(util.showLoader).toHaveBeenCalled();
      expect(util.hideLoader).toHaveBeenCalled();
      expect(component.nextStep).toBeDefined();
    }));
  });
});
