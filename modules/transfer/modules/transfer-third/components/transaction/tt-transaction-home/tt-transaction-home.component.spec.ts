import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TtTransactionHomeComponent} from './tt-transaction-home.component';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {TteTransferManagerService} from '../../../services/execution/tte-transfer-manager.service';
import {
  EThirdTransferUrlNavigationCollection,
  EThirdTransferViewMode
} from '../../../enums/third-transfer-navigate-parameters.enum';
import {iAccount} from 'src/assets/mocks/modules/signature-tracking/mocksDetailTransaction';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {AdfButtonComponent} from '@adf/components';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {
  iThirdTransfersAccountsMock,
  iThirdTransferTransactionStateMock
} from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subscription} from "rxjs";
import {AttributeThirdFormTransfer} from "../../../enums/third-transfer-control-name.enum";
import {clickElement, mockPromise} from "../../../../../../../../assets/testing";
import {EProfile} from "../../../../../../../enums/profile.enum";

describe('TtTransactionHomeComponent', () => {
  let component: TtTransactionHomeComponent;
  let fixture: ComponentFixture<TtTransactionHomeComponent>;

  let router: Router;
  let util: jasmine.SpyObj<UtilService>;
  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let serviceExecutionManager: jasmine.SpyObj<TteTransferManagerService>;

  let formBuilder: FormBuilder;
  let formGroup: FormGroup;

  let thirdTransferLayout;

  beforeEach(async () => {

    const utilSpy = jasmine.createSpyObj('UtilService', ['findSourceAccount', 'hideLoader', 'showLoader', 'removeLayoutSelect'])
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters', 'getParameter'])
    const serviceExecutionManagerSpy = jasmine.createSpyObj('TteTransferManagerService', ['formScreenBuilderStep1', 'changeAccountDebitedStep1', 'changeAccountAccreditStep1'])

    await TestBed.configureTestingModule({
      declarations: [TtTransactionHomeComponent, AdfButtonComponent],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              data: {
                view: EThirdTransferViewMode.DEFAULT,
                debitAccounts: [iAccount]
              }
            }
          }
        },
        {provide: UtilService, useValue: utilSpy},
        {provide: ParameterManagementService, useValue: parameterManagementSpy},
        {provide: TteTransferManagerService, useValue: serviceExecutionManagerSpy},
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
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TtTransactionHomeComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    serviceExecutionManager = TestBed.inject(TteTransferManagerService) as jasmine.SpyObj<TteTransferManagerService>;
    formBuilder = TestBed.inject(FormBuilder);
    parameterManagement.getParameter.and.returnValue(iThirdTransferTransactionStateMock)

    formGroup = formBuilder.group({
      [AttributeThirdFormTransfer.ACCOUNT_ACCREDIT]: ['', [Validators.required]],
      [AttributeThirdFormTransfer.ACCOUNT_DEBITED]: ['', [Validators.required]],
      [AttributeThirdFormTransfer.EMAIL]: ['', [Validators.required]],
      [AttributeThirdFormTransfer.AMOUNT]: ['', [Validators.required]],
      [AttributeThirdFormTransfer.COMMENT]: [''],
    });

    spyOn(router.events, 'subscribe').and.callFake((observer: any) => {
      observer.next({navigationTrigger: 'popstate'} as any);
      return new Subscription();
    });

    spyOn(router, 'navigate').and.returnValue(mockPromise(true))

    thirdTransferLayout = {
      attributes: [
        {controlName: AttributeThirdFormTransfer.ACCOUNT_ACCREDIT},
        {controlName: AttributeThirdFormTransfer.ACCOUNT_DEBITED},
      ] as any
    } as any

    const optionList = [
      {controlName: AttributeThirdFormTransfer.ACCOUNT_ACCREDIT},
      {controlName: AttributeThirdFormTransfer.ACCOUNT_DEBITED},
    ] as any

    const error = 'test error'

    serviceExecutionManager.formScreenBuilderStep1.and.returnValue({
      thirdTransferLayout,
      thirdTransferForm: formGroup,
      optionList,
      error
    })

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to the prevStep', () => {
    component['profile'] = EProfile.SALVADOR;
    component.viewMode = EThirdTransferViewMode.DEFAULT;
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith([EThirdTransferUrlNavigationCollection.HOMESV])
  })

  it('should go to the prevStep with SIGNATURE_TRACKING', () => {
    component.viewMode = EThirdTransferViewMode.SIGNATURE_TRACKING;
    clickElement(fixture, 'adf-button.secondary')
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/transaction-manager/signature-tracking'])
  })

  it('should go to next Step with form wrong', () => {
    clickElement(fixture, 'adf-button.primary')
    fixture.detectChanges();
    expect(component.form.valid).toBeFalsy();
    expect(component.form.markAllAsTouched).toBeTruthy();
  })

  it('should go To ConfirmationScreen ', () => {

    serviceExecutionManager.changeAccountDebitedStep1.and.returnValue({
      thirdTransferLayout: thirdTransferLayout,
      accountDebited: iAccount
    });

    serviceExecutionManager.changeAccountAccreditStep1.and.returnValue({
      thirdTransferLayout: thirdTransferLayout,
      accountAccredit: iThirdTransfersAccountsMock
    });

    component.form.patchValue({
      [AttributeThirdFormTransfer.ACCOUNT_ACCREDIT]: '7896352525',
      [AttributeThirdFormTransfer.ACCOUNT_DEBITED]: '223565230',
      [AttributeThirdFormTransfer.EMAIL]: 'email@example.com',
      [AttributeThirdFormTransfer.AMOUNT]: '100.00',
      [AttributeThirdFormTransfer.COMMENT]: 'Test',
    })
    component.viewMode = EThirdTransferViewMode.DEFAULT;

    fixture.detectChanges();

    component.goToConfirmationScreen();

    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/transfer/third/confirmation'])
  })

  it('should remove layout select if account number is not provided', () => {
    component.changeDataAccountDebited(null as any);
    expect(util.removeLayoutSelect).toHaveBeenCalled();
  })


  it('should initFormDefinition with SIGNATURE_TRACKING', () => {
    component.viewMode = EThirdTransferViewMode.SIGNATURE_TRACKING
    fixture.detectChanges();
    component.initFormDefinition();
    expect(serviceExecutionManager.formScreenBuilderStep1).toHaveBeenCalledWith({
      title: 'signature_tracking',
      subtitle: 'edit_transaction',
      accountCredit: component.accountAccreditSelected,
      accountDebitedList: component.accountDebitedList,
      isModifyMode: true,
      accountCreditList: [],
    })
  })

});
