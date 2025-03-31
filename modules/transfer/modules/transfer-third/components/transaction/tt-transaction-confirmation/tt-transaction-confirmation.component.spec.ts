import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {TtTransactionConfirmationComponent} from './tt-transaction-confirmation.component';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {
  SignatureTrackingService
} from 'src/app/modules/transaction-manager/modules/signature-tracking/services/transaction/signature-tracking.service';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {ThirdTransferDefinitionService} from '../../../services/definition/third-transfer-definition.service';
import {TtdTransferManagerService} from '../../../services/definition/transaction/manager/ttd-transfer-manager.service';
import {TransferThirdService} from '../../../services/transaction/transfer-third.service';
import {of, Subscription} from 'rxjs';
import {
  EThirdTransferUrlNavigationCollection,
  EThirdTransferViewMode
} from '../../../enums/third-transfer-navigate-parameters.enum';
import {AdfButtonComponent} from '@adf/components';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {
  iThirdTransferTransactionStateMock,
  iTransferThirdMock
} from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';
import {
  StBuildUpdateBodyRequestService
} from "../../../../../../transaction-manager/modules/signature-tracking/services/definition/st-build-update-body-request.service";
import {clickElement, mockObservable, mockObservableError, mockPromise} from "../../../../../../../../assets/testing";
import {
  iMultipleRequestResponseMock
} from "../../../../../../../../assets/mocks/modules/signature-tracking/mocksDetailTransaction";
import {HttpStatusCode} from "../../../../../../../enums/http-status-code.enum";
import {HandleTokenRequestService} from "../../../../../../../service/common/handle-token-request.service";
import {UtilTransactionService} from "../../../../../../../service/common/util-transaction.service";
import {
  mockModal
} from "../../../../../../../../assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock";

describe('TtTransactionConfirmationComponent', () => {
  let component: TtTransactionConfirmationComponent;
  let fixture: ComponentFixture<TtTransactionConfirmationComponent>;

  let router: Router;
  let util: jasmine.SpyObj<UtilService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let thirdTransferManager: jasmine.SpyObj<TtdTransferManagerService>;
  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let transferThirdService: jasmine.SpyObj<TransferThirdService>;
  let thirdTransferDefinition: jasmine.SpyObj<ThirdTransferDefinitionService>;
  let transactionService: jasmine.SpyObj<SignatureTrackingService>;
  let stBuildUpdateBodyRequest: jasmine.SpyObj<StBuildUpdateBodyRequestService>;
  let handleTokenRequest: jasmine.SpyObj<HandleTokenRequestService>;
  let utilsTransaction: jasmine.SpyObj<UtilTransactionService>;

  beforeEach(async () => {

    const utilSpy = jasmine.createSpyObj('UtilService', ['showLoader', 'hideLoader', 'scrollToTop', 'hidePulseLoader', 'showPulseLoader'])
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])
    const thirdTransferManagerSpy = jasmine.createSpyObj('TtdTransferManagerService', ['buildTransferVoucherStep2'])
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters'])
    const transferThirdServiceSpy = jasmine.createSpyObj('TransferThirdService', ['deleteFavorite', 'addFavorite', 'getTransferThird'])
    const thirdTransferDefinitionSpy = jasmine.createSpyObj('ThirdTransferDefinitionService', ['buildDataToExecuteTransaction'])
    const transactionServiceSpy = jasmine.createSpyObj('SignatureTrackingService', ['update'])
    const stBuildUpdateBodyRequestSpy = jasmine.createSpyObj('StBuildUpdateBodyRequestService', ['buildBodyToUpdateTransaction'])
    const handleTokenRequestSpy = jasmine.createSpyObj('HandleTokenRequestService', ['isTokenRequired'])
    const utilsTransactionSpy = jasmine.createSpyObj('UtilTransactionService', ['handleErrorTransaction', 'handleResponseTransaction'])

    await TestBed.configureTestingModule({
      declarations: [TtTransactionConfirmationComponent, AdfButtonComponent],
      providers: [
        TtTransactionConfirmationComponent,
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              data: {
                view: EThirdTransferViewMode.DEFAULT
              }
            }
          }
        },
        {provide: UtilService, useValue: utilSpy},
        {provide: NgbModal, useValue: modalServiceSpy},
        {provide: TtdTransferManagerService, useValue: thirdTransferManagerSpy},
        {provide: ParameterManagementService, useValue: parameterManagementSpy},
        {provide: TransferThirdService, useValue: transferThirdServiceSpy},
        {provide: ThirdTransferDefinitionService, useValue: thirdTransferDefinitionSpy},
        {provide: SignatureTrackingService, useValue: transactionServiceSpy},
        {provide: StBuildUpdateBodyRequestService, useValue: stBuildUpdateBodyRequestSpy},
        {provide: HandleTokenRequestService, useValue: handleTokenRequestSpy},
        {provide: UtilTransactionService, useValue: utilsTransactionSpy},
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

    fixture = TestBed.createComponent(TtTransactionConfirmationComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router)
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    thirdTransferManager = TestBed.inject(TtdTransferManagerService) as jasmine.SpyObj<TtdTransferManagerService>;
    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    transferThirdService = TestBed.inject(TransferThirdService) as jasmine.SpyObj<TransferThirdService>;
    thirdTransferDefinition = TestBed.inject(ThirdTransferDefinitionService) as jasmine.SpyObj<ThirdTransferDefinitionService>;
    transactionService = TestBed.inject(SignatureTrackingService) as jasmine.SpyObj<SignatureTrackingService>;
    stBuildUpdateBodyRequest = TestBed.inject(StBuildUpdateBodyRequestService) as jasmine.SpyObj<StBuildUpdateBodyRequestService>;
    handleTokenRequest = TestBed.inject(HandleTokenRequestService) as jasmine.SpyObj<HandleTokenRequestService>;
    utilsTransaction = TestBed.inject(UtilTransactionService) as jasmine.SpyObj<UtilTransactionService>;

    spyOn(router, 'navigate').and.returnValue(mockPromise(true))
    spyOn(router.events, 'subscribe').and.callFake((observer: any) => {
      observer.next({navigationTrigger: 'popstate'} as any);
      return new Subscription();
    });
    parameterManagement.getParameter.and.returnValue(iThirdTransferTransactionStateMock)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(thirdTransferManager.buildTransferVoucherStep2).toHaveBeenCalled()
  });

  it('should build Signature Tracking Voucher Layout', () => {
    component.viewMode = EThirdTransferViewMode.SIGNATURE_TRACKING;
    component.buildMainVoucher();
    expect(thirdTransferManager.buildTransferVoucherStep2).toHaveBeenCalled()
  })

  it('should add favorite but acccount is favorite and is favorite', () => {
    component.favoritesManagement();
    expect(transferThirdService.addFavorite).not.toHaveBeenCalled();
  });

  it('should add favorite but acccount is favorite and is false', () => {
    component.isFavorite = false;
    transferThirdService.deleteFavorite.and.returnValue(of())
    component.favoritesManagement();
    expect(transferThirdService.deleteFavorite).toHaveBeenCalled();
  });

  it('should handleChangeIsFavoriteTransaction', () => {
    component.handleChangeIsFavoriteTransaction();
    expect(component.isFavorite).toBeFalsy();
  })

  it('should go to the next state with view = SIGNATURE_TRACKING', () => {
    transactionService.update.and.returnValue(mockObservableError({
      error: {
        code: HttpStatusCode.SIGNATURE_TRACKING_MODIFY_SUCCESS,
        ...iMultipleRequestResponseMock
      }
    }))
    component.viewMode = EThirdTransferViewMode.SIGNATURE_TRACKING;
    fixture.detectChanges();
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([EThirdTransferUrlNavigationCollection.SIGNATURE_TRACKING_MODIFY_VOUCHER])
  })

  xit('should go to the next step with view = DEFAULT and is token not required', fakeAsync(() => {

    handleTokenRequest.isTokenRequired.and.returnValue(false);
    component.viewMode = EThirdTransferViewMode.DEFAULT;
    fixture.detectChanges();
    utilsTransaction.handleResponseTransaction.and.returnValue({
      data: {...iTransferThirdMock},
      message: 'success',
      status: 200
    });
    transferThirdService.getTransferThird.and.returnValue(mockObservable(iTransferThirdMock))


    clickElement(fixture, 'adf-button.primary');
    tick()

    expect(thirdTransferDefinition.buildDataToExecuteTransaction).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith([EThirdTransferUrlNavigationCollection.DEFAULT_VOUCHER])
  }))

  it('Should go to the next step with token required and service response error', fakeAsync(() => {

    modalService.open.and.returnValue(mockModal as NgbModalRef)
    handleTokenRequest.isTokenRequired.and.returnValue(true);

    clickElement(fixture, 'adf-button.primary');
    tick();

    expect(component.typeAlert).toEqual('error')
    expect(component.messageAlert).toEqual('error_transfer_third')
  }))

  it('should return to the prev step with view = SIGNATURE_TRACKING', () => {
    component.viewMode = EThirdTransferViewMode.SIGNATURE_TRACKING;
    fixture.detectChanges();

    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([EThirdTransferUrlNavigationCollection.SIGNATURE_TRACKING_HOME])
  })

  it('should return to the prev step with view = DEFAULT', () => {
    component.viewMode = EThirdTransferViewMode.DEFAULT;
    fixture.detectChanges();

    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([EThirdTransferUrlNavigationCollection.HOME_TRANSACTION])
  })

});
