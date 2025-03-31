import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PmppVoucherComponent} from './pmpp-voucher.component';
import {ParameterManagementService} from "../../../../../../service/navegation-parameters/parameter-management.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UtilService} from "../../../../../../service/common/util.service";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {SppPrintVoucherService} from "../../../print/spp-print-voucher.service";
import {PmpeVoucherService} from "../../../services/execution/pmpe-voucher.service";
import {PmpTransactionService} from "../../../services/transaction/pmp-transaction.service";
import {
  StOperationHandlerService
} from "../../../../../transaction-manager/modules/signature-tracking/services/execution/operations-transactions/st-operation-handler.service";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {MockTranslatePipe} from "../../../../../../../assets/mocks/public/tranlatePipeMock";
import {SPPPaymentView} from "../../../enums/pmp-view.enum";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {clickElement, mockObservable, mockPromise} from "../../../../../../../assets/testing";
import {SPPMRoutes} from "../../../enums/pmp-routes.enum";
import {
  ETransactionHistoryUrlNavigationCollection
} from "../../../../../transaction-manager/modules/transaction-history/enums/th-navigate.enum";
import {
  ESignatureTrackingUrlFlow
} from "../../../../../transaction-manager/modules/signature-tracking/enum/st-navigate-enum";
import {
  mockModal
} from "../../../../../../../assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock";
import {
  ESignatureTrackingTypeAction
} from "../../../../../transaction-manager/modules/signature-tracking/enum/st-transaction-status.enum";
import {
  StsProcessPaymentOfPayrollService
} from "../../../../../transaction-manager/modules/signature-tracking/services/execution/process-single/sts-process-payment-of-payroll.service";
import {iAccount} from "../../../../../../../assets/mocks/modules/signature-tracking/mocksDetailTransaction";
import {
  iGetDataPayrollMock,
  iPayedPayrollDetailResponseMock,
  iPayrollPaySuccessMock
} from "../../../../../../../assets/mocks/modules/payroll/payroll.mock";

describe('SppVoucherComponent', () => {
  let component: PmppVoucherComponent;
  let fixture: ComponentFixture<PmppVoucherComponent>;

  let parameterManager: jasmine.SpyObj<ParameterManagementService>;
  let router: jasmine.SpyObj<Router>;
  let utils: jasmine.SpyObj<UtilService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let pdfService: jasmine.SpyObj<SppPrintVoucherService>;
  let voucherExecution: jasmine.SpyObj<PmpeVoucherService>;
  let paymentTransaction: jasmine.SpyObj<PmpTransactionService>;
  let stOperationHandler: jasmine.SpyObj<StOperationHandlerService>;
  let stProcess: jasmine.SpyObj<StsProcessPaymentOfPayrollService>;

  beforeEach(async () => {

    const parameterManagerSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters', 'getParameter'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['getDate', 'hideLoader', 'showLoader', 'getProfile'])
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])
    const pdfServiceSpy = jasmine.createSpyObj('SppPrintVoucherService', ['pdfGenerate'])
    const voucherExecutionSpy = jasmine.createSpyObj('PmpeVoucherService', ['buildDefaultVoucherForSignatureTracking', 'buildDefaultVoucher', 'buildSignatureTrackingVoucherLayout'])
    const paymentTransactionSpy = jasmine.createSpyObj('PmpTransactionService', ['getPayedPayrollDetail'])
    const stOperationHandlerSpy = jasmine.createSpyObj('StOperationHandlerService', ['operationManager'])
    const stProcessSpy = jasmine.createSpyObj('StsProcessPaymentOfPayrollService', ['execute'])

    await TestBed.configureTestingModule({
      declarations: [PmppVoucherComponent, MockTranslatePipe],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              data: {
                view: SPPPaymentView.DEFAULT
              }
            }
          }
        },
        {provide: ParameterManagementService, useValue: parameterManagerSpy},
        {provide: Router, useValue: routerSpy},
        {provide: UtilService, useValue: utilsSpy},
        {provide: NgbModal, useValue: modalServiceSpy},
        {provide: SppPrintVoucherService, useValue: pdfServiceSpy},
        {provide: PmpeVoucherService, useValue: voucherExecutionSpy},
        {provide: PmpTransactionService, useValue: paymentTransactionSpy},
        {provide: StOperationHandlerService, useValue: stOperationHandlerSpy},
        {provide: StsProcessPaymentOfPayrollService, useValue: stProcessSpy},
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PmppVoucherComponent);
    component = fixture.componentInstance;

    parameterManager = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    pdfService = TestBed.inject(SppPrintVoucherService) as jasmine.SpyObj<SppPrintVoucherService>;
    voucherExecution = TestBed.inject(PmpeVoucherService) as jasmine.SpyObj<PmpeVoucherService>;
    paymentTransaction = TestBed.inject(PmpTransactionService) as jasmine.SpyObj<PmpTransactionService>;
    stOperationHandler = TestBed.inject(StOperationHandlerService) as jasmine.SpyObj<StOperationHandlerService>;
    stProcess = TestBed.inject(StsProcessPaymentOfPayrollService) as jasmine.SpyObj<StsProcessPaymentOfPayrollService>;

    parameterManager.getParameter.withArgs('navigateStateParameters').and.returnValue({
      sourceAccountSelected: iAccount,
      paymentDetail: iGetDataPayrollMock,
      serviceResponse: iPayrollPaySuccessMock
    })

    voucherExecution.buildDefaultVoucher.and.returnValue({
      pdfVoucherLayout: {} as any,
      headBandLayout: {} as any,
      mainTableLayout: {} as any,
      modalLayout: {} as any,
      tableModalLayout: {} as any,
      voucherLayout: {} as any
    })

    router.navigate.and.returnValue(mockPromise(true))

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go back with view SPPPaymentView.ST_VOUCHER', () => {
    component.view = SPPPaymentView.ST_VOUCHER;
    fixture.detectChanges()

    clickElement(fixture, 'back', true);
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([SPPMRoutes.HOME])
  })

  it('should go back with view SPPPaymentView.TH_VOUCHER', () => {
    component.view = SPPPaymentView.TH_VOUCHER;
    fixture.detectChanges()

    clickElement(fixture, 'back', true);
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([ETransactionHistoryUrlNavigationCollection.CONSULT])
  })

  it('should go back with view SPPPaymentView.ST_OPERATION', () => {
    component.view = SPPPaymentView.ST_OPERATION;
    fixture.detectChanges()

    clickElement(fixture, 'back', true);
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([ESignatureTrackingUrlFlow.HOME])
  })

  it('should print voucher', () => {
    modalService.open.and.returnValue(mockModal as NgbModalRef);

    clickElement(fixture, 'print', true)
    fixture.detectChanges();

    expect(modalService.open).toHaveBeenCalled();
  })

  it('should Process transaction with signature tracking', () => {
    component.view = SPPPaymentView.ST_OPERATION;
    parameterManager.getParameter.withArgs('navigateStateParameters').and.returnValue({action: ESignatureTrackingTypeAction.SEND})
    fixture.detectChanges();

    clickElement(fixture, 'print', true)
    fixture.detectChanges();

    expect(stOperationHandler.operationManager).toHaveBeenCalled();
  })

  it('should launch View with view ST_VOUCHER', () => {
    voucherExecution.buildDefaultVoucherForSignatureTracking.and.returnValue({
      voucherLayout: {},
      mainTableLayout: {}
    } as any)
    component.view = SPPPaymentView.ST_VOUCHER;
    fixture.detectChanges();

    component.launchView();

    expect(voucherExecution.buildDefaultVoucherForSignatureTracking).toHaveBeenCalled();
    expect(component.isDisabledHeadband).toBeTruthy();
    expect(component.isDisabledPrintButton).toBeTruthy();
  })

  it('should getRegisters and build Voucher For Signature Tracking Detail', () => {
    component.view = SPPPaymentView.ST_DETAIL;
    paymentTransaction.getPayedPayrollDetail.and.returnValue(mockObservable(iPayedPayrollDetailResponseMock))
    voucherExecution.buildSignatureTrackingVoucherLayout.and.returnValue({
      mainTableLayout: {} as any,
      voucherLayout: {} as any
    })
    fixture.detectChanges();

    component.getRegisters();

    expect(component.helperTitle).toEqual('signature_tracking')
    expect(component.helperSubtitle).toEqual('view_detail_transaction')

  })

  it('should getRegisters and build Voucher For Signature Tracking Operations', () => {
    parameterManager.getParameter.withArgs('navigateStateParameters').and.returnValue({
      action: 'send_transaction'
    })

    component.view = SPPPaymentView.ST_OPERATION;
    paymentTransaction.getPayedPayrollDetail.and.returnValue(mockObservable(iPayedPayrollDetailResponseMock))

    voucherExecution.buildSignatureTrackingVoucherLayout.and.returnValue({
      mainTableLayout: {} as any,
      voucherLayout: {} as any
    })
    fixture.detectChanges();

    component.getRegisters();

    expect(component.helperTitle).toEqual('signature_tracking')

  })

});
