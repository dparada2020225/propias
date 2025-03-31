import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {Location} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {HandleTokenRequestService} from 'src/app/service/common/handle-token-request.service';
import {UtilTransactionService} from 'src/app/service/common/util-transaction.service';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {mockModal} from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import {
  iAchCrudTransactionResponseMock,
  iCreateAchMock
} from 'src/assets/mocks/modules/transfer/service/transfer-ach/ach.data.mock';
import {MockTranslatePipe} from 'src/assets/mocks/public/tranlatePipeMock';
import {clickElement, mockObservable, mockPromise} from 'src/assets/testing';
import {ECrudAchTypeClient} from '../../../../enum/ach-crud-control-name.enum';
import {EACHCrudUrlNavigationCollection} from '../../../../enum/navigation-parameter.enum';
import {AtdCrudManagerService} from '../../../../services/definition/crud/atd-crud-manager.service';
import {AtdCreateManagerService} from '../../../../services/definition/crud/create/atd-create-manager.service';
import {TransferACHService} from '../../../../services/transaction/transfer-ach.service';
import {AchCreateVoucherComponent} from './ach-create-voucher.component';

describe('AchCreateVoucherComponent', () => {
  let component: AchCreateVoucherComponent;
  let fixture: ComponentFixture<AchCreateVoucherComponent>;

  let router: Router;
  let location: jasmine.SpyObj<Location>;
  let achTransaction: jasmine.SpyObj<TransferACHService>;
  let createManagerDefinition: jasmine.SpyObj<AtdCreateManagerService>;
  let crudManagerDefinition: jasmine.SpyObj<AtdCrudManagerService>;
  let persistStepStateService: jasmine.SpyObj<ParameterManagementService>;
  let util: jasmine.SpyObj<UtilService>;
  let handleTokenRequest: jasmine.SpyObj<HandleTokenRequestService>;
  let utilsTransaction: jasmine.SpyObj<UtilTransactionService>;
  let modalService: jasmine.SpyObj<NgbModal>;

  beforeEach(async () => {
    const locationSpy = jasmine.createSpyObj('Location', ['back']);
    const achTransactionSpy = jasmine.createSpyObj('TransferACHService', ['createAccountAch']);
    const createManagerDefinitionSpy = jasmine.createSpyObj('AtdCreateManagerService', ['buildDataToCreateAccount']);
    const crudManagerDefinitionSpy = jasmine.createSpyObj('AtdCrudManagerService', [
      'buildVoucherForNaturalClient',
      'buildVoucherForLegalClient',
    ]);
    const persistStepStateServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters', 'getParameter']);
    const utilSpy = jasmine.createSpyObj('UtilService', ['scrollToTop', 'showLoader', 'hideLoader']);
    const handleTokenRequestSpy = jasmine.createSpyObj('HandleTokenRequestService', ['isTokenRequired']);
    const utilsTransactionSpy = jasmine.createSpyObj('UtilTransactionService', ['handleResponseTransaction', 'handleErrorTransaction']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);

    await TestBed.configureTestingModule({
      declarations: [AchCreateVoucherComponent, MockTranslatePipe],
      providers: [
        { provide: Location, useValue: locationSpy },
        { provide: TransferACHService, useValue: achTransactionSpy },
        { provide: AtdCreateManagerService, useValue: createManagerDefinitionSpy },
        { provide: AtdCrudManagerService, useValue: crudManagerDefinitionSpy },
        { provide: ParameterManagementService, useValue: persistStepStateServiceSpy },
        { provide: UtilService, useValue: utilSpy },
        { provide: HandleTokenRequestService, useValue: handleTokenRequestSpy },
        { provide: UtilTransactionService, useValue: utilsTransactionSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AchCreateVoucherComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    achTransaction = TestBed.inject(TransferACHService) as jasmine.SpyObj<TransferACHService>;
    createManagerDefinition = TestBed.inject(AtdCreateManagerService) as jasmine.SpyObj<AtdCreateManagerService>;
    crudManagerDefinition = TestBed.inject(AtdCrudManagerService) as jasmine.SpyObj<AtdCrudManagerService>;
    persistStepStateService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    handleTokenRequest = TestBed.inject(HandleTokenRequestService) as jasmine.SpyObj<HandleTokenRequestService>;
    utilsTransaction = TestBed.inject(UtilTransactionService) as jasmine.SpyObj<UtilTransactionService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;

    spyOn(router.events, 'subscribe').and.callFake((observer: any) => {
      observer.next({ navigationTrigger: 'popstate' } as any);
      return new Subscription();
    });
    spyOn(router, 'navigate').and.returnValue(mockPromise(true));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should go to the next step with token required', fakeAsync(() => {
    const mock = mockModal;
    mock.result = mockPromise({
      status: 200,
    } as any);

    modalService.open.and.returnValue(mock as NgbModalRef);
    handleTokenRequest.isTokenRequired.and.returnValue(true);

    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    tick();

    expect(router.navigate).toHaveBeenCalledWith([EACHCrudUrlNavigationCollection.CREATE_CONFIRMATION]);
  }));

  it('should go to the next step with token not required', fakeAsync(() => {
    handleTokenRequest.isTokenRequired.and.returnValue(false);
    createManagerDefinition.buildDataToCreateAccount.and.returnValue(iCreateAchMock);
    achTransaction.createAccountAch.and.returnValue(mockObservable(iAchCrudTransactionResponseMock));
    utilsTransaction.handleResponseTransaction.and.returnValue({
      status: 200,
      data: {},
    });

    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    tick();

    expect(router.navigate).toHaveBeenCalledWith([EACHCrudUrlNavigationCollection.CREATE_CONFIRMATION]);
  }));

  it('should go to the last step', () => {
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();

    expect(location.back).toHaveBeenCalled();
    expect(persistStepStateService.sendParameters).toHaveBeenCalledWith({
      navigationProtectedParameter: null,
    });
  });

  it('should buildVoucherLayoutForLegalClient', () => {
    component.typeClient = ECrudAchTypeClient.LEGAL;
    fixture.detectChanges();

    component.initDefinition();
    expect(crudManagerDefinition.buildVoucherForLegalClient).toHaveBeenCalled();
  });

  it('should buildVoucherLayoutForNaturalClient', () => {
    component.typeClient = ECrudAchTypeClient.NATURAL;
    fixture.detectChanges();

    component.initDefinition();
    expect(crudManagerDefinition.buildVoucherForNaturalClient).toHaveBeenCalled();
  });

  it('should handleTransactionResponse response with error', () => {
    component.handleTransactionResponse({ status: 404 } as any);

    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual('error:add_ach_account');
    expect(util.scrollToTop).toHaveBeenCalled();
  });
});
