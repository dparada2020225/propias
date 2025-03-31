import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AdfButtonComponent, AdfFormatService } from '@adf/components';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { TransfersPrintService } from 'src/app/modules/transfer/prints/transfers-print.service';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { iConfirmationDataMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { mockModal } from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import { clickElement, mockPromise } from 'src/assets/testing';
import { ENavigateProtectionParameter, EPaymentLoansFlowView } from '../../enum/navigate-protection-parameter.enum';
import { EConfirmationAction } from '../../enum/payment-form.enum';
import { TplCrudManagerService } from '../../services/definition/crud/tpl-crud-manager.service';
import { TpldPaymentManagerService } from '../../services/definition/payment/tpld-payment-manager.service';
import { TpleThirdPartyLoansService } from '../../services/execution/third-party-loan-payment/tple-third-party-loans.service';
import { TplConfirmationScreenComponent } from './tpl-confirmation-screen.component';

describe('TplConfirmationScreenComponent', () => {
  let component: TplConfirmationScreenComponent;
  let fixture: ComponentFixture<TplConfirmationScreenComponent>;

  let confirmationManagerService: jasmine.SpyObj<TplCrudManagerService>;
  let FormatService: jasmine.SpyObj<AdfFormatService>;
  let parameterManagementService: jasmine.SpyObj<ParameterManagementService>;
  let paymentManagerDefinition: jasmine.SpyObj<TpldPaymentManagerService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let pdfService: jasmine.SpyObj<TransfersPrintService>;
  let util: jasmine.SpyObj<UtilService>;
  let thirdPartyLoansExecuteService: jasmine.SpyObj<TpleThirdPartyLoansService>;
  let router: Router;

  beforeEach(async () => {
    const confirmationManagerServiceSpy = jasmine.createSpyObj('TplCrudManagerService', ['buildConfirmationLayout', 'buildHeadBandLayout']);
    const FormatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['getFormatDateTime']);
    const parameterManagementServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters']);
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['']);
    const paymentManagerDefinitionSpy = jasmine.createSpyObj('TpldPaymentManagerService', [
      'buildVoucherPaymentModal',
      'buildVoucherPaymentPDF',
    ]);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    const pdfServiceSpy = jasmine.createSpyObj('TransfersPrintService', ['pdfGenerate']);
    const utilSpy = jasmine.createSpyObj('UtilService', ['hideLoader', 'getCurrencySymbolToIso']);
    const thirdPartyLoansExecuteServiceSpy = jasmine.createSpyObj('TpleThirdPartyLoansService', ['gotToPayment']);
    await TestBed.configureTestingModule({
      declarations: [TplConfirmationScreenComponent, AdfButtonComponent],
      providers: [
        { provide: TplCrudManagerService, useValue: confirmationManagerServiceSpy },
        { provide: AdfFormatService, useValue: FormatServiceSpy },
        { provide: ParameterManagementService, useValue: parameterManagementServiceSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: TpldPaymentManagerService, useValue: paymentManagerDefinitionSpy },

        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: TransfersPrintService, useValue: pdfServiceSpy },
        { provide: UtilService, useValue: utilSpy },
        { provide: TpleThirdPartyLoansService, useValue: thirdPartyLoansExecuteServiceSpy },
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

    fixture = TestBed.createComponent(TplConfirmationScreenComponent);
    component = fixture.componentInstance;

    confirmationManagerService = TestBed.inject(TplCrudManagerService) as jasmine.SpyObj<TplCrudManagerService>;
    FormatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
    parameterManagementService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    paymentManagerDefinition = TestBed.inject(TpldPaymentManagerService) as jasmine.SpyObj<TpldPaymentManagerService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    pdfService = TestBed.inject(TransfersPrintService) as jasmine.SpyObj<TransfersPrintService>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    thirdPartyLoansExecuteService = TestBed.inject(TpleThirdPartyLoansService) as jasmine.SpyObj<TpleThirdPartyLoansService>;
    router = TestBed.inject(Router);

    spyOn(router.events, 'subscribe').and.callFake((observer: any) => {
      observer.next({ navigationTrigger: 'popstate' } as any);
      return new Subscription();
    });

    parameterManagementService.getParameter.and.returnValue(iConfirmationDataMock);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(confirmationManagerService.buildConfirmationLayout).toHaveBeenCalled();
  });

  it('should build Confirmation when view = CREATE', () => {
    const data = { ...iConfirmationDataMock };
    data.action = EConfirmationAction.CREATE;

    component.buildConfirmation(data);

    expect(component.typeButton).toEqual('secondary');
    expect(component.showPrintButton).toBeFalsy();
    expect(component.showPaymentButton).toBeTruthy();
  });

  it('should build Confirmation when view = PAYMENT', () => {
    const data = { ...iConfirmationDataMock };
    data.action = EConfirmationAction.PAYMENT;

    component.buildConfirmation(data);

    expect(component.typeButton).toEqual('secondary');
    expect(component.showPrintButton).toBeTruthy();
    expect(component.showPaymentButton).toBeFalsy();
    expect(FormatService.getFormatDateTime).toHaveBeenCalled();
  });

  it('should build Confirmation when view = ERROR_PAYMENT', () => {
    const data = { ...iConfirmationDataMock };
    data.action = EConfirmationAction.ERROR_PAYMENT;

    component.buildConfirmation(data);

    expect(component.typeButton).toEqual('primary');
    expect(component.showPrintButton).toBeFalsy();
    expect(component.showPaymentButton).toBeFalsy();
  });

  it('should back when is Error', fakeAsync(() => {
    spyOn(router, 'navigate').and.returnValue(mockPromise(true));
    parameterManagementService.getParameter.and.returnValue({ isError: true, currentState: 'true' });
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();
    tick();
    expect(parameterManagementService.sendParameters).toHaveBeenCalledWith({
      navigationProtectedParameter: ENavigateProtectionParameter.PAYMENT,
      navigateStateParameters: 'true',
    });
    expect(router.navigate).toHaveBeenCalledWith(['/loan/third-party-loans/payment']);
  }));

  it('should back when currentView = ALL_LOANS', fakeAsync(() => {
    component.currentView = EPaymentLoansFlowView.ALL_LOANS;
    fixture.detectChanges();
    spyOn(router, 'navigate').and.returnValue(mockPromise(true));
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/loan/third-party-loans/all']);
    expect(parameterManagementService.sendParameters).toHaveBeenCalledWith({
      navigationProtectedParameter: null,
      navigateStateParameters: null,
    });
  }));

  it('should back when currentView = THIRD_PARTY_LOANS', fakeAsync(() => {
    component.currentView = EPaymentLoansFlowView.THIRD_PARTY_LOANS;
    fixture.detectChanges();
    spyOn(router, 'navigate').and.returnValue(mockPromise(true));
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/loan/third-party-loans']);
    expect(parameterManagementService.sendParameters).toHaveBeenCalledWith({
      navigationProtectedParameter: null,
      navigateStateParameters: null,
    });
  }));

  it('should go to payment', () => {
    component.showPaymentButton = true;
    component.showPrintButton = false;
    fixture.detectChanges();

    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();

    expect(util.getCurrencySymbolToIso).toHaveBeenCalled();
    expect(thirdPartyLoansExecuteService.gotToPayment).toHaveBeenCalled();
  });

  it('should get Data Voucher Modal', fakeAsync(() => {
    modalService.open.and.returnValue(mockModal as NgbModalRef);
    paymentManagerDefinition.buildVoucherPaymentPDF.and.returnValue({
      account: {} as any,
      reference: 'qwedfsd',
      title: 'pdf',
      fileName: 'fileName',
      items: {} as any,
    });
    component.showPaymentButton = false;
    component.showPrintButton = true;
    fixture.detectChanges();

    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    tick();

    expect(paymentManagerDefinition.buildVoucherPaymentModal).toHaveBeenCalled();
    expect(pdfService.pdfGenerate).toHaveBeenCalled();
  }));
});
