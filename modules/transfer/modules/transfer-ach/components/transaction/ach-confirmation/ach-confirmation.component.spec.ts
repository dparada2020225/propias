import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {Location} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {of, Subscription} from 'rxjs';
import {HttpStatusCode} from 'src/app/enums/http-status-code.enum';
import {
  StBuildUpdateBodyRequestService
} from 'src/app/modules/transaction-manager/modules/signature-tracking/services/definition/st-build-update-body-request.service';
import {
  StBtProcessManagerService
} from 'src/app/modules/transaction-manager/modules/signature-tracking/services/execution/utils/st-bt-process-manager.service';
import {
  SignatureTrackingService
} from 'src/app/modules/transaction-manager/modules/signature-tracking/services/transaction/signature-tracking.service';
import {FindServiceCodeService} from 'src/app/service/common/find-service-code.service';
import {HandleTokenRequestService} from 'src/app/service/common/handle-token-request.service';
import {UtilTransactionService} from 'src/app/service/common/util-transaction.service';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {iMultipleRequestResponseMock} from 'src/assets/mocks/modules/signature-tracking/mocksDetailTransaction';
import {
  iACHLimitsResponseMock,
  iACHTransactionNavigateParametersStateMock,
  mockIACHSettings,
} from 'src/assets/mocks/modules/transfer/service/transfer-ach/ach.data.mock';
import {clickElement, mockObservable, mockObservableError, mockPromise} from 'src/assets/testing';
import {EACHTransferUrlNavigationCollection} from '../../../enum/navigation-parameter.enum';
import {EACHTransactionViewMode} from '../../../enum/transfer-ach.enum';
import {AtdUtilService} from '../../../services/atd-util.service';
import {AtdTransferManagerService} from '../../../services/definition/transaction/atd-transfer-manager.service';
import {TransferACHService} from '../../../services/transaction/transfer-ach.service';
import {AchConfirmationComponent} from './ach-confirmation.component';

describe('AchConfirmationComponent', () => {
  let component: AchConfirmationComponent;
  let fixture: ComponentFixture<AchConfirmationComponent>;

  let location: jasmine.SpyObj<Location>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let router: Router;
  let persistStepStateService: jasmine.SpyObj<ParameterManagementService>;
  let transferACH: jasmine.SpyObj<TransferACHService>;
  let transactionDefinitionManager: jasmine.SpyObj<AtdTransferManagerService>;
  let util: jasmine.SpyObj<UtilService>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let achUtils: jasmine.SpyObj<AtdUtilService>;
  let stBuildUpdateBodyRequest: jasmine.SpyObj<StBuildUpdateBodyRequestService>;
  let stTransactionService: jasmine.SpyObj<SignatureTrackingService>;
  let handleTokenRequest: jasmine.SpyObj<HandleTokenRequestService>;
  let utilsTransaction: jasmine.SpyObj<UtilTransactionService>;
  let findServiceCode: jasmine.SpyObj<FindServiceCodeService>;
  let stBTProcessManager: jasmine.SpyObj<StBtProcessManagerService>;

  beforeEach(async () => {
    const locationSpy = jasmine.createSpyObj('Location', ['back']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    const persistStepStateServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters', 'getParameter']);
    const transferACHSpy = jasmine.createSpyObj('TransferACHService', [
      'achTransfer',
      'deleteFavorite',
      'addFavorite',
      'transactionLimits',
    ]);
    const transactionDefinitionManagerSpy = jasmine.createSpyObj('AtdTransferManagerService', ['buildVoucherConfirmation']);
    const utilSpy = jasmine.createSpyObj('UtilService', ['scrollToTop', 'hideLoader', 'showLoader', 'getTokenType']);
    const achUtilsSpy = jasmine.createSpyObj('AtdUtilService', ['dataToExecuteTransaction', 'getDataToListOfBanks']);
    const stBuildUpdateBodyRequestSpy = jasmine.createSpyObj('StBuildUpdateBodyRequestService', ['buildBodyToUpdateACHTransfer']);
    const stTransactionServiceSpy = jasmine.createSpyObj('SignatureTrackingService', ['update']);
    const handleTokenRequestSpy = jasmine.createSpyObj('HandleTokenRequestService', ['isTokenRequired']);
    const utilsTransactionSpy = jasmine.createSpyObj('UtilTransactionService', ['handleErrorTransaction', 'handleResponseTransaction']);
    const findServiceCodeSpy = jasmine.createSpyObj('FindServiceCodeService', ['getServiceCode']);
    const stBTProcessManagerSpy = jasmine.createSpyObj('StBtProcessManagerService', ['handleErrorToTransactionLimits']);

    await TestBed.configureTestingModule({
      declarations: [AchConfirmationComponent],
      providers: [
        { provide: Location, useValue: locationSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: ParameterManagementService, useValue: persistStepStateServiceSpy },
        { provide: TransferACHService, useValue: transferACHSpy },
        { provide: AtdTransferManagerService, useValue: transactionDefinitionManagerSpy },
        { provide: UtilService, useValue: utilSpy },
        { provide: AtdUtilService, useValue: achUtilsSpy },
        { provide: StBuildUpdateBodyRequestService, useValue: stBuildUpdateBodyRequestSpy },
        { provide: SignatureTrackingService, useValue: stTransactionServiceSpy },
        { provide: HandleTokenRequestService, useValue: handleTokenRequestSpy },
        { provide: UtilTransactionService, useValue: utilsTransactionSpy },
        { provide: FindServiceCodeService, useValue: findServiceCodeSpy },
        { provide: StBtProcessManagerService, useValue: stBTProcessManagerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                view: EACHTransactionViewMode.DEFAULT,
                settings: [mockIACHSettings],
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

    fixture = TestBed.createComponent(AchConfirmationComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    persistStepStateService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    transferACH = TestBed.inject(TransferACHService) as jasmine.SpyObj<TransferACHService>;
    transactionDefinitionManager = TestBed.inject(AtdTransferManagerService) as jasmine.SpyObj<AtdTransferManagerService>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    achUtils = TestBed.inject(AtdUtilService) as jasmine.SpyObj<AtdUtilService>;
    stBuildUpdateBodyRequest = TestBed.inject(StBuildUpdateBodyRequestService) as jasmine.SpyObj<StBuildUpdateBodyRequestService>;
    stTransactionService = TestBed.inject(SignatureTrackingService) as jasmine.SpyObj<SignatureTrackingService>;
    handleTokenRequest = TestBed.inject(HandleTokenRequestService) as jasmine.SpyObj<HandleTokenRequestService>;
    utilsTransaction = TestBed.inject(UtilTransactionService) as jasmine.SpyObj<UtilTransactionService>;
    findServiceCode = TestBed.inject(FindServiceCodeService) as jasmine.SpyObj<FindServiceCodeService>;
    stBTProcessManager = TestBed.inject(StBtProcessManagerService) as jasmine.SpyObj<StBtProcessManagerService>;

    spyOn(router.events, 'subscribe').and.callFake((observer: any) => {
      observer.next({ navigationTrigger: 'popstate' } as any);
      return new Subscription();
    });
    spyOn(router, 'navigate').and.returnValue(mockPromise(true));

    persistStepStateService.getParameter.and.returnValue(iACHTransactionNavigateParametersStateMock);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should go to the next step with view DEFAULT and is token not required', fakeAsync(() => {
    component.isGeneralSettingsError = false;
    component.view = EACHTransactionViewMode.DEFAULT;
    handleTokenRequest.isTokenRequired.and.returnValue(false);
    transferACH.transactionLimits.and.returnValue(mockObservable(iACHLimitsResponseMock));
    transferACH.achTransfer.and.returnValue(mockObservable({}));
    stBTProcessManager.handleErrorToTransactionLimits.and.returnValue(of());
    utilsTransaction.handleResponseTransaction.and.returnValue({
      status: 200,
      data: {},
    });

    fixture.detectChanges();

    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    tick();

    expect(transferACH.transactionLimits).toHaveBeenCalled();
  }));

  it('should go to the next step with view SIGNATURE_TRACKING_UPDATE', () => {
    component.view = EACHTransactionViewMode.SIGNATURE_TRACKING_UPDATE;

    persistStepStateService.getParameter.and.returnValue({
      transactionSelected: {
        reference: 'FDFDSC45',
        serviceCode: 200,
      },
    });

    stBuildUpdateBodyRequest.buildBodyToUpdateACHTransfer.and.returnValue('ach');
    stTransactionService.update.and.returnValue(mockObservable(iMultipleRequestResponseMock));

    fixture.detectChanges();

    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([EACHTransferUrlNavigationCollection.SIGNATURE_TRACKING_MODIFY_VOUCHER]);
  });

  it('should go to the last step with view DEFAULT', () => {
    component.view = EACHTransactionViewMode.DEFAULT;
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();

    expect(location.back).toHaveBeenCalled();
    expect(persistStepStateService.sendParameters).toHaveBeenCalled();
  });

  it('should go to the last step with view SIGNATURE_TRACKING_UPDATE', () => {
    component.view = EACHTransactionViewMode.SIGNATURE_TRACKING_UPDATE;
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();

    expect(location.back).toHaveBeenCalled();
    expect(persistStepStateService.sendParameters).toHaveBeenCalled();
  });

  it('should handleChangeIsFavoriteTransaction and scrollToTop', () => {
    component.scrollToTop();
    expect(util.scrollToTop).toHaveBeenCalled();

    component.handleChangeIsFavoriteTransaction();
    expect(component.isFavorite).toBeFalsy();
  });

  it('should init definition with SIGNATURE_TRACKING_UPDATE', () => {
    component.view = EACHTransactionViewMode.SIGNATURE_TRACKING_UPDATE;
    transactionDefinitionManager.buildVoucherConfirmation.and.returnValue({
      title: '',
      className: '',
      groupList: [],
      isFavoriteWidget: {},
      subtitle: '',
    } as any);
    component.initDefinition();

    expect(component.voucherConfirmation).toBeDefined();
  });

  it('should managementFavoriteTransaction', () => {
    transferACH.deleteFavorite.and.returnValue(mockObservable({}));

    component.isFavorite = false;
    component.targetAccountSelected = {
      favorite: true,
    } as any;

    fixture.detectChanges();

    component.managementFavoriteTransaction();

    expect(transferACH.deleteFavorite).toHaveBeenCalled();
  });

  it('should handleExecuteModifyTransaction service response error SIGNATURE_TRACKING_MODIFY_SUCCESS', () => {
    spyOn(component, 'goToSignatureTrackingVoucher');
    stTransactionService.update.and.returnValue(
      mockObservableError({
        error: {
          code: HttpStatusCode.SIGNATURE_TRACKING_MODIFY_SUCCESS,
        },
      })
    );

    component.handleExecuteModifyTransaction();

    expect(component.goToSignatureTrackingVoucher).toHaveBeenCalled();
  });
});
