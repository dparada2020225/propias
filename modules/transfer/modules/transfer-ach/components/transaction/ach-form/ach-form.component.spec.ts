import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdfFormBuilderService} from '@adf/components';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import moment from 'moment';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {iAccount} from 'src/assets/mocks/modules/signature-tracking/mocksDetailTransaction';
import {mockModal} from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import {
  iAchAccountMock,
  iAchFormStorageLayoutMock,
  iACHScheduleResponseMock,
} from 'src/assets/mocks/modules/transfer/service/transfer-ach/ach.data.mock';
import {MockTranslatePipe} from 'src/assets/mocks/public/tranlatePipeMock';
import {clickElement, mockObservable, mockObservableError, mockPromise} from 'src/assets/testing';
import {AttributeFormTransferAch} from '../../../enum/ach-transfer-control-name.enum';
import {EACHTransferUrlNavigationCollection} from '../../../enum/navigation-parameter.enum';
import {EACHTransactionViewMode, EACHTypeSchedule} from '../../../enum/transfer-ach.enum';
import {AtdUtilService} from '../../../services/atd-util.service';
import {AtdCrudManagerService} from '../../../services/definition/crud/atd-crud-manager.service';
import {AtdTransferManagerService} from '../../../services/definition/transaction/atd-transfer-manager.service';
import {AteTransferManagerService} from '../../../services/execution/ate-transfer-manager.service';
import {TransferACHService} from '../../../services/transaction/transfer-ach.service';
import {AchFormComponent} from './ach-form.component';
import {UtilTransactionService} from "../../../../../../../service/common/util-transaction.service";

xdescribe('AchFormComponent', () => {
  let component: AchFormComponent;
  let fixture: ComponentFixture<AchFormComponent>;

  let persistStepStateService: jasmine.SpyObj<ParameterManagementService>;
  let executionManager: jasmine.SpyObj<AteTransferManagerService>;
  let router: jasmine.SpyObj<Router>;
  let transactionService: jasmine.SpyObj<TransferACHService>;
  let transferManager: jasmine.SpyObj<AtdTransferManagerService>;
  let adfFormDefinition: jasmine.SpyObj<AdfFormBuilderService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let crudManagerDefinition: jasmine.SpyObj<AtdCrudManagerService>;
  let achTransaction: jasmine.SpyObj<TransferACHService>;
  let utils: jasmine.SpyObj<UtilService>;
  let atdUtils: jasmine.SpyObj<AtdUtilService>;
  let utilTransaction: jasmine.SpyObj<UtilTransactionService>;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup;
  let formGroupMolda: FormGroup;

  beforeEach(async () => {
    const persistStepStateServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters', 'getParameter'])
    const executionManagerSpy = jasmine.createSpyObj('AteTransferManagerService', ['changeTargetAccount', 'buildFormScreenBuilder', 'handleChangeDebitedAccount'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot'])
    const transactionServiceSpy = jasmine.createSpyObj('TransferACHService', [])
    const transferManagerSpy = jasmine.createSpyObj('AtdTransferManagerService', ['buildModalFormLayout'])
    const adfFormDefinitionSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition'])
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])
    const crudManagerDefinitionSpy = jasmine.createSpyObj('AtdCrudManagerService', ['builderDataToUpdate'])
    const achTransactionSpy = jasmine.createSpyObj('TransferACHService', ['updateAccountAch'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['hideLoader', 'removeLayoutSelect', 'showPulseLoader', 'injectMask', 'findSourceAccount', 'showLoader', 'validateCurrentDate', 'getProfile', 'hidePulseLoader', 'getCurrencySymbolToIso'])
    const atdUtilsSpy = jasmine.createSpyObj('AtdUtilService', ['buildHoursToTransaction', 'getCurrentDate', 'getParsedScheduleValue'])
    const utilTransactionSpy = jasmine.createSpyObj('UtilTransactionService', ['handleResponseTransaction', 'handleErrorTransaction'])

    await TestBed.configureTestingModule({
      declarations: [AchFormComponent, MockTranslatePipe],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                view: EACHTransactionViewMode.DEFAULT,
                sourceAccounts: [iAccount],
                associatedAccounts: [iAchAccountMock],
              },
            },
          },
        },
        { provide: ParameterManagementService, useValue: persistStepStateServiceSpy },
        { provide: AteTransferManagerService, useValue: executionManagerSpy },
        { provide: Router, useValue: routerSpy },
        { provide: TransferACHService, useValue: transactionServiceSpy },
        { provide: AtdTransferManagerService, useValue: transferManagerSpy },
        { provide: AdfFormBuilderService, useValue: adfFormDefinitionSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: AtdCrudManagerService, useValue: crudManagerDefinitionSpy },
        { provide: TransferACHService, useValue: achTransactionSpy },
        { provide: UtilService, useValue: utilsSpy },
        { provide: AtdUtilService, useValue: atdUtilsSpy },
        { provide: UtilTransactionService, useValue: utilTransactionSpy },
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
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AchFormComponent);
    component = fixture.componentInstance;

    persistStepStateService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    executionManager = TestBed.inject(AteTransferManagerService) as jasmine.SpyObj<AteTransferManagerService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    transactionService = TestBed.inject(TransferACHService) as jasmine.SpyObj<TransferACHService>;
    transferManager = TestBed.inject(AtdTransferManagerService) as jasmine.SpyObj<AtdTransferManagerService>;
    adfFormDefinition = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    crudManagerDefinition = TestBed.inject(AtdCrudManagerService) as jasmine.SpyObj<AtdCrudManagerService>;
    achTransaction = TestBed.inject(TransferACHService) as jasmine.SpyObj<TransferACHService>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    atdUtils = TestBed.inject(AtdUtilService) as jasmine.SpyObj<AtdUtilService>;
    utilTransaction = TestBed.inject(UtilTransactionService) as jasmine.SpyObj<UtilTransactionService>;
    formBuilder = TestBed.inject(FormBuilder);

    formGroup = formBuilder.group({
      [AttributeFormTransferAch.HOUR]: '',
      [AttributeFormTransferAch.DATE]: '',
      [AttributeFormTransferAch.ACCOUNT_DEBITED]: '',
      [AttributeFormTransferAch.ACCOUNT_CREDIT_NAME]: '',
      schedule: '',
      comment: '',
      [AttributeFormTransferAch.AMOUNT]: ['', [Validators.required]],
    });

    formGroupMolda = formBuilder.group({
      [AttributeFormTransferAch.NAME_ACCOUNT]: '',
      [AttributeFormTransferAch.ALIAS]: '',
      [AttributeFormTransferAch.IDENTIFY_BENEFICIARY]: '',
    });

    executionManager.buildFormScreenBuilder.and.returnValue({
      transferFormLayout: {},
      transferForm: formGroup,
      optionList: [],
      error: 'test de error',
    } as any);

    transferManager.buildModalFormLayout.and.returnValue({
      attributes: [],
    } as any);
    transactionService.getSchedule.and.returnValue(mockObservable([iACHScheduleResponseMock]));
    achTransaction.getSchedule.and.returnValue(mockObservable([iACHScheduleResponseMock]));
    persistStepStateService.getParameter.and.returnValue(iAchFormStorageLayoutMock);
    adfFormDefinition.formDefinition.and.returnValue(formGroupMolda);

    modalService.open.and.returnValue(mockModal as NgbModalRef);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.view).toEqual(EACHTransactionViewMode.DEFAULT);
  });

  it('should build initDefinition', () => {
    component.view = EACHTransactionViewMode.SIGNATURE_TRACKING_UPDATE;

    component.initDefinition();
    fixture.detectChanges();

    expect(component.transferFormLayout).toBeDefined();
    expect(component.transferForm).toBeDefined();
    expect(component.optionList).toBeDefined();

    expect(executionManager.buildFormScreenBuilder).toHaveBeenCalled();
  });

  it('should handleGetSchedule when currentAmount > EACHTypeSchedule.LBTR_VALUE', () => {
    transactionService.getSchedule.and.returnValue(mockObservable([iACHScheduleResponseMock]));
    spyOn(component, 'validateHour');
    atdUtils.buildHoursToTransaction.and.returnValue({
      controlName: AttributeFormTransferAch.HOUR,
      data: [
        {
          name: 'value',
          value: 'value',
        },
      ],
    });
    component.transferForm.patchValue({
      amount: '10001',
    });
    fixture.detectChanges();
    component.handleGetSchedule();

    expect(component.listSchedule).toBeDefined();
  });

  it('should service getTransactionSchedule response with error', () => {
    const message: string = 'Invalid transaction';

    transactionService.getSchedule.and.returnValue(
      mockObservableError({
        error: {
          message,
        },
      })
    );

    component.getTransactionSchedule(EACHTypeSchedule.ACH);

    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual(message);
  });

  it('should changeDataTargetAccount', () => {
    const accountNumber: string = iAchAccountMock.account;
    executionManager.changeTargetAccount.and.returnValue({
      accountAccredit: iAchAccountMock,
    } as any);

    component.changeDataTargetAccount(accountNumber);

    expect(utils.injectMask).toHaveBeenCalled();
  });

  xit("should add 'hour_not_allowed' false", () => {
    const selectedHour = moment('2023-05-01 15:30:00', 'YYYY-MM-DD HH:mm:ss');
    component.transferForm.get(AttributeFormTransferAch.DATE)?.setValue(moment().format('YYYY-MM-DD'));
    component.transferForm.get(AttributeFormTransferAch.HOUR)?.setValue(selectedHour);
    fixture.detectChanges();
    component.validateHour(selectedHour as any);
    expect(component.transferForm.controls[AttributeFormTransferAch.HOUR].hasError('hour_not_allowed')).toBeFalsy();
  });

  it('should handleAccountDebitedChange', () => {
    executionManager.handleChangeDebitedAccount.and.returnValue({
      transferFormLayout: {},
      accountDebited: {},
    } as any);
    component.handleAccountDebitedChange('54151');
    expect(executionManager.handleChangeDebitedAccount).toHaveBeenCalled();
  });

  it('should handleAccountDebitedChange and account number is null', () => {
    component.handleAccountDebitedChange(null as any);

    expect(utils.removeLayoutSelect).toHaveBeenCalled();
  });

  it('should go to the next step and form is not valid', () => {
    component.transferForm.reset();
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();

    expect(component.transferForm.markAllAsTouched).toBeTruthy();
  });

  it('should go to the next with view default', () => {
    spyOn(component, 'validateHour');
    spyOn(component, 'handleAccountDebitedChange');
    router.navigate.and.returnValue(mockPromise(true));
    component.view = EACHTransactionViewMode.DEFAULT;

    component.transferForm.get('hour')?.setValue('12');
    fixture.detectChanges();

    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();

    expect(component.transferForm.markAllAsTouched()).toBeFalsy();
    expect(persistStepStateService.sendParameters).toHaveBeenCalledTimes(2);
    expect(router.navigate).toHaveBeenCalledWith([EACHTransferUrlNavigationCollection.DEFAULT_CONFIRMATION]);
  });

  it('should go to the next with view SIGNATURE_TRACKING_UPDATE', () => {
    spyOn(component, 'validateHour');
    spyOn(component, 'handleAccountDebitedChange');
    router.navigate.and.returnValue(mockPromise(true));
    component.view = EACHTransactionViewMode.SIGNATURE_TRACKING_UPDATE;

    component.transferForm.get('hour')?.setValue('12');
    fixture.detectChanges();

    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();

    expect(component.transferForm.markAllAsTouched()).toBeFalsy();
    expect(router.navigate).toHaveBeenCalledWith([EACHTransferUrlNavigationCollection.SIGNATURE_TRACKING_CONFIRMATION]);
  });

});
