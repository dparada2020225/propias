import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {
  ESignatureTrackingUrlFlow
} from 'src/app/modules/transaction-manager/modules/signature-tracking/enum/st-navigate-enum';
import {
  StOperationHandlerService
} from 'src/app/modules/transaction-manager/modules/signature-tracking/services/execution/operations-transactions/st-operation-handler.service';
import {
  StAchProcessSingleService
} from 'src/app/modules/transaction-manager/modules/signature-tracking/services/execution/process-single/st-ach-process-single.service';
import {
  ETransactionHistoryUrlNavigationCollection
} from 'src/app/modules/transaction-manager/modules/transaction-history/enums/th-navigate.enum';
import {TransfersPrintService} from 'src/app/modules/transfer/prints/transfers-print.service';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {mockModal} from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import {
  iAchAccountMock,
  iACHTransactionNavigateParametersStateMock,
  mockIACHSettings,
} from 'src/assets/mocks/modules/transfer/service/transfer-ach/ach.data.mock';
import {MockTranslatePipe} from 'src/assets/mocks/public/tranlatePipeMock';
import {clickElement, mockPromise} from 'src/assets/testing';
import {EACHTransferUrlNavigationCollection} from '../../../enum/navigation-parameter.enum';
import {EACHTransactionViewMode, EACHTypeTransaction} from '../../../enum/transfer-ach.enum';
import {AtdTransferManagerService} from '../../../services/definition/transaction/atd-transfer-manager.service';
import {AteTransferManagerService} from '../../../services/execution/ate-transfer-manager.service';
import {AchVoucherComponent} from './ach-voucher.component';

describe('AchVoucherComponent', () => {
  let component: AchVoucherComponent;
  let fixture: ComponentFixture<AchVoucherComponent>;

  let router: jasmine.SpyObj<Router>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let persistStepStateService: jasmine.SpyObj<ParameterManagementService>;
  let pdfService: jasmine.SpyObj<TransfersPrintService>;
  let transactionExecuteManagerDefinition: jasmine.SpyObj<AteTransferManagerService>;
  let transactionDefinitionManager: jasmine.SpyObj<AtdTransferManagerService>;
  let translate: jasmine.SpyObj<TranslateService>;
  let stOperationHandler: jasmine.SpyObj<StOperationHandlerService>;
  let utils: jasmine.SpyObj<UtilService>;
  let stACHProcess: jasmine.SpyObj<StAchProcessSingleService>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    const persistStepStateServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters']);
    const pdfServiceSpy = jasmine.createSpyObj('TransfersPrintService', ['pdfGenerate']);
    const transactionExecuteManagerDefinitionSpy = jasmine.createSpyObj('AteTransferManagerService', ['buildVoucherScreen']);
    const transactionDefinitionManagerSpy = jasmine.createSpyObj('AtdTransferManagerService', ['buildVoucherConfirmation']);
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    const stOperationHandlerSpy = jasmine.createSpyObj('StOperationHandlerService', ['operationManager']);
    const utilsSpy = jasmine.createSpyObj('UtilService', ['showLoader', 'hideLoader']);
    const stACHProcessSpy = jasmine.createSpyObj('StAchProcessSingleService', ['execute']);

    await TestBed.configureTestingModule({
      declarations: [AchVoucherComponent, MockTranslatePipe],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: ParameterManagementService, useValue: persistStepStateServiceSpy },
        { provide: TransfersPrintService, useValue: pdfServiceSpy },
        { provide: AteTransferManagerService, useValue: transactionExecuteManagerDefinitionSpy },
        { provide: AtdTransferManagerService, useValue: transactionDefinitionManagerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                view: EACHTransactionViewMode.DEFAULT,
                settings: [mockIACHSettings],
                associatedAccounts: [iAchAccountMock],
              },
            },
          },
        },
        { provide: TranslateService, useValue: translateSpy },
        { provide: StOperationHandlerService, useValue: stOperationHandlerSpy },
        { provide: UtilService, useValue: utilsSpy },
        { provide: StAchProcessSingleService, useValue: stACHProcessSpy },
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

    fixture = TestBed.createComponent(AchVoucherComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    persistStepStateService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    pdfService = TestBed.inject(TransfersPrintService) as jasmine.SpyObj<TransfersPrintService>;
    transactionExecuteManagerDefinition = TestBed.inject(AteTransferManagerService) as jasmine.SpyObj<AteTransferManagerService>;
    transactionDefinitionManager = TestBed.inject(AtdTransferManagerService) as jasmine.SpyObj<AtdTransferManagerService>;
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    stOperationHandler = TestBed.inject(StOperationHandlerService) as jasmine.SpyObj<StOperationHandlerService>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    stACHProcess = TestBed.inject(StAchProcessSingleService) as jasmine.SpyObj<StAchProcessSingleService>;

    persistStepStateService.getParameter.and.returnValue(iACHTransactionNavigateParametersStateMock);

    transactionExecuteManagerDefinition.buildVoucherScreen.and.returnValue({
      headBandLayout: {},
      pdfLayout: {},
      voucherLayout: {},
      voucherModalLayout: {},
    } as any);

    router.navigate.and.returnValue(mockPromise(true));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build voucher to view TRANSACTION_HISTORY', () => {
    component.view = EACHTransactionViewMode.TRANSACTION_HISTORY;
    component.initViewInit();

    expect(transactionExecuteManagerDefinition.buildVoucherScreen).toHaveBeenCalled();
  });

  it('should build voucher to view SIGNATURE_TRACKING', () => {
    component.view = EACHTransactionViewMode.SIGNATURE_TRACKING;
    component.initViewInit();

    expect(transactionDefinitionManager.buildVoucherConfirmation).toHaveBeenCalled();

    expect(component.isShowPrintButton).toBeFalsy();
    expect(component.isShowHeadband).toBeFalsy();
  });

  it('should build voucher to view SIGNATURE_TRACKING', () => {
    component.view = EACHTransactionViewMode.SIGNATURE_TRACKING_OPERATION;
    component.initViewInit();

    expect(transactionDefinitionManager.buildVoucherConfirmation).toHaveBeenCalled();

    expect(component.isShowHeadband).toBeFalsy();
  });

  it('should build voucher to view SIGNATURE_TRACKING', () => {
    component.view = EACHTransactionViewMode.SIGNATURE_TRACKING_UPDATE;
    component.initViewInit();

    expect(transactionDefinitionManager.buildVoucherConfirmation).toHaveBeenCalled();

    expect(component.isShowPrintButton).toBeFalsy();
  });

  it('should build voucherDefinitionForDefaultTransaction with transaction SIGNATURE_TRACKING', () => {
    component.typeTransaction = EACHTypeTransaction.SIGNATURE_TRACKING;
    component.voucherDefinitionForDefaultTransaction();
    expect(component.isShowPrintButton).toBeFalsy();
    expect(transactionDefinitionManager.buildVoucherConfirmation).toHaveBeenCalled();
  });

  it('should build voucherDefinitionForDefaultTransaction with transaccion undefined', () => {
    component.typeTransaction = null as any;
    component.voucherDefinitionForDefaultTransaction();
    expect(transactionExecuteManagerDefinition.buildVoucherScreen).toHaveBeenCalled();
  });

  xit('should open modal and print pdf', fakeAsync(() => {
    component.pdfLayout = {
      account: {},
      reference: '',
      title: '',
      fileName: 'pdf',
      items: [],
    };

    modalService.open.and.returnValue(mockModal as NgbModalRef);

    component.view = EACHTransactionViewMode.TRANSACTION_HISTORY;
    component.isShowPrintButton = true;
    fixture.detectChanges();
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    tick();

    expect(modalService.open).toHaveBeenCalled();

    expect(pdfService.pdfGenerate).toHaveBeenCalled();
  }));

  it('should execute operation with SIGNATURE_TRACKING_OPERATION', fakeAsync(() => {
    modalService.open.and.returnValue(mockModal as NgbModalRef);

    component.view = EACHTransactionViewMode.SIGNATURE_TRACKING_OPERATION;
    component.isShowPrintButton = true;
    fixture.detectChanges();
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    tick();

    expect(stOperationHandler.operationManager).toHaveBeenCalled();
  }));

  it('should back with view DEFAULT', () => {
    component.view = EACHTransactionViewMode.DEFAULT;
    fixture.detectChanges();
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([EACHTransferUrlNavigationCollection.HOME]);
    expect(persistStepStateService.sendParameters).toHaveBeenCalled();
  });

  it('should back with view TRANSACTION_HISTORY', () => {
    component.view = EACHTransactionViewMode.TRANSACTION_HISTORY;
    fixture.detectChanges();
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([ETransactionHistoryUrlNavigationCollection.CONSULT]);
    expect(persistStepStateService.sendParameters).toHaveBeenCalled();
  });

  it('should back with view ETransactionHistoryUrlNavigationCollection', () => {
    component.view = EACHTransactionViewMode.SIGNATURE_TRACKING_OPERATION;
    fixture.detectChanges();
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([ESignatureTrackingUrlFlow.HOME]);
    expect(persistStepStateService.sendParameters).toHaveBeenCalled();
  });

  it('should hiddenAlert', () => {
    component.hiddenAlert();
    expect(component.typeAlert).toBeUndefined();
    expect(component.messageAlert).toBeUndefined();
  });
});
