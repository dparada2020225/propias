import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {AdfComponentsModule, AdfFormatService} from '@adf/components';
import {CommonModule} from '@angular/common';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {NgbModal, NgbModalRef, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {NgxDropzoneModule} from 'ngx-dropzone';
import {NgxSpinnerModule} from 'ngx-spinner';
import {Subscription} from 'rxjs';
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
import {mockModal} from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import {
  iOTDFormMock,
  iOTEVoucherLayoutRenponceMock,
  iOwnTransferStateMockDefault,
  iOwnTransferSTVoucherParamMock,
  IPrintMock,
} from 'src/assets/mocks/modules/transfer/service/own-transfer/own.data.mock';
import {EOwnTransferTypeTransaction} from '../../enum/own-transfer-control-name.enum';
import {EOwnTransferViewMode} from '../../enum/own-transfer.enum';
import {OteTransferManagerService} from '../../services/execution/ote-transfer-manager.service';
import {OwnVoucherComponent} from './own-voucher.component';

describe('OwnVoucherComponent', () => {
  let component: OwnVoucherComponent;
  let fixture: ComponentFixture<OwnVoucherComponent>;

  let router: Router;
  let modalService: jasmine.SpyObj<NgbModal>;
  let executionServiceManager: jasmine.SpyObj<OteTransferManagerService>;
  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let pdfService: jasmine.SpyObj<TransfersPrintService>;
  let stProcessSingleTransaction: jasmine.SpyObj<StProcessSingleTransactionService>;
  let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>;
  let formatService: jasmine.SpyObj<AdfFormatService>;
  let utils: jasmine.SpyObj<UtilService>;

  beforeEach(async () => {
    const formatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['getFormatDateTime', 'formatAmount']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    const executionServiceManagerSpy = jasmine.createSpyObj('OteTransferManagerService', ['voucherLayoutsMainBuilderStep3', '']);
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters']);
    const pdfServiceSpy = jasmine.createSpyObj('TransfersPrintService', ['pdfGenerate']);
    const stOperationHandlerSpy = jasmine.createSpyObj('StOperationHandlerService', ['operationManager']);
    const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['getHeadBandLayoutConfirm', 'getUserDataTransaction']);
    const stProcessSingconstransactionSpy = jasmine.createSpyObj('StProcessSingleTransactionService', ['execute']);
    const utilsSpy = jasmine.createSpyObj('UtilService', ['showLoader', 'hideLoader', 'geCurrencSymbol']);

    await TestBed.configureTestingModule({
      declarations: [OwnVoucherComponent],
      providers: [
        { provide: AdfFormatService, useValue: formatServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                view: EOwnTransferViewMode.DEFAULT,
              },
            },
          },
        },
        { provide: Location, useValue: {} },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: OteTransferManagerService, useValue: executionServiceManagerSpy },
        { provide: ParameterManagementService, useValue: parameterManagementSpy },
        { provide: TransfersPrintService, useValue: pdfServiceSpy },
        { provide: StOperationHandlerService, useValue: stOperationHandlerSpy },
        { provide: UtilWorkFlowService, useValue: utilWorkFlowSpy },
        { provide: StProcessSingleTransactionService, useValue: stProcessSingconstransactionSpy },
        { provide: UtilService, useValue: utilsSpy },
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        AdfComponentsModule,
        NgbModule,
        NgxSpinnerModule,
        NgxDropzoneModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OwnVoucherComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    formatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    executionServiceManager = TestBed.inject(OteTransferManagerService) as jasmine.SpyObj<OteTransferManagerService>;
    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    pdfService = TestBed.inject(TransfersPrintService) as jasmine.SpyObj<TransfersPrintService>;
    utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
    stProcessSingleTransaction = TestBed.inject(StProcessSingleTransactionService) as jasmine.SpyObj<StProcessSingleTransactionService>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;

    spyOn(router.events, 'subscribe').and.callFake((observer: any) => {
      observer.next({ navigationTrigger: 'popstate' } as any);
      return new Subscription();
    });
    parameterManagement.getParameter.and.returnValue(iOwnTransferStateMockDefault.accreditAccount);
    executionServiceManager.voucherLayoutsMainBuilderStep3.and.returnValue(iOTEVoucherLayoutRenponceMock);

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
    expect(component.typeAlert).toBeUndefined();
    expect(component.messageAlert).toBeUndefined();
  });

  it('should reset storage', () => {
    component.resetStorage('nav');
    expect(parameterManagement.sendParameters).toHaveBeenCalledWith({
      navigationProtectedParameter: 'nav',
      navigateStateParameters: null,
    });
  });

  it('should storageToBackSignatureTracking', () => {
    component.storageToBackSignatureTracking(12);
    expect(parameterManagement.sendParameters).toHaveBeenCalledWith({
      navigationProtectedParameter: null,
      navigateStateParameters: {
        position: 12,
      },
    });
  });

  it('exportFile', () => {
    component.pdfLayout = IPrintMock;
    fixture.detectChanges();
    component.exportFile();
    expect(pdfService.pdfGenerate).toHaveBeenCalled();
    expect(component.exportFile).toBeDefined();
  });

  it('voucherLayoutForTransactionHistory', () => {
    component.voucherLayoutForTransactionHistory();
    expect(component.voucherLayoutForTransactionHistory).toBeDefined();
  });

  it('handleExecuteOperation', () => {
    component.handleExecuteOperation();
    expect(component.handleExecuteOperation).toBeDefined();
    expect(stProcessSingleTransaction.execute).toBeDefined();
    expect(utils.showLoader).toHaveBeenCalled();
  });

  it('buildSignatureTrackingScreen', () => {
    const translate = TestBed.inject(TranslateService);
    spyOn(translate, 'instant').and.returnValue('KEY');
    component.buildSignatureTrackingScreen(iOwnTransferSTVoucherParamMock);
    expect(component.buildSignatureTrackingScreen).toBeDefined();
  });

  it('buildVoucherForUpdateTransactionMode', () => {
    const translate = TestBed.inject(TranslateService);
    spyOn(translate, 'instant').and.returnValue('KEY');
    component.buildVoucherForUpdateTransactionMode();
    expect(formatService.getFormatDateTime).toHaveBeenCalled();

    expect(component.typeAlert).toEqual('success');
    expect(component.messageAlert).toEqual('signature_trackingModifyMessage');
    expect(utilWorkFlow.getHeadBandLayoutConfirm).toHaveBeenCalled();
  });

  it('method openModal() should open modal and export file', () => {
    modalService.open.and.returnValue(mockModal as NgbModalRef);

    component.openModal();
    expect(mockModal.result).toBeTruthy();
  });

  it('voucherLayoutsMainBuilder', () => {
    component.voucherLayoutsMainBuilder(iOTDFormMock);
    expect(executionServiceManager.voucherLayoutsMainBuilderStep3).toHaveBeenCalled();
    expect(component.typeAlert).toEqual('success');
    expect(component.messageAlert).toEqual('test');
    expect(component.voucherLayoutsMainBuilder).toBeDefined();
  });

  it('should build ScreenLayout with defaul case', () => {
    spyOn(component, 'voucherLayoutsMainBuilder');
    component.buildScreenLayout(iOwnTransferStateMockDefault);
    expect(component.voucherLayoutsMainBuilder).toHaveBeenCalled();
  });

  it('should build ScreenLayout with defaul user case', () => {
    const fakeData: any = {
      typeTransaction: EOwnTransferTypeTransaction.DEFAULT,
    };

    spyOn(component, 'voucherLayoutsMainBuilder');
    component.buildScreenLayout(fakeData);
    expect(component.voucherLayoutsMainBuilder).toHaveBeenCalled();
  });

  it('should build ScreenLayout with SIGNATURE_TRACKING user case', () => {
    const fakeData: any = {
      typeTransaction: EOwnTransferTypeTransaction.SIGNATURE_TRACKING,
      message: 'test',
    };

    spyOn(component, 'buildSignatureTrackingScreen');
    component.buildScreenLayout(fakeData);
    expect(component.buildSignatureTrackingScreen).toHaveBeenCalledWith({
      message: fakeData?.message,
      title: 'own-transfer',
      subTitle: 'transfer_confirmation',
    });
  });

  it('should handle Response Transaction and navigate to "/transfer/own/stm-voucher"', fakeAsync(() => {
    spyOn(component, 'resetStorage').and.callThrough();

    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.callFake(() => Promise.resolve(true));
    component.lastStep();
    tick(4000);
    expect(router.navigate).toHaveBeenCalledWith(['/transfer/own']);
    expect(utils.showLoader).toHaveBeenCalled();
    expect(component.resetStorage).toHaveBeenCalled();
    expect(utils.hideLoader).toHaveBeenCalled();
  }));

  xit('should handle Response Transaction and navigate to "/transaction-manager-payroll/signature-tracking"', fakeAsync(() => {
    component.view = EOwnTransferViewMode.SIGNATURE_TRACKING;
    component.view = EOwnTransferViewMode.SIGNATURE_TRACKING_MODIFY;

    fixture.detectChanges();

    spyOn(component, 'resetStorage').and.callThrough();

    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.callFake(() => Promise.resolve(true));
    component.lastStep();
    tick(4000);
    expect(router.navigate).toHaveBeenCalledWith(['/transaction-manager-payroll/signature-tracking']);
    expect(utils.showLoader).toHaveBeenCalled();
    expect(component.resetStorage).toHaveBeenCalled();
    expect(utils.hideLoader).toHaveBeenCalled();
  }));

  xit('should handle Response Transaction and navigate to "/transaction-manager-payroll/history/consult"', fakeAsync(() => {
    component.view = EOwnTransferViewMode.TRANSACTION_HISTORY;

    fixture.detectChanges();
    spyOn(component, 'resetStorage').and.callThrough();

    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.callFake(() => Promise.resolve(true));
    component.lastStep();
    tick(4000);
    expect(router.navigate).toHaveBeenCalledWith(['/transaction-manager-payroll/history/consult']);
    expect(utils.showLoader).toHaveBeenCalled();
    expect(component.resetStorage).toHaveBeenCalled();
    expect(utils.hideLoader).toHaveBeenCalled();
  }));

  xit('should handle Response Transaction and navigate to "/transaction-manager-payroll/signature-tracking"', fakeAsync(() => {
    component.view = EOwnTransferViewMode.SIGNATURE_TRACKING_OPERATION;

    fixture.detectChanges();
    spyOn(component, 'storageToBackSignatureTracking').and.callThrough();

    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.callFake(() => Promise.resolve(true));
    component.lastStep();
    tick(4000);
    expect(router.navigate).toHaveBeenCalledWith(['/transaction-manager-payroll/signature-tracking']);
    expect(utils.showLoader).toHaveBeenCalled();
    expect(component.storageToBackSignatureTracking).toHaveBeenCalled();
    expect(utils.hideLoader).toHaveBeenCalled();
  }));

  it('nextStep', () => {
    spyOn(component, 'openModal');
    component.view = EOwnTransferViewMode.DEFAULT;
    fixture.detectChanges();

    component.nextStep();

    expect(component.openModal).toHaveBeenCalled();
    expect(component.nextStep).toBeDefined();
  });

  it('nextStep with default view', () => {
    spyOn(component, 'handleExecuteOperation');
    component.view = EOwnTransferViewMode.SIGNATURE_TRACKING_OPERATION;
    fixture.detectChanges();

    component.nextStep();

    expect(component.handleExecuteOperation).toHaveBeenCalled();
    expect(component.nextStep).toBeDefined();
  });

  it('should call initDefinition with TRANSACTION_HISTORY', () => {
    const dataMock: any = { dataFake: 'DATA FAKE' };
    spyOn(component, 'voucherLayoutForTransactionHistory');
    component.view = EOwnTransferViewMode.TRANSACTION_HISTORY;
    component.initDefinition(dataMock);
    expect(component.voucherLayoutForTransactionHistory).toHaveBeenCalled();
  });

  it('should call initDefinition with SIGNATURE_TRACKING', () => {
    const dataMock: any = { dataFake: 'DATA FAKE' };
    spyOn(component, 'buildSignatureTrackingScreen');
    component.view = EOwnTransferViewMode.SIGNATURE_TRACKING;
    component.initDefinition(dataMock);
    expect(component.buildSignatureTrackingScreen).toHaveBeenCalled();
  });

  it('should call initDefinition with SIGNATURE_TRACKING', () => {
    const dataMock: any = { dataFake: 'DATA FAKE' };
    spyOn(component, 'buildSignatureTrackingScreen');
    component.view = EOwnTransferViewMode.SIGNATURE_TRACKING;
    component.initDefinition(dataMock);
    expect(component.buildSignatureTrackingScreen).toHaveBeenCalled();
  });

  it('should call initDefinition with SIGNATURE_TRACKING_OPERATION', () => {
    const dataMock: any = { dataFake: 'DATA FAKE' };
    spyOn(component, 'signatureTransactionOperationDefinition');
    component.view = EOwnTransferViewMode.SIGNATURE_TRACKING_OPERATION;
    component.initDefinition(dataMock);
    expect(component.signatureTransactionOperationDefinition).toHaveBeenCalled();
  });

  it('should call initDefinition with SIGNATURE_TRACKING_MODIFY', () => {
    const dataMock: any = { dataFake: 'DATA FAKE' };
    spyOn(component, 'buildVoucherForUpdateTransactionMode');
    component.view = EOwnTransferViewMode.SIGNATURE_TRACKING_MODIFY;
    component.initDefinition(dataMock);
    expect(component.buildVoucherForUpdateTransactionMode).toHaveBeenCalled();
  });

  it('should signature Transaction Operation Definition', () => {
    parameterManagement.getParameter.and.returnValue({ action: 'newxt' });
    spyOn(component, 'buildSignatureTrackingScreen');
    component.signatureTransactionOperationDefinition();
    expect(component.buildSignatureTrackingScreen).toHaveBeenCalled();
  });
});
