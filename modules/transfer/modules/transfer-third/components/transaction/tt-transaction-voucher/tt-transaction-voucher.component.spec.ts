import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TtTransactionVoucherComponent} from './tt-transaction-voucher.component';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {AdfButtonComponent, AdfFormatService} from '@adf/components';
import {
  StOperationHandlerService
} from 'src/app/modules/transaction-manager/modules/signature-tracking/services/execution/operations-transactions/st-operation-handler.service';
import {
  StProcessSingleTransactionService
} from 'src/app/modules/transaction-manager/modules/signature-tracking/services/execution/operations-transactions/st-process-single-transaction.service';
import {TransfersPrintService} from 'src/app/modules/transfer/prints/transfers-print.service';
import {UtilWorkFlowService} from 'src/app/service/common/util-work-flow.service';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {TtdTransferManagerService} from '../../../services/definition/transaction/manager/ttd-transfer-manager.service';
import {TteTransferVoucherService} from '../../../services/execution/tte-transfer-voucher.service';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {
  EThirdTransferUrlNavigationCollection,
  EThirdTransferViewMode
} from '../../../enums/third-transfer-navigate-parameters.enum';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {
  iThirdTransferTransactionStateMock
} from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';
import {
  ETHNavigationParameters
} from 'src/app/modules/transaction-manager/modules/transaction-history/enums/transaction-history.enum';
import {mockModal} from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import {clickElement} from "../../../../../../../../assets/testing";
import {EProfile} from "../../../../../../../enums/profile.enum";
import {EThirdTransferTypeTransaction} from "../../../enums/third-transfer-menu-options-licenses.enum";
import {
  ETransactionHistoryUrlNavigationCollection
} from "../../../../../../transaction-manager/modules/transaction-history/enums/th-navigate.enum";
import {
  ESignatureTrackingUrlFlow
} from "../../../../../../transaction-manager/modules/signature-tracking/enum/st-navigate-enum";

describe('TtTransactionVoucherComponent', () => {
  let component: TtTransactionVoucherComponent;
  let fixture: ComponentFixture<TtTransactionVoucherComponent>;

  let router: Router
  let modalService: jasmine.SpyObj<NgbModal>;
  let pdfService: jasmine.SpyObj<TransfersPrintService>;
  let thirdTransferManager: jasmine.SpyObj<TtdTransferManagerService>;
  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let confirmationScreenManager: jasmine.SpyObj<TteTransferVoucherService>;
  let stOperationHandler: jasmine.SpyObj<StOperationHandlerService>;
  let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>;
  let stProcessSingleTransaction: jasmine.SpyObj<StProcessSingleTransactionService>;
  let utils: jasmine.SpyObj<UtilService>;


  beforeEach(async () => {

    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])
    const pdfServiceSpy = jasmine.createSpyObj('TransfersPrintService', ['pdfGenerate'])
    const thirdTransferManagerSpy = jasmine.createSpyObj('TtdTransferManagerService', ['buildTransferVoucherStep2'])
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters', 'getParameter'])
    const confirmationScreenManagerSpy = jasmine.createSpyObj('TteTransferVoucherService', ['voucherLayoutsMainBuilder'])
    const stOperationHandlerSpy = jasmine.createSpyObj('StOperationHandlerService', ['operationManager'])
    const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['getHeadBandLayout', 'getHeadBandLayoutConfirm'])
    const adfFormatSpy = jasmine.createSpyObj('AdfFormatService', ['getFormatDateTime'])
    const stProcessSingleTransactionSpy = jasmine.createSpyObj('StProcessSingleTransactionService', ['execute'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['showLoader', 'hideLoader'])

    await TestBed.configureTestingModule({
      declarations: [TtTransactionVoucherComponent, AdfButtonComponent],
      providers: [
        {provide: NgbModal, useValue: modalServiceSpy},
        {provide: TransfersPrintService, useValue: pdfServiceSpy},
        {provide: TtdTransferManagerService, useValue: thirdTransferManagerSpy},
        {provide: ParameterManagementService, useValue: parameterManagementSpy},
        {provide: TteTransferVoucherService, useValue: confirmationScreenManagerSpy},
        {provide: StOperationHandlerService, useValue: stOperationHandlerSpy},
        {provide: UtilWorkFlowService, useValue: utilWorkFlowSpy},
        {provide: AdfFormatService, useValue: adfFormatSpy},
        {provide: StProcessSingleTransactionService, useValue: stProcessSingleTransactionSpy},
        {provide: UtilService, useValue: utilsSpy},
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                view: EThirdTransferViewMode.DEFAULT
              }
            }
          }
        }
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TtTransactionVoucherComponent);
    component = fixture.componentInstance;

    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    pdfService = TestBed.inject(TransfersPrintService) as jasmine.SpyObj<TransfersPrintService>;
    thirdTransferManager = TestBed.inject(TtdTransferManagerService) as jasmine.SpyObj<TtdTransferManagerService>;
    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    confirmationScreenManager = TestBed.inject(TteTransferVoucherService) as jasmine.SpyObj<TteTransferVoucherService>;
    stOperationHandler = TestBed.inject(StOperationHandlerService) as jasmine.SpyObj<StOperationHandlerService>;
    utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
    stProcessSingleTransaction = TestBed.inject(StProcessSingleTransactionService) as jasmine.SpyObj<StProcessSingleTransactionService>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    router = TestBed.inject(Router)
    spyOn(router.events, 'subscribe').and.callFake((observer: any) => {
      observer.next({navigationTrigger: 'popstate'} as any);
      return new Subscription();
    });

    const layoutJsonVoucher = 'layoutJsonVoucherModal' as any;
    const layoutJsonVoucherModal = 'layoutJsonVoucher' as any;
    const pdfLayout = 'pdfLayout' as any;
    const headBandLayout = 'headBandLayout' as any;

    confirmationScreenManager.voucherLayoutsMainBuilder.and.returnValue({
      layoutJsonVoucher,
      headBandLayout,
      layoutJsonVoucherModal,
      pdfLayout,
    })

    parameterManagement.getParameter.and.returnValue(iThirdTransferTransactionStateMock);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('test to return to prev step', () => {

    let router: Router;

    beforeEach(() => {
      router = TestBed.inject(Router);
      spyOn(router, 'navigate').and.callFake(() => Promise.resolve(true));
    })

    it('should got to the prevStep with profile sv', () => {
      component['profile'] = EProfile.SALVADOR;
      clickElement(fixture, 'adf-button.secondary')
      fixture.detectChanges()
      expect(parameterManagement.sendParameters).toHaveBeenCalledWith({
        navigateStateParameters: null,
        navigationProtectedParameter: null,
      })
      expect(router.navigate).toHaveBeenCalledWith([EThirdTransferUrlNavigationCollection.HOMESV]);
    })

    it('should got to the prevStep with profile hn', () => {
      component['profile'] = EProfile.HONDURAS;
      clickElement(fixture, 'adf-button.secondary')
      fixture.detectChanges()
      expect(parameterManagement.sendParameters).toHaveBeenCalledWith({
        navigateStateParameters: null,
        navigationProtectedParameter: null,
      })
      expect(router.navigate).toHaveBeenCalledWith([EThirdTransferUrlNavigationCollection.HOME]);
    })

    it('should got to the prevStep with profile pn', () => {
      component['profile'] = EProfile.PANAMA;
      clickElement(fixture, 'adf-button.secondary')
      fixture.detectChanges()
      expect(parameterManagement.sendParameters).toHaveBeenCalledWith({
        navigateStateParameters: null,
        navigationProtectedParameter: null,
      })
      expect(router.navigate).toHaveBeenCalledWith([EThirdTransferUrlNavigationCollection.HOME]);
    })

    it('should got to the prevStep with TRANSACTION_HISTORY', () => {
      component.viewMode = EThirdTransferViewMode.TRANSACTION_HISTORY
      fixture.detectChanges();
      clickElement(fixture, 'adf-button.secondary')
      fixture.detectChanges()
      expect(parameterManagement.sendParameters).toHaveBeenCalledWith({
        navigateStateParameters: null,
        navigationProtectedParameter: ETHNavigationParameters.CONSULT,
      })
      expect(router.navigate).toHaveBeenCalledWith([ETransactionHistoryUrlNavigationCollection.CONSULT])
    })

    it('should got to the prevStep with SIGNATURE_TRACKING_OPERATION', () => {
      component.viewMode = EThirdTransferViewMode.SIGNATURE_TRACKING_OPERATION
      fixture.detectChanges();
      clickElement(fixture, 'adf-button.secondary')
      fixture.detectChanges()
      expect(parameterManagement.sendParameters).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith([ESignatureTrackingUrlFlow.HOME])
    })

  })

  describe('test go to next step', () => {

    let router: Router;

    beforeEach(() => {
      router = TestBed.inject(Router);
      spyOn(router, 'navigate').and.callFake(() => Promise.resolve(true));
    })

    it('should go to the next step', () => {
      modalService.open.and.returnValue(mockModal as NgbModalRef)
      pdfService.pdfGenerate.and.callThrough();
      clickElement(fixture, 'adf-button.primary')
      fixture.detectChanges();
      expect(modalService.open).toHaveBeenCalled();
    })

    it('should go to the next step with SIGNATURE_TRACKING_OPERATION', () => {
      component.viewMode = EThirdTransferViewMode.SIGNATURE_TRACKING_OPERATION
      clickElement(fixture, 'adf-button.primary')
      fixture.detectChanges();
      expect(utils.showLoader).toHaveBeenCalled();
      expect(stOperationHandler.operationManager).toHaveBeenCalled();
    })

  })

  it('should buildVoucherForTransactionManager', () => {

    component.buildVoucherForTransactionManager();
    expect(confirmationScreenManager.voucherLayoutsMainBuilder).toHaveBeenCalledWith({
      date: component.dateTime as never,
      reference: component.reference as never,
      titlePdf: 'transfers-third-title',
      fileNamePdf: 'title-pdf:third-party-transfer',
      accountCredit: component.accountAccreditSelected as never,
      accountDebited: component.accountDebitedSelected as never,
      formValues: component.formValues as never,
      title: 'transfers-third-title',
      subtitle: 'transfer_confirmation',
    })

  })

  it('should signatureTransactionOperationDefinition', () => {

    parameterManagement.getParameter.and.returnValue({
      action: 'Test',
    })
    component.signatureTransactionOperationDefinition();
    expect(thirdTransferManager.buildTransferVoucherStep2).toHaveBeenCalled();
  })

  it('should buildVoucherToSignatureTrackingDetail', () => {


    component.buildVoucherToSignatureTrackingDetail();
    expect(thirdTransferManager.buildTransferVoucherStep2).toHaveBeenCalled();
    expect(component.isShowPrintButton).toBeFalsy();
  })

  it('should buildVoucherToSignatureTrackingModifyTransaction', () => {

    component.buildVoucherToSignatureTrackingModifyTransaction();
    expect(thirdTransferManager.buildTransferVoucherStep2).toHaveBeenCalled();
    expect(component.isShowPrintButton).toBeFalsy();
    expect(utilWorkFlow.getHeadBandLayoutConfirm).toHaveBeenCalled();
  })

  it('should view definition with view TRANSACTION_HISTORY', () => {
    component.viewMode = EThirdTransferViewMode.TRANSACTION_HISTORY;
    spyOn(component, 'buildVoucherForTransactionManager')
    component.viewDefinition();
    expect(component.buildVoucherForTransactionManager).toHaveBeenCalled();
  })

  it('should view definition with view SIGNATURE_TRACKING', () => {
    component.viewMode = EThirdTransferViewMode.SIGNATURE_TRACKING;
    spyOn(component, 'buildVoucherToSignatureTrackingModifyTransaction')
    component.viewDefinition();
    expect(component.buildVoucherToSignatureTrackingModifyTransaction).toHaveBeenCalled();
  })

  it('should view definition with view SIGNATURE_TRACKING_DETAIL', () => {
    component.viewMode = EThirdTransferViewMode.SIGNATURE_TRACKING_DETAIL;
    spyOn(component, 'buildVoucherToSignatureTrackingDetail')
    component.viewDefinition();
    expect(component.buildVoucherToSignatureTrackingDetail).toHaveBeenCalled();
  })

  it('should view definition with view SIGNATURE_TRACKING_OPERATION', () => {
    component.viewMode = EThirdTransferViewMode.SIGNATURE_TRACKING_OPERATION;
    spyOn(component, 'signatureTransactionOperationDefinition')
    component.viewDefinition();
    expect(component.signatureTransactionOperationDefinition).toHaveBeenCalled();
  })

  it('should view definition with view undefined', () => {
    component.viewMode = undefined as any;
    spyOn(component, 'buildVoucherToDefaultScreen')
    component.viewDefinition();
    expect(component.buildVoucherToDefaultScreen).toHaveBeenCalled();
  })

  it('should buildVoucherToDefaultScreen with transactionState DEFAULT', () => {
    spyOn(component, 'buildThirdTransferVoucher')
    parameterManagement.getParameter.and.returnValue({typeTransaction: EThirdTransferTypeTransaction.DEFAULT})
    fixture.detectChanges();
    component.buildVoucherToDefaultScreen();
    expect(component.buildThirdTransferVoucher).toHaveBeenCalled();
  })

  it('should buildVoucherToDefaultScreen with transactionState SIGNATURE_TRACKING', () => {
    spyOn(component, 'buildVoucherToSignatureTracking')
    parameterManagement.getParameter.and.returnValue({typeTransaction: EThirdTransferTypeTransaction.SIGNATURE_TRACKING})
    fixture.detectChanges();
    component.buildVoucherToDefaultScreen();
    expect(component.buildVoucherToSignatureTracking).toHaveBeenCalled();
    expect(component.isShowPrintButton).toBeFalsy();
    expect(component.isSignature).toBeTruthy();
    expect(component.isShowHeadband).toBeFalsy();
  })

});
