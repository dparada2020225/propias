import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {Location} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {UtilWorkFlowService} from 'src/app/service/common/util-work-flow.service';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {mockModal} from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import {
  iAchCrudTransactionResponseMock,
  iAchUpdateStorageLayoutMock,
} from 'src/assets/mocks/modules/transfer/service/transfer-ach/ach.data.mock';
import {clickElement, mockObservable, mockObservableError, mockPromise} from 'src/assets/testing';
import {ECrudAchTypeClient} from '../../../../enum/ach-crud-control-name.enum';
import {EACHCrudUrlNavigationCollection, EACHNavigationParameters} from '../../../../enum/navigation-parameter.enum';
import {AtdCrudManagerService} from '../../../../services/definition/crud/atd-crud-manager.service';
import {AtdTableManagerService} from '../../../../services/definition/table/atd-table-manager.service';
import {TransferACHService} from '../../../../services/transaction/transfer-ach.service';
import {AchUpdateVoucherComponent} from './ach-update-voucher.component';

describe('AchUpdateVoucherComponent', () => {
  let component: AchUpdateVoucherComponent;
  let fixture: ComponentFixture<AchUpdateVoucherComponent>;

  let location: jasmine.SpyObj<Location>;
  let router: Router;
  let crudManagerDefinition: jasmine.SpyObj<AtdCrudManagerService>;
  let persistStepStateService: jasmine.SpyObj<ParameterManagementService>;
  let achTransaction: jasmine.SpyObj<TransferACHService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let tableManagerDefinition: jasmine.SpyObj<AtdTableManagerService>;
  let utils: jasmine.SpyObj<UtilService>;
  let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>;

  beforeEach(async () => {
    const locationSpy = jasmine.createSpyObj('Location', ['back']);
    const crudManagerDefinitionSpy = jasmine.createSpyObj('AtdCrudManagerService', [
      'buildUpdateVoucherForLegalClient',
      'buildUpdateVoucherForNaturalClient',
      'builderDataToUpdate',
    ]);
    const persistStepStateServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters', 'getParameter']);
    const achTransactionSpy = jasmine.createSpyObj('TransferACHService', ['updateAccountAch']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    const tableManagerDefinitionSpy = jasmine.createSpyObj('AtdTableManagerService', ['buildModifyHistoryTable']);
    const utilsSpy = jasmine.createSpyObj('UtilService', ['hideLoader', 'scrollToTop', 'showLoader']);
    const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['buildAlertToUpdate']);

    await TestBed.configureTestingModule({
      declarations: [AchUpdateVoucherComponent],
      providers: [
        { provide: Location, useValue: locationSpy },
        { provide: AtdCrudManagerService, useValue: crudManagerDefinitionSpy },
        { provide: ParameterManagementService, useValue: persistStepStateServiceSpy },
        { provide: TransferACHService, useValue: achTransactionSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: AtdTableManagerService, useValue: tableManagerDefinitionSpy },
        { provide: UtilService, useValue: utilsSpy },
        { provide: UtilWorkFlowService, useValue: utilWorkFlowSpy },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        RouterTestingModule.withRoutes([]),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AchUpdateVoucherComponent);
    component = fixture.componentInstance;

    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    router = TestBed.inject(Router);
    crudManagerDefinition = TestBed.inject(AtdCrudManagerService) as jasmine.SpyObj<AtdCrudManagerService>;
    persistStepStateService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    achTransaction = TestBed.inject(TransferACHService) as jasmine.SpyObj<TransferACHService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    tableManagerDefinition = TestBed.inject(AtdTableManagerService) as jasmine.SpyObj<AtdTableManagerService>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;

    persistStepStateService.getParameter.and.returnValue(iAchUpdateStorageLayoutMock);

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

  it('should build voucher for natural client', () => {
    component.typeClient = ECrudAchTypeClient.NATURAL;
    component.initDefinition();

    expect(crudManagerDefinition.buildUpdateVoucherForNaturalClient).toHaveBeenCalled();
  });

  it('should build voucher for legal client', () => {
    component.typeClient = ECrudAchTypeClient.LEGAL;
    component.initDefinition();

    expect(crudManagerDefinition.buildUpdateVoucherForLegalClient).toHaveBeenCalled();
  });

  xit('should go to the next Step and update Account', fakeAsync(() => {
    achTransaction.updateAccountAch.and.returnValue(mockObservable(iAchCrudTransactionResponseMock));
    modalService.open.and.returnValue(mockModal as NgbModalRef);
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    tick();
    expect(modalService.open).toHaveBeenCalled();
    expect(persistStepStateService.sendParameters).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith([EACHCrudUrlNavigationCollection.UPDATE_CONFIRMATION]);
  }));

  xit('should go to the lastStep', () => {
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();
    expect(location.back).toHaveBeenCalled();
    expect(persistStepStateService.sendParameters).toHaveBeenCalledWith({
      navigationProtectedParameter: EACHNavigationParameters.CRUD_UPDATE_FORM,
    });
  });

  it('should executeUpdateAccount but service respose error', () => {
    const message: string = 'Test error service';

    achTransaction.updateAccountAch.and.returnValue(
      mockObservableError({
        error: {
          message,
        },
      })
    );

    component.executeUpdateAccount();

    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual(message);
    expect(utils.scrollToTop).toHaveBeenCalled();
  });
});
