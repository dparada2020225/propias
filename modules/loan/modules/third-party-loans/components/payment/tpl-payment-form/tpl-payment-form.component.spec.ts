import {AdfFormatService, AdfFormBuilderService} from '@adf/components';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subscription} from 'rxjs';
import {ETPLTypePayment} from 'src/app/enums/payment-type.enum';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {
  iConsultDetailTPLMock,
  iDataPaymentMock,
  iQuotasAmountResponseMock
} from 'src/assets/mocks/modules/loan/loan.data.mock';
import {iAccount} from 'src/assets/mocks/modules/signature-tracking/mocksDetailTransaction';
import {MockTranslatePipe} from 'src/assets/mocks/public/tranlatePipeMock';
import {clickElement, mockObservable, mockObservableError, mockPromise} from 'src/assets/testing';
import {EPaymentLoansFlowView} from '../../../enum/navigate-protection-parameter.enum';
import {EThirdPartyLoanTypeMethod, ETypePaymenteSelected} from '../../../enum/payment-form.enum';
import {TPLPTypeView} from '../../../enum/payment.interface';
import {AttributeFormThirdPartyLoansCrud} from '../../../enum/third-party-loans-control-name.enum';
import {ITPLPEReturnValues} from '../../../interfaces/tplpe-form.interface';
import {TpldPaymentManagerService} from '../../../services/definition/payment/tpld-payment-manager.service';
import {TpplePaymentFormService} from '../../../services/execution/third-party-loan-payment/tpple-payment-form.service';
import {ThirdPartyLoansService} from '../../../services/transaction/third-party-loans.service';
import {TplPaymentFormComponent} from './tpl-payment-form.component';

describe('TplPaymentFormComponent', () => {
  let component: TplPaymentFormComponent;
  let fixture: ComponentFixture<TplPaymentFormComponent>;

  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let util: jasmine.SpyObj<UtilService>;
  let thirdPartyLoansTransactionService: jasmine.SpyObj<ThirdPartyLoansService>;
  let formatService: jasmine.SpyObj<AdfFormatService>;
  let translate: jasmine.SpyObj<TranslateService>;
  let thirdPartyExecutionForm: jasmine.SpyObj<TpplePaymentFormService>;
  let router: Router;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup<{
    [AttributeFormThirdPartyLoansCrud.NUMBER_ACCOUNT]: FormControl<string | null>;
    [AttributeFormThirdPartyLoansCrud.PAYMENT_OPTION]: FormControl<string | null>;
  }>;
  let partialAmountForm: FormGroup<{
    inputAmount: FormControl<number | null>;
  }>;

  beforeEach(async () => {
    const adfFormBuilderSpy = jasmine.createSpyObj('AdfFormBuilderService', ['']);
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['']);
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters']);
    const paymentDefinitionManagerSpy = jasmine.createSpyObj('TpldPaymentManagerService', ['buildPaymentDetailLayout']);
    const utilSpy = jasmine.createSpyObj('UtilService', [
      'parseCustomNumber',
      'findSourceAccount',
      'showLoader',
      'hideLoader',
      'getCurrencySymbolToIso',
      'getAmountMask',
      'scrollToTop',
    ]);
    const thirdPartyLoansTransactionServiceSpy = jasmine.createSpyObj('ThirdPartyLoansService', ['consultDetail', 'consultQuotasPayment']);
    const formatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount']);
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    const thirdPartyExecutionFormSpy = jasmine.createSpyObj('TpplePaymentFormService', ['formScreenBuilder', 'changeAccountDebited']);

    await TestBed.configureTestingModule({
      declarations: [TplPaymentFormComponent, MockTranslatePipe],
      providers: [
        { provide: AdfFormBuilderService, useValue: adfFormBuilderSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: ParameterManagementService, useValue: parameterManagementSpy },
        { provide: TpldPaymentManagerService, useValue: paymentDefinitionManagerSpy },
        { provide: UtilService, useValue: utilSpy },
        { provide: ThirdPartyLoansService, useValue: thirdPartyLoansTransactionServiceSpy },
        { provide: AdfFormatService, useValue: formatServiceSpy },
        { provide: TranslateService, useValue: translateSpy },
        { provide: TpplePaymentFormService, useValue: thirdPartyExecutionFormSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                view: TPLPTypeView.DEFAULT,
                debitLoansNumbers: [iAccount],
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
        ReactiveFormsModule,
        FormsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TplPaymentFormComponent);
    component = fixture.componentInstance;

    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    thirdPartyLoansTransactionService = TestBed.inject(ThirdPartyLoansService) as jasmine.SpyObj<ThirdPartyLoansService>;
    formatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    thirdPartyExecutionForm = TestBed.inject(TpplePaymentFormService) as jasmine.SpyObj<TpplePaymentFormService>;
    router = TestBed.inject(Router);
    formBuilder = TestBed.inject(FormBuilder);

    spyOn(router.events, 'subscribe').and.callFake((observer: any) => {
      observer.next({ navigationTrigger: 'popstate' } as any);
      return new Subscription();
    });

    formGroup = formBuilder.group({
      numberAccount: ['', Validators.required],
      paymentOption: ['', Validators.required],
    });

    partialAmountForm = formBuilder.group({
      inputAmount: [0, Validators.required],
    });

    const data: ITPLPEReturnValues = {
      selectForm: formGroup,
      partialAmountForm,
      options: [],
      selectFormLayout: {
        attributes: {} as any,
      } as any,
      error: 'error',
    };

    thirdPartyExecutionForm.formScreenBuilder.and.returnValue(data);
    util.getCurrencySymbolToIso.and.returnValue('$');
    thirdPartyLoansTransactionService.consultDetail.and.returnValue(mockObservable(iConsultDetailTPLMock));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to the next step', fakeAsync(() => {
    spyOn(router, 'navigate').and.returnValue(mockPromise(true));
    component.form.patchValue({
      numberAccount: '67414141414',
      paymentOption: 'paymentOption',
    });
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    tick();
    expect(parameterManagement.sendParameters).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/loan/third-party-loans/payment-voucher']);
    expect(util.showLoader).toHaveBeenCalled();
    expect(util.hideLoader).toHaveBeenCalled();
  }));

  it('should go to the next step when view signatureTrackingView == signatureTrackingView', fakeAsync(() => {
    component.view = TPLPTypeView.ST_MODIFY_TRANSACTIONS;
    spyOn(router, 'navigate').and.returnValue(mockPromise(true));
    component.form.patchValue({
      numberAccount: '67414141414',
      paymentOption: 'paymentOption',
    });
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    tick();
    expect(parameterManagement.getParameter).toHaveBeenCalled();
    expect(parameterManagement.sendParameters).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/loan/third-party-loans/stm-confirmation']);
    expect(util.showLoader).toHaveBeenCalled();
    expect(util.hideLoader).toHaveBeenCalled();
  }));

  it('should go to back when currentView == null', fakeAsync(() => {
    component.currentView = null as any;
    spyOn(router, 'navigate').and.returnValue(mockPromise(true));
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();
    tick();
    expect(parameterManagement.sendParameters).toHaveBeenCalledWith({
      loanTransactionToPayment: null,
      navigationProtectedParameter: null,
      navigateStateParameters: null,
    });
    expect(router.navigate).toHaveBeenCalledWith(['/loan/third-party-loans']);
  }));

  it('should go to back when currentView == ALL_LOANS', fakeAsync(() => {
    component.currentView = EPaymentLoansFlowView.ALL_LOANS;
    spyOn(router, 'navigate').and.returnValue(mockPromise(true));
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();
    tick();
    expect(parameterManagement.sendParameters).toHaveBeenCalledWith({
      loanTransactionToPayment: null,
      navigationProtectedParameter: null,
      navigateStateParameters: null,
    });
    expect(router.navigate).toHaveBeenCalledWith(['/loan/third-party-loans/all']);
  }));

  xit('should go to back when currentView == ST_MODIFY_TRANSACTIONS', fakeAsync(() => {
    component.view = TPLPTypeView.ST_MODIFY_TRANSACTIONS;
    spyOn(router, 'navigate').and.returnValue(mockPromise(true));
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();
    tick();
    expect(parameterManagement.sendParameters).toHaveBeenCalledWith({
      loanTransactionToPayment: null,
      navigateStateParameters: null,
    });
    expect(util.showLoader).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith([TPLPTypeView.ST_MODIFY_TRANSACTIONS]);
  }));

  it('should handle Change By Counter Value', () => {
    component.handleChangeByCounterValue();
    expect(component.isQuotasCounterSelect).toBeTruthy();
    expect(component.isPartialAmountSelect).toBeFalsy();
    expect(component.typePaymentSelected).toEqual(ETypePaymenteSelected.QUOTA);
  });

  it('should handle Change By Partial Amount', () => {
    component.handleChangeByPartialAmount();
    expect(component.installmentNumber).toEqual('0');
    expect(component.isQuotasCounterSelect).toBeFalsy();
    expect(component.isPartialAmountSelect).toBeTruthy();
    expect(component.messageError).toBeFalsy();
    expect(component.typePaymentSelected).toEqual(ETypePaymenteSelected.PARTIAL);
  });

  it('should set State From Default Flow when paymentType = PARTIAL', fakeAsync(() => {
    util.findSourceAccount.and.returnValue('1353255');
    const typePaymentSelected: string = EThirdPartyLoanTypeMethod.PARTIAL;
    component.setStateFromDefaultFlow(iDataPaymentMock, typePaymentSelected);
    tick(300);
    expect(component.form.get(AttributeFormThirdPartyLoansCrud.PAYMENT_OPTION)?.value).toEqual(EThirdPartyLoanTypeMethod.PARTIAL);
    expect(component.form.get(AttributeFormThirdPartyLoansCrud.NUMBER_ACCOUNT)?.value).toEqual(
      iDataPaymentMock.loanDetailToPayment.accountDebited.account
    );
  }));

  it('should set State From Default Flow when paymentType = QUOTA', fakeAsync(() => {
    util.findSourceAccount.and.returnValue('1353255');

    const data = { ...iDataPaymentMock };
    data.typePayment = ETPLTypePayment.QUOTAS;

    const typePaymentSelected: string = EThirdPartyLoanTypeMethod.QUOTA;
    component.setStateFromDefaultFlow(data, typePaymentSelected);
    tick(300);
    expect(component.form.get(AttributeFormThirdPartyLoansCrud.PAYMENT_OPTION)?.value).toEqual(EThirdPartyLoanTypeMethod.QUOTA);
    expect(component.form.get(AttributeFormThirdPartyLoansCrud.NUMBER_ACCOUNT)?.value).toEqual(
      data.loanDetailToPayment.accountDebited.account
    );
  }));

  it('should set State From Signature Tracking when payment QUOTA', fakeAsync(() => {
    component.accountDebitList = [iAccount];
    fixture.detectChanges();

    const paymentState = {
      detailTransaction: {
        sourceAccount: '1576653',
        quotas: '5',
        sourceAmount: '1000',
      },
    };
    const typePaymentSelected = EThirdPartyLoanTypeMethod.QUOTA;

    component.setStateFromSignatureTracking(paymentState, typePaymentSelected);
    tick(300);

    expect(component.currentCounterValue).toEqual('5' as any);
    expect(component.initialValue).toEqual('5' as any);
    expect(component.form.get(AttributeFormThirdPartyLoansCrud.PAYMENT_OPTION)?.value).toEqual(EThirdPartyLoanTypeMethod.QUOTA);
  }));

  it('should set State From Signature Tracking when payment PARTIAL', () => {
    component.accountDebitList = [iAccount];
    fixture.detectChanges();

    const paymentState = {
      detailTransaction: {
        sourceAccount: '1576653',
        quotas: '5',
        sourceAmount: '1000',
      },
    };
    const typePaymentSelected = EThirdPartyLoanTypeMethod.PARTIAL;

    component.setStateFromSignatureTracking(paymentState, typePaymentSelected);

    expect(component.form.get(AttributeFormThirdPartyLoansCrud.NUMBER_ACCOUNT)?.value).toEqual('1576653');
    expect(component.form.get(AttributeFormThirdPartyLoansCrud.PAYMENT_OPTION)?.value).toEqual(EThirdPartyLoanTypeMethod.PARTIAL);
    expect(component.partialAmountForm.get('inputAmount')?.value).toEqual('1000');
  });

  it('value within range', () => {
    thirdPartyLoansTransactionService.consultQuotasPayment.and.returnValue(mockObservable(iQuotasAmountResponseMock));
    component.maxQuota = 20;
    component.minQuota = 1;
    component.isQuotasCounterSelect = true;
    component.isLoading = true;
    component.getCounterValue(10);
    expect(component.isLoading).toBeFalsy();
    expect(component.maxQuota).toEqual(15765870);
    expect(component.installmentNumber).toEqual('1417');
    expect(formatService.formatAmount).toHaveBeenCalled();
  });

  it('value within range but have error http', () => {
    thirdPartyLoansTransactionService.consultQuotasPayment.and.returnValue(mockObservableError({}));
    component.maxQuota = 20;
    component.minQuota = 1;
    component.isQuotasCounterSelect = true;
    component.isLoading = true;
    component.getCounterValue(10);
    expect(component.isLoading).toBeFalsy();
    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual('error:getting_detail_loan');
    expect(util.scrollToTop).toHaveBeenCalled();
    expect(component.messageError).toBeTruthy();
  });

  it('Value greater than max quota', () => {
    component.maxQuota = 20;
    component.minQuota = 1;
    component.isQuotasCounterSelect = true;
    component.isLoading = true;
    translate.instant.and.returnValue('error_maxQuota');

    component.getCounterValue(21);

    expect(component.errorQuotaValueMax).toBeTruthy();
    expect(component.quotaToPay).toBe('error_maxQuota');
    expect(component.isLoading).toBeFalsy();
  });

  it('test_edge_case_value_less_than_min_quota', () => {
    component.maxQuota = 20;
    component.minQuota = 1;
    component.isQuotasCounterSelect = true;
    component.isLoading = true;
    translate.instant.and.returnValue('error_minQuota');

    component.getCounterValue(0);

    expect(component.errorQuotaValueMin).toBe(true);
    expect(component.quotaToPay).toBe('error_minQuota');
    expect(component.isLoading).toBe(false);
  });

  it('test_valid_partial_amount', () => {
    component.isPartialAmountSelect = true;
    component.partialAmountForm.get('inputAmount')?.setValue('100');
    expect(component.validatePartialInput()).toBeFalsy();
  });

  it('handleLoaderBYInputCounterChange', () => {
    component.isLoading = false;
    component.handleLoaderBYInputCounterChange();
    expect(component.isLoading).toBeTruthy();
  });
});
