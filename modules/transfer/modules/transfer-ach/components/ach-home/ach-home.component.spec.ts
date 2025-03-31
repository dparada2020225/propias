import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {AdfFormBuilderService} from '@adf/components';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TableOption} from 'src/app/modules/transfer/interface/table.enum';
import {UtilService} from 'src/app/service/common/util.service';
import {ValidationTriggerTimeService} from 'src/app/service/common/validation-trigger-time.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {mockModal} from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import {
  iAchAccountMock,
  iAchCrudTransactionResponseMock
} from 'src/assets/mocks/modules/transfer/service/transfer-ach/ach.data.mock';
import {MockTranslatePipe} from 'src/assets/mocks/public/tranlatePipeMock';
import {clickElement, mockObservable, mockPromise} from 'src/assets/testing';
import {AttributeFormTransferAch} from '../../enum/ach-transfer-control-name.enum';
import {
  EACHCrudUrlNavigationCollection,
  EACHTransferUrlNavigationCollection
} from '../../enum/navigation-parameter.enum';
import {AtdUtilService} from '../../services/atd-util.service';
import {AtdTableManagerService} from '../../services/definition/table/atd-table-manager.service';
import {TransferACHService} from '../../services/transaction/transfer-ach.service';
import {AchHomeComponent} from './ach-home.component';

describe('AchHomeComponent', () => {
  let component: AchHomeComponent;
  let fixture: ComponentFixture<AchHomeComponent>;

  let formBuilderService: jasmine.SpyObj<AdfFormBuilderService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let tableManager: jasmine.SpyObj<AtdTableManagerService>;
  let persistStepStateService: jasmine.SpyObj<ParameterManagementService>;
  let tableManagerDefinition: jasmine.SpyObj<AtdTableManagerService>;
  let router: jasmine.SpyObj<Router>;
  let achTransaction: jasmine.SpyObj<TransferACHService>;
  let util: jasmine.SpyObj<UtilService>;
  let achUtil: jasmine.SpyObj<AtdUtilService>;
  let validationTriggerTime: jasmine.SpyObj<ValidationTriggerTimeService>;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup;

  beforeEach(async () => {
    const formBuilderServiceSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    const tableManagerSpy = jasmine.createSpyObj('AtdTableManagerService', [
      'buildFilterForm',
      'buildAssociateTable',
      'buildFavoriteTable',
      'buildDeleteFavoriteAlert',
      'buildDeleteAssociatedAlert',
    ]);
    const persistStepStateServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters']);
    const tableManagerDefinitionSpy = jasmine.createSpyObj('AtdTableManagerService', [
      'buildDeleteAssociatedAlert',
      'buildDeleteFavoriteAlert',
      'buildFilterForm',
      'buildAssociateTable',
      'buildFavoriteTable',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const achTransactionSpy = jasmine.createSpyObj('TransferACHService', ['deleteAccountAch', 'deleteFavorite', 'associatedAccounts']);
    const utilSpy = jasmine.createSpyObj('UtilService', [
      'hideLoader',
      'getLabelProduct',
      'searchByMultipleAttributes',
      'getLicensesTransactions',
      'showLoader',
      'scrollToTop',
      'getLabelCurrency',
      'getProfile'
    ]);
    const achUtilSpy = jasmine.createSpyObj('AtdUtilService', ['parsedAccounts', 'compareAccountsToSort']);
    const validationTriggerTimeSpy = jasmine.createSpyObj('ValidationTriggerTimeService', ['isAvailableSchedule', 'openModal', 'validate']);

    await TestBed.configureTestingModule({
      declarations: [AchHomeComponent, MockTranslatePipe],
      providers: [
        { provide: AdfFormBuilderService, useValue: formBuilderServiceSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: AtdTableManagerService, useValue: tableManagerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                commissionMessages: {
                  message2: 'This is a test',
                },
                scheduleService: {
                  isSchedule: true,
                  schedule: {
                    initialDate: '2015',
                    finalDate: '2030',
                  },
                },
                associatedAccounts: [iAchAccountMock],
                menuOptionsLicenses: [TableOption.CREATE, TableOption.PAYMENT],
              },
            },
          },
        },
        { provide: ParameterManagementService, useValue: persistStepStateServiceSpy },
        { provide: AtdTableManagerService, useValue: tableManagerDefinitionSpy },
        { provide: Router, useValue: routerSpy },
        { provide: TransferACHService, useValue: achTransactionSpy },
        { provide: UtilService, useValue: utilSpy },
        { provide: AtdUtilService, useValue: achUtilSpy },
        { provide: ValidationTriggerTimeService, useValue: validationTriggerTimeSpy },
      ],
      imports: [
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        ReactiveFormsModule,
        FormsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AchHomeComponent);
    component = fixture.componentInstance;

    formBuilderService = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    tableManager = TestBed.inject(AtdTableManagerService) as jasmine.SpyObj<AtdTableManagerService>;
    persistStepStateService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    tableManagerDefinition = TestBed.inject(AtdTableManagerService) as jasmine.SpyObj<AtdTableManagerService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    achTransaction = TestBed.inject(TransferACHService) as jasmine.SpyObj<TransferACHService>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    achUtil = TestBed.inject(AtdUtilService) as jasmine.SpyObj<AtdUtilService>;
    validationTriggerTime = TestBed.inject(ValidationTriggerTimeService) as jasmine.SpyObj<ValidationTriggerTimeService>;
    formBuilder = TestBed.inject(FormBuilder);

    tableManager.buildFilterForm.and.returnValue({
      attributes: [],
    } as any);

    formGroup = formBuilder.group({
      [AttributeFormTransferAch.SELECT_TYPE_FILTER]: ['', Validators.required],
      [AttributeFormTransferAch.FILTER_SEARCH]: ['', Validators.required],
    });

    formBuilderService.formDefinition.and.returnValue(formGroup);
    util.getLicensesTransactions.and.returnValue([TableOption.CREATE, TableOption.PAYMENT]);

    tableManager.buildFavoriteTable.and.returnValue({
      items: [],
      title: 'Favorite',
      headers: [],
    } as any);

    tableManager.buildAssociateTable.and.returnValue({
      items: [],
      title: 'Favorite',
      headers: [],
    } as any);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handleSearchByInput', () => {
    const data: string = '513256565';

    achUtil.parsedAccounts.and.returnValue([
      {
        ...iAchAccountMock,
        currencyCode: 'USD',
        typeAccountDescription: 'currency',
        currency: 'USD',
      },
    ]);

    achUtil.compareAccountsToSort.and.returnValue(2);

    component.handleSearchByInput(data);

    expect(component.queryToSearchInput).toEqual(data);
  });

  it('should handleSearchByDropDow', () => {
    const data: string = 'aho-895220';
    achUtil.parsedAccounts.and.returnValue([
      {
        ...iAchAccountMock,
        currencyCode: 'USD',
        typeAccountDescription: 'currency',
        currency: 'USD',
      },
    ]);
    achUtil.compareAccountsToSort.and.returnValue(2);

    component.handleSearchByDropDow(data);

    expect(util.searchByMultipleAttributes).toHaveBeenCalledTimes(4);
    expect(component.valueToSearch).toEqual(data);
  });

  it('should getTableActionAssociatedAccounts TRANSFER', () => {
    router.navigate.and.returnValue(mockPromise(true));
    component.getTableActionAssociatedAccounts({ action: TableOption.TRANSFER });
    expect(router.navigate).toHaveBeenCalledWith([EACHTransferUrlNavigationCollection.HOME_TRANSACTION]);
    expect(persistStepStateService.sendParameters).toHaveBeenCalled();
  });

  it('should getTableActionAssociatedAccounts DELETE', fakeAsync(() => {
    modalService.open.and.returnValue(mockModal as NgbModalRef);
    router.navigate.and.returnValue(mockPromise(true));
    achTransaction.deleteAccountAch.and.returnValue(mockObservable(iAchCrudTransactionResponseMock));

    component.getTableActionAssociatedAccounts({
      action: TableOption.DELETE,
      item: {
        item: {
          bank: 1,
          account: '6526524',
        },
      },
    });
    tick();

    expect(router.navigate).toHaveBeenCalledWith([EACHCrudUrlNavigationCollection.DELETE]);
    expect(persistStepStateService.sendParameters).toHaveBeenCalled();
  }));

  it('should getTableActionAssociatedAccounts UPDATE', () => {
    router.navigate.and.returnValue(mockPromise(true));

    component.getTableActionAssociatedAccounts({
      action: TableOption.UPDATE,
    });

    expect(router.navigate).toHaveBeenCalledWith([EACHCrudUrlNavigationCollection.UPDATE_HOME]);
    expect(persistStepStateService.sendParameters).toHaveBeenCalled();
  });

  it('should getTableActionFavoriteAccounts TRANSFER', () => {
    router.navigate.and.returnValue(mockPromise(true));
    component.getTableActionFavoriteAccounts({ action: TableOption.TRANSFER });
    expect(router.navigate).toHaveBeenCalledWith([EACHTransferUrlNavigationCollection.HOME_TRANSACTION]);
    expect(persistStepStateService.sendParameters).toHaveBeenCalled();
  });

  it('should getTableActionFavoriteAccounts DELETE_FAVORITE', fakeAsync(() => {
    modalService.open.and.returnValue(mockModal as NgbModalRef);
    achTransaction.deleteFavorite.and.returnValue(mockObservable({}));
    achTransaction.associatedAccounts.and.returnValue(mockObservable([iAchAccountMock]));

    component.getTableActionFavoriteAccounts({ action: TableOption.DELETE_FAVORITE });
    tick();

    expect(modalService.open).toHaveBeenCalled();
    expect(achTransaction.deleteFavorite).toHaveBeenCalled();
    expect(achTransaction.associatedAccounts).toHaveBeenCalled();
  }));

  it('should goToAddAccountFlow', () => {
    router.navigate.and.returnValue(mockPromise(true));
    clickElement(fixture, 'adf-button');

    expect(router.navigate).toHaveBeenCalledWith([EACHCrudUrlNavigationCollection.CREATE_HOME]);
  });

  const type = 'alert';
  const message = 'message test';

  it('should show alert', () => {
    component.showAlert(type, message);
    expect(component.typeAlert).toEqual(type);
    expect(component.messageAlert).toEqual(message);

    component.showAlertTable(type, message);

    expect(component.typeAlertTable).toEqual(type);
    expect(component.messageAlertTable).toEqual(message);
  });

  it('should scroll to top', () => {
    component.scrollToTop();
    expect(util.scrollToTop).toHaveBeenCalled();
  });
});
