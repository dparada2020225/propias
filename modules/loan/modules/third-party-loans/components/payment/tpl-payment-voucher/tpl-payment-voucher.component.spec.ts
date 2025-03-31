import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {AdfButtonComponent, AdfFormatService} from '@adf/components';
import {Location} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subscription} from 'rxjs';
import {
  IMultipleRequestResponse
} from 'src/app/modules/transaction-manager/modules/signature-tracking/interfaces/signature-tracking.interface';
import {
  StOperationHandlerService
} from 'src/app/modules/transaction-manager/modules/signature-tracking/services/execution/operations-transactions/st-operation-handler.service';
import {
  StProcessSingleTransactionService
} from 'src/app/modules/transaction-manager/modules/signature-tracking/services/execution/operations-transactions/st-process-single-transaction.service';
import {
  SignatureTrackingService
} from 'src/app/modules/transaction-manager/modules/signature-tracking/services/transaction/signature-tracking.service';
import {TransfersPrintService} from 'src/app/modules/transfer/prints/transfers-print.service';
import {UtilWorkFlowService} from 'src/app/service/common/util-work-flow.service';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {iLoansResponseMock, iReceiptResponseMock} from 'src/assets/mocks/modules/loan/loan.data.mock';
import {mockModal} from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import {clickElement, mockObservable, mockObservableError, mockPromise} from 'src/assets/testing';
import {ENavigateProtectionParameter} from '../../../enum/navigate-protection-parameter.enum';
import {TPLPTypeView} from '../../../enum/payment.interface';
import {TpldPaymentManagerService} from '../../../services/definition/payment/tpld-payment-manager.service';
import {TpldPaymentStVoucherService} from '../../../services/definition/payment/tpld-payment-st-voucher.service';
import {ThirdPartyLoansService} from '../../../services/transaction/third-party-loans.service';
import {TplPaymentVoucherComponent} from './tpl-payment-voucher.component';

describe('TplPaymentVoucherComponent', () => {
  let component: TplPaymentVoucherComponent;
  let fixture: ComponentFixture<TplPaymentVoucherComponent>;

  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let stVoucherManager: jasmine.SpyObj<TpldPaymentStVoucherService>;
  let transactionService: jasmine.SpyObj<SignatureTrackingService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let utils: jasmine.SpyObj<UtilService>;
  let location: jasmine.SpyObj<Location>;
  let adfFormat: jasmine.SpyObj<AdfFormatService>;
  let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>;
  let tplPaymentService: jasmine.SpyObj<ThirdPartyLoansService>;
  let stOperationHandler: jasmine.SpyObj<StOperationHandlerService>;
  let paymentManagerDefinition: jasmine.SpyObj<TpldPaymentManagerService>;
  let pdfService: jasmine.SpyObj<TransfersPrintService>;
  let router: Router;

  beforeEach(async () => {
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters']);
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    const stVoucherManagerSpy = jasmine.createSpyObj('TpldPaymentStVoucherService', [
      'buildLayoutVoucher',
      'buildTransactionHistoryTPLVoucher',
    ]);
    const transactionServiceSpy = jasmine.createSpyObj('SignatureTrackingService', ['update']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    const utilsSpy = jasmine.createSpyObj('UtilService', ['showLoader', 'hideLoader', 'scrollToTop']);
    const locationSpy = jasmine.createSpyObj('Location', ['back']);
    const adfFormatSpy = jasmine.createSpyObj('AdfFormatService', ['getFormatDateTime']);
    const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['getHeadBandLayout']);
    const tplPaymentServiceSpy = jasmine.createSpyObj('ThirdPartyLoansService', ['getReceipt']);
    const stOperationHandlerSpy = jasmine.createSpyObj('StOperationHandlerService', ['operationManager']);
    const stProcessSingleTransactionSpy = jasmine.createSpyObj('StProcessSingleTransactionService', ['execute']);
    const paymentManagerDefinitionSpy = jasmine.createSpyObj('TpldPaymentManagerService', [
      'buildVoucherPaymentModal',
      'buildVoucherPaymentPDF',
    ]);
    const pdfServiceSpy = jasmine.createSpyObj('TransfersPrintService', ['pdfGenerate']);
    await TestBed.configureTestingModule({
      declarations: [TplPaymentVoucherComponent, AdfButtonComponent],
      providers: [
        { provide: ParameterManagementService, useValue: parameterManagementSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: TpldPaymentStVoucherService, useValue: stVoucherManagerSpy },
        { provide: SignatureTrackingService, useValue: transactionServiceSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: UtilService, useValue: utilsSpy },
        { provide: Location, useValue: locationSpy },
        { provide: AdfFormatService, useValue: adfFormatSpy },
        { provide: UtilWorkFlowService, useValue: utilWorkFlowSpy },
        { provide: ThirdPartyLoansService, useValue: tplPaymentServiceSpy },
        { provide: StOperationHandlerService, useValue: stOperationHandlerSpy },
        { provide: StProcessSingleTransactionService, useValue: stProcessSingleTransactionSpy },
        { provide: TpldPaymentManagerService, useValue: paymentManagerDefinitionSpy },
        { provide: TransfersPrintService, useValue: pdfServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                view: TPLPTypeView.DEFAULT,
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

    fixture = TestBed.createComponent(TplPaymentVoucherComponent);
    component = fixture.componentInstance;
    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    stVoucherManager = TestBed.inject(TpldPaymentStVoucherService) as jasmine.SpyObj<TpldPaymentStVoucherService>;
    transactionService = TestBed.inject(SignatureTrackingService) as jasmine.SpyObj<SignatureTrackingService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    adfFormat = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
    utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;

    tplPaymentService = TestBed.inject(ThirdPartyLoansService) as jasmine.SpyObj<ThirdPartyLoansService>;
    stOperationHandler = TestBed.inject(StOperationHandlerService) as jasmine.SpyObj<StOperationHandlerService>;
    paymentManagerDefinition = TestBed.inject(TpldPaymentManagerService) as jasmine.SpyObj<TpldPaymentManagerService>;
    pdfService = TestBed.inject(TransfersPrintService) as jasmine.SpyObj<TransfersPrintService>;
    router = TestBed.inject(Router);

    spyOn(router.events, 'subscribe').and.callFake((observer: any) => {
      observer.next({ navigationTrigger: 'popstate' } as any);
      return new Subscription();
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build Voucher By View is ST_DETAIL_TRANSACTION', () => {
    parameterManagement.getParameter.and.returnValue({ message: 'test' });
    component.view = TPLPTypeView.ST_DETAIL_TRANSACTION;
    fixture.detectChanges();
    component.buildVoucherByView();
    expect(component.isShowHeadband).toBeFalsy();
    expect(component.isShowPrintButton).toBeFalsy();
    expect(stVoucherManager.buildLayoutVoucher).toHaveBeenCalled();
    expect(component.typeAlert).toEqual('info');
    expect(component.messageAlert).toEqual('test');
  });

  xit('should build Voucher By View is ST_OPERATIONS', () => {
    parameterManagement.getParameter.and.returnValue({ operation: 'delete' });
    component.view = TPLPTypeView.ST_OPERATIONS;
    fixture.detectChanges();
    component.buildVoucherByView();
    expect(component.printButtonMessage).toEqual('delete');
    expect(stVoucherManager.buildLayoutVoucher).toHaveBeenCalled();
  });

  it('should build Voucher By View is ST_CONFIRM_TRANSACTION', () => {
    parameterManagement.getParameter.and.returnValue({
      amount: 654,
      data: {},
      detailTransaction: {},
      selectedSourceAccount: {},
    });
    component.view = TPLPTypeView.ST_CONFIRM_TRANSACTION;
    fixture.detectChanges();
    component.buildVoucherByView();

    expect(component.isShowHeadband).toBeFalsy();
    expect(component.printButtonMessage).toEqual('t.confirm');
    expect(stVoucherManager.buildLayoutVoucher).toHaveBeenCalled();
  });

  it('should build Voucher By View is ST_MODIFY_TRANSACTIONS', () => {
    parameterManagement.getParameter.and.returnValue({
      data: {},
      reference: 'DVFWE',
    });
    component.view = TPLPTypeView.ST_MODIFY_TRANSACTIONS;
    fixture.detectChanges();
    component.buildVoucherByView();

    expect(component.isShowPrintButton).toBeFalsy();
    expect(component.typeAlert).toEqual('success');
    expect(component.messageAlert).toEqual('signature_trackingModifyMessage');
    expect(adfFormat.getFormatDateTime).toHaveBeenCalled();
    expect(stVoucherManager.buildLayoutVoucher).toHaveBeenCalled();
  });

  it('should build Voucher By View is TRANSACTION_HISTORY', () => {
    parameterManagement.getParameter.and.returnValue({
      transactionSelected: {},
      detail: {},
      data: {},
    });
    component.view = TPLPTypeView.TRANSACTION_HISTORY;
    fixture.detectChanges();
    component.buildVoucherByView();

    expect(stVoucherManager.buildTransactionHistoryTPLVoucher).toHaveBeenCalled();
    expect(utilWorkFlow.getHeadBandLayout).toHaveBeenCalled();
    expect(paymentManagerDefinition.buildVoucherPaymentModal).toHaveBeenCalled();
  });

  it('should go back when view = DEFAUL', fakeAsync(() => {
    parameterManagement.getParameter.and.returnValue(null);
    component.view = TPLPTypeView.DEFAULT;
    spyOn(router, 'navigate').and.returnValue(mockPromise(true));
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/loan/third-party-loans']);
  }));

  it('should go back when view = ST_CONFIRM_TRANSACTION', () => {
    component.view = TPLPTypeView.ST_CONFIRM_TRANSACTION;
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();
    expect(parameterManagement.sendParameters).toHaveBeenCalledWith({
      navigationProtectedParameter: ENavigateProtectionParameter.FORM_ST_MODIFY_PAYMENT,
    });

    expect(location.back).toHaveBeenCalled();
  });

  xit('should go back when view = ST_MODIFY_TRANSACTIONS', fakeAsync(() => {
    component.view = TPLPTypeView.ST_MODIFY_TRANSACTIONS;
    spyOn(router, 'navigate').and.returnValue(mockPromise(true));
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/transaction-manager-payroll/signature-tracking']);
  }));

  xit('should go back when view = ST_OPERATIONS', fakeAsync(() => {
    component.view = TPLPTypeView.ST_OPERATIONS;
    spyOn(router, 'navigate').and.returnValue(mockPromise(true));
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/transaction-manager-payroll/signature-tracking']);
  }));

  xit('should go back when view = TRANSACTION_HISTORY', fakeAsync(() => {
    component.view = TPLPTypeView.TRANSACTION_HISTORY;
    spyOn(router, 'navigate').and.returnValue(mockPromise(true));
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/transaction-manager-payroll/history/consult']);
  }));

  it('should print when view = TRANSACTION_HISTORY', fakeAsync(() => {
    component.isShowPrintButton = true;
    fixture.detectChanges();
    paymentManagerDefinition.buildVoucherPaymentPDF.and.returnValue({
      account: {} as any,
      reference: 'qwedfsd',
      title: 'pdf',
      fileName: 'fileName',
      items: {} as any,
    });
    modalService.open.and.returnValue(mockModal as NgbModalRef);
    component.view = TPLPTypeView.TRANSACTION_HISTORY;
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    tick();
    expect(modalService.open).toHaveBeenCalled();
    expect(pdfService.pdfGenerate).toHaveBeenCalled();
  }));

  it('should print when view = ST_OPERATIONS', () => {
    component.isShowPrintButton = true;
    fixture.detectChanges();

    parameterManagement.getParameter.and.returnValue({
      transactionSelected: {},
      tabPosition: {},
    });

    component.view = TPLPTypeView.ST_OPERATIONS;
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    expect(stOperationHandler.operationManager).toHaveBeenCalled();
  });

  xit('should print when view = ST_CONFIRM_TRANSACTION', () => {
    component.isShowPrintButton = true;
    fixture.detectChanges();
    spyOn(router, 'navigate').and.returnValue(mockPromise(true));
    parameterManagement.getParameter.and.returnValue({
      transaction: {},
      detailTransaction: {},
      amount: 54,
    });

    tplPaymentService.getReceipt.and.returnValue(mockObservable(iReceiptResponseMock));
    transactionService.update.and.returnValue(mockObservable(iLoansResponseMock as IMultipleRequestResponse));

    component.view = TPLPTypeView.ST_CONFIRM_TRANSACTION;
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/loan/third-party-loans/stm-voucher']);
  });

  xit('should print when view = ST_CONFIRM_TRANSACTION but update have error', () => {
    component.isShowPrintButton = true;
    fixture.detectChanges();
    parameterManagement.getParameter.and.returnValue({
      transaction: {},
      detailTransaction: {},
      amount: 54,
    });
    tplPaymentService.getReceipt.and.returnValue(mockObservable(iReceiptResponseMock));
    transactionService.update.and.returnValue(mockObservableError({}));
    component.view = TPLPTypeView.ST_CONFIRM_TRANSACTION;
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    expect(component.typeAlert).toEqual('error');
    expect(utils.scrollToTop).toHaveBeenCalled();
  });

  it('should print when view = ST_CONFIRM_TRANSACTION but getReceipt have error', () => {
    component.isShowPrintButton = true;
    fixture.detectChanges();
    parameterManagement.getParameter.and.returnValue({
      transaction: {},
      detailTransaction: {},
      amount: 54,
    });
    tplPaymentService.getReceipt.and.returnValue(mockObservableError({}));
    component.view = TPLPTypeView.ST_CONFIRM_TRANSACTION;
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    expect(component.typeAlert).toEqual('error');
    expect(utils.scrollToTop).toHaveBeenCalled();
  });

  it('should hidden alert', () => {
    component.hiddenAlert();
    expect(component.typeAlert).toBeNull();
    expect(component.messageAlert).toBeNull();
  });
});
