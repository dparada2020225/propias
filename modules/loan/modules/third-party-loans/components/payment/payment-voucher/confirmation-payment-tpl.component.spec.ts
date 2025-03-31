import { AdfFormBuilderService } from '@adf/components';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { iDataPaymentMock, iTPLVoucherParameterStateMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { mockModal } from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import { clickElement, mockObservable, mockObservableError, mockPromise } from 'src/assets/testing';
import { AttributeFormThirdPartyLoansCrud } from '../../../enum/third-party-loans-control-name.enum';
import { TpldPaymentManagerService } from '../../../services/definition/payment/tpld-payment-manager.service';
import { ThirdPartyLoansService } from '../../../services/transaction/third-party-loans.service';
import { ConfirmationPaymentTPLComponent } from './confirmation-payment-tpl.component';

describe('ConfirmationPaymentTPLComponent', () => {
  let component: ConfirmationPaymentTPLComponent;
  let fixture: ComponentFixture<ConfirmationPaymentTPLComponent>;

  let tplFormBuilder: jasmine.SpyObj<AdfFormBuilderService>;
  let modalService: jasmine.SpyObj<NgbModal>;

  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let thirdPartyLoansTransactionService: jasmine.SpyObj<ThirdPartyLoansService>;
  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let paymentManagerService: jasmine.SpyObj<TpldPaymentManagerService>;
  let router: Router;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup<{
    [AttributeFormThirdPartyLoansCrud.EMAIL]: FormControl<string | null>;
    [AttributeFormThirdPartyLoansCrud.COMMENT]: FormControl<string | null>;
  }>;

  beforeEach(async () => {
    const tplFormBuilderSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    const utilSpy = jasmine.createSpyObj('UtilService', ['getTokenType', 'showLoader']);
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    const thirdPartyLoansTransactionServiceSpy = jasmine.createSpyObj('ThirdPartyLoansService', ['paymentExecute']);
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters']);
    const paymentManagerServiceSpy = jasmine.createSpyObj('TpldPaymentManagerService', [
      'buildPaymentConfirmScreenReading',
      'buildPaymentConfirmScreenForm',
    ]);
    await TestBed.configureTestingModule({
      declarations: [ConfirmationPaymentTPLComponent],
      providers: [
        { provide: AdfFormBuilderService, useValue: tplFormBuilderSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: UtilService, useValue: utilSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: ThirdPartyLoansService, useValue: thirdPartyLoansTransactionServiceSpy },
        { provide: ParameterManagementService, useValue: parameterManagementSpy },
        { provide: TpldPaymentManagerService, useValue: paymentManagerServiceSpy },
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

    fixture = TestBed.createComponent(ConfirmationPaymentTPLComponent);
    component = fixture.componentInstance;

    tplFormBuilder = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    thirdPartyLoansTransactionService = TestBed.inject(ThirdPartyLoansService) as jasmine.SpyObj<ThirdPartyLoansService>;
    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    paymentManagerService = TestBed.inject(TpldPaymentManagerService) as jasmine.SpyObj<TpldPaymentManagerService>;
    router = TestBed.inject(Router);
    formBuilder = TestBed.inject(FormBuilder);

    spyOn(router.events, 'subscribe').and.callFake((observer: any) => {
      observer.next({ navigationTrigger: 'popstate' } as any);
      return new Subscription();
    });

    parameterManagement.getParameter.and.returnValue(iDataPaymentMock);

    paymentManagerService.buildPaymentConfirmScreenForm.and.returnValue({
      attributes: [],
    } as any);

    formGroup = formBuilder.group({
      email: ['', Validators.required],
      comment: [''],
    });
    tplFormBuilder.formDefinition.and.returnValue(formGroup);
    component.confirmationPaymentForm = formGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handler Token Validate but have error response', fakeAsync(() => {
    component.errorExist = false;
    spyOn(router, 'navigate').and.returnValue(mockPromise(true));

    parameterManagement.getParameter.and.returnValue(true);
    modalService.open.and.returnValue(mockModal as NgbModalRef);

    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    tick();

    expect(parameterManagement.sendParameters).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/loan/third-party-loans/confirmation']);
  }));

  it('should handler Token Validate but token in not requeried', () => {
    component.errorExist = false;
    parameterManagement.getParameter.and.returnValue(false);
    thirdPartyLoansTransactionService.paymentExecute.and.returnValue(
      mockObservable({
        status: 200,
      })
    );
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    expect(thirdPartyLoansTransactionService.paymentExecute).toHaveBeenCalled();
  });

  it('should handler Token Validate but token in not requeried anf error http', () => {
    component.errorExist = false;
    parameterManagement.getParameter.and.returnValue(false);
    thirdPartyLoansTransactionService.paymentExecute.and.returnValue(
      mockObservableError({
        error: {
          status: 400,
        },
        status: 400,
      })
    );
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    expect(thirdPartyLoansTransactionService.paymentExecute).toHaveBeenCalled();
  });

  it('should go back', fakeAsync(() => {
    spyOn(router, 'navigate').and.returnValue(mockPromise(true));
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();
    tick();
    expect(parameterManagement.sendParameters).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/loan/third-party-loans/payment']);
  }));

  it('should show alert', () => {
    const type: string = 'type';
    const message: string = 'message';

    component.showAlert(type, message);

    expect(component.typeAlert).toEqual(type);
    expect(component.messageAlert).toEqual(message);
  });

  it('should hidden alert', () => {
    component.hiddenAlert();

    expect(component.typeAlert).toBeNull();
    expect(component.messageAlert).toBeNull();
  });

  it('should hiddenDefaultSpinner', () => {
    component.hiddenDefaultSpinner();
    expect(spinner.hide).toHaveBeenCalled();
  });

  const transactionResponse = {
    data: {
      reference: 'VBFGD',
      dateTime: '2013-02',
    },
  };

  it('should navigate if handle Response Success Default Flow', fakeAsync(() => {
    spyOn(router, 'navigate').and.returnValue(mockPromise(true));

    component.handleResponseSuccessDefaultFlow(iTPLVoucherParameterStateMock, transactionResponse);
    tick();
    expect(parameterManagement.sendParameters).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/loan/third-party-loans/confirmation']);
  }));

  it('should handle Response For Signature Tracking Flow', fakeAsync(() => {
    spyOn(router, 'navigate').and.returnValue(mockPromise(true));

    component.handleResponseForSignatureTrackingFlow(iTPLVoucherParameterStateMock, transactionResponse);
    tick();

    expect(router.navigate).toHaveBeenCalledWith(['/loan/third-party-loans/voucher']);
  }));
});
