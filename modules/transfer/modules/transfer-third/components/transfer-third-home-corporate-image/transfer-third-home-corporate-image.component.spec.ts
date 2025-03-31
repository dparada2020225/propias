import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {TransferThirdHomeCorporateImageComponent} from './transfer-third-home-corporate-image.component';
import {ParameterManagementService} from "../../../../../../service/navegation-parameters/parameter-management.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UtilService} from "../../../../../../service/common/util.service";
import {TtdTableManagerService} from "../../services/definition/table/manager/ttd-table-manager.service";
import {AdfFormBuilderService, ILoadItem} from "@adf/components";
import {TransferThirdService} from "../../services/transaction/transfer-third.service";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {ValidationTriggerTimeService} from "../../../../../../service/common/validation-trigger-time.service";
import {UtilWorkFlowService} from "../../../../../../service/common/util-work-flow.service";
import {
  iThirdTransfersAccountsMock
} from "../../../../../../../assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {AttributeThirdTransferTable} from "../../enums/third-transfer-control-name.enum";
import {
  mockModal
} from "../../../../../../../assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {TableOption} from "../../../../interface/table.enum";
import {mockObservable, mockObservableError, mockPromise} from "../../../../../../../assets/testing";
import {HandleTokenRequestService} from "../../../../../../service/common/handle-token-request.service";
import {UtilTransactionService} from "../../../../../../service/common/util-transaction.service";
import {Subscription} from "rxjs";
import {
  EThirdCrudUrlNavigationCollection,
  EThirdTransferUrlNavigationCollection
} from "../../enums/third-transfer-navigate-parameters.enum";
import {IThirdTransfersAccounts} from "../../../../interface/transfer-data-interface";

describe('TransferThirdHomeCorporateImageComponent', () => {
  let component: TransferThirdHomeCorporateImageComponent;
  let fixture: ComponentFixture<TransferThirdHomeCorporateImageComponent>;

  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let router: Router
  let util: jasmine.SpyObj<UtilService>;
  let tableManagerService: jasmine.SpyObj<TtdTableManagerService>;
  let thirdFormBuilder: jasmine.SpyObj<AdfFormBuilderService>;
  let transferThirdService: jasmine.SpyObj<TransferThirdService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let validationTriggerTime: jasmine.SpyObj<ValidationTriggerTimeService>;
  let utilWorkflow: jasmine.SpyObj<UtilWorkFlowService>;
  let handleTokenRequestService: jasmine.SpyObj<HandleTokenRequestService>;
  let utilsTransaction: jasmine.SpyObj<UtilTransactionService>;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup;

  beforeEach(async () => {

    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters', 'getParameter'])
    const utilSpy = jasmine.createSpyObj('UtilService', ['showLoader', 'hideLoader', 'scrollToTop', 'searchByMultipleAttributes', 'showPulseLoader', 'getLicensesTransactions', 'hidePulseLoader', 'getLabelProduct', 'getUserName', 'getLabelProductSimple'])
    const tableManagerServiceSpy = jasmine.createSpyObj('TtdTableManagerService', ['buildAssociateTable', 'buildFavoriteTable', 'buildFilterForm'])
    const thirdFormBuilderSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition'])
    const transferThirdServiceSpy = jasmine.createSpyObj('TransferThirdService', ['addFavorite', 'deleteFavorite', 'delete', 'getAssociatedThirdAccounts'])
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])
    const validationTriggerTimeSpy = jasmine.createSpyObj('ValidationTriggerTimeService', ['openModal', 'validate', 'isAvailableSchedule'])
    const utilWorkflowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['buildDeleteAchAlert'])
    const handleTokenRequestServiceSpy = jasmine.createSpyObj('HandleTokenRequestService', ['isTokenRequired'])
    const utilsTransactionSpy = jasmine.createSpyObj('UtilTransactionService', ['handleErrorTransaction', 'handleResponseTransaction'])

    await TestBed.configureTestingModule({
      declarations: [TransferThirdHomeCorporateImageComponent],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              data: {
                menuOptionsLicenses: ['CREATE', 'EDIT', 'DELETE', 'TRANSFER'],
                associatedThirdAccounts: [iThirdTransfersAccountsMock],
                scheduleService: {isSchedule: false}
              }
            }
          }
        },
        {provide: ParameterManagementService, useValue: parameterManagementSpy},
        {provide: UtilService, useValue: utilSpy},
        {provide: TtdTableManagerService, useValue: tableManagerServiceSpy},
        {provide: AdfFormBuilderService, useValue: thirdFormBuilderSpy},
        {provide: TransferThirdService, useValue: transferThirdServiceSpy},
        {provide: NgbModal, useValue: modalServiceSpy},
        {provide: ValidationTriggerTimeService, useValue: validationTriggerTimeSpy},
        {provide: UtilWorkFlowService, useValue: utilWorkflowSpy},
        {provide: HandleTokenRequestService, useValue: handleTokenRequestServiceSpy},
        {provide: UtilTransactionService, useValue: utilsTransactionSpy},
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
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

    fixture = TestBed.createComponent(TransferThirdHomeCorporateImageComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router)
    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    tableManagerService = TestBed.inject(TtdTableManagerService) as jasmine.SpyObj<TtdTableManagerService>;
    thirdFormBuilder = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
    transferThirdService = TestBed.inject(TransferThirdService) as jasmine.SpyObj<TransferThirdService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    validationTriggerTime = TestBed.inject(ValidationTriggerTimeService) as jasmine.SpyObj<ValidationTriggerTimeService>;
    utilWorkflow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
    handleTokenRequestService = TestBed.inject(HandleTokenRequestService) as jasmine.SpyObj<HandleTokenRequestService>;
    utilsTransaction = TestBed.inject(UtilTransactionService) as jasmine.SpyObj<UtilTransactionService>;
    formBuilder = TestBed.inject(FormBuilder);

    util.getLabelProduct.and.returnValue('test')

    tableManagerService.buildFilterForm.and.returnValue({
      attributes: []
    } as any)

    formGroup = formBuilder.group({
      [AttributeThirdTransferTable.SELECT_TYPE_FILTER]: [''],
      [AttributeThirdTransferTable.FILTER]: [''],
    });

    thirdFormBuilder.formDefinition.and.returnValue(formGroup);
    tableManagerService.buildAssociateTable.and.returnValue({
      items: {},
      options: [TableOption.TRANSFER, TableOption.UPDATE, TableOption.DELETE]
    } as any)
    tableManagerService.buildFavoriteTable.and.returnValue({
      items: {},
      options: [TableOption.TRANSFER, TableOption.UPDATE, TableOption.DELETE]
    } as any)

    modalService.open.and.returnValue(mockModal as NgbModalRef)
    util.getLicensesTransactions.and.returnValue(
      [TableOption.CREATE,
        TableOption.UPDATE,
        TableOption.DELETE,
        TableOption.TRANSFER,
        TableOption.DELETE_FAVORITE,
        TableOption.ADD_FAVORITE,
      ]
    )

    spyOn(router.events, 'subscribe').and.callFake((observer: any) => {
      return new Subscription();
    });
    spyOn(router, 'navigate').and.returnValue(mockPromise(true))
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to the add transfer flow', () => {
    component.goToCreateAccountFlow()
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([EThirdCrudUrlNavigationCollection.CREATE_HOME])
  })

  it('should handleSearchByDropDow', () => {
    spyOn(component, 'mapAccountsIcon').and.returnValue([])
    component.handleSearchByDropDow('222990000048-Cuenta de ahorros')

    expect(component.mapAccountsIcon).toHaveBeenCalledTimes(2);
  })

  it('should searchAccount', () => {
    util.searchByMultipleAttributes.and.returnValue([iThirdTransfersAccountsMock]);
    const value: string = '222990000048'

    component.searchAccount(value);

    expect(util.searchByMultipleAttributes).toHaveBeenCalled();
  })


  let valueDto: ILoadItem<IThirdTransfersAccounts> = {
    item: iThirdTransfersAccountsMock,
    action: TableOption.UPDATE
  }

  it('should get Action Table UPDATE', () => {
    const res = valueDto;
    res.action = TableOption.UPDATE;
    component.getActionTable(res);
    expect(router.navigate).toHaveBeenCalledWith([EThirdCrudUrlNavigationCollection.UPDATE_HOME])
  })

  it('should get Action Table TRANSFER', () => {
    const res1 = valueDto;
    res1.action = TableOption.TRANSFER;
    component.getActionTable(res1);
    expect(router.navigate).toHaveBeenCalledWith([EThirdTransferUrlNavigationCollection.HOME_TRANSACTION])
  })

  it('should get Action Table DELETE', fakeAsync(() => {
    const res2 = valueDto;
    res2.action = TableOption.DELETE;
    modalService.open.and.returnValue(mockModal as NgbModalRef);
    handleTokenRequestService.isTokenRequired.and.returnValue(false);
    transferThirdService.delete.and.returnValue(mockObservable({}));
    utilsTransaction.handleResponseTransaction.and.returnValue({
      data: {},
      status: 200,
      message: 'success'
    });
    transferThirdService.getAssociatedThirdAccounts.and.returnValue(mockObservable([iThirdTransfersAccountsMock]))

    component.getActionTable(res2);
    tick(5000)

    expect(modalService.open).toHaveBeenCalled();
  }))

  it('should get Action Table DELETE with token required', fakeAsync(() => {
    const res3 = valueDto;
    res3.action = TableOption.DELETE;
    modalService.open.and.returnValue(mockModal as NgbModalRef);
    handleTokenRequestService.isTokenRequired.and.returnValue(true)


    component.getActionTable(res3);
    tick(5000)

    expect(modalService.open).toHaveBeenCalled()
  }))

  it('should get Action table add favorite', () => {
    const res4 = valueDto;
    res4.action = TableOption.ADD_FAVORITE;

    transferThirdService.addFavorite.and.returnValue(mockObservable({}))
    transferThirdService.getAssociatedThirdAccounts.and.returnValue(mockObservable([iThirdTransfersAccountsMock]))

    component.getActionTable(res4);

    expect(transferThirdService.addFavorite).toHaveBeenCalled();
    expect(transferThirdService.getAssociatedThirdAccounts).toHaveBeenCalled();
  })

  it('should get Action table DELETE_FAVORITE', () => {
    const res5 = valueDto;
    res5.action = TableOption.DELETE_FAVORITE;

    transferThirdService.deleteFavorite.and.returnValue(mockObservable({}))
    transferThirdService.getAssociatedThirdAccounts.and.returnValue(mockObservable([]))

    component.getActionTable(res5);

    expect(transferThirdService.deleteFavorite).toHaveBeenCalled();
    expect(transferThirdService.getAssociatedThirdAccounts).toHaveBeenCalled();
  })

  it('should get Action table DELETE_FAVORITE and service response error', () => {
    const res5 = valueDto;
    res5.action = TableOption.DELETE_FAVORITE;

    transferThirdService.deleteFavorite.and.returnValue(mockObservableError({}))
    transferThirdService.getAssociatedThirdAccounts.and.returnValue(mockObservable([]))

    component.getActionTable(res5);

    expect(transferThirdService.deleteFavorite).toHaveBeenCalled();
    expect(component.typeAlert).toEqual('error')
  })

  it('should check Initial State', () => {
    component.checkInitialState('dato', 'dato');
    expect(component.isInitialState).toBeFalsy();
  })

  it('should check Initial State with null', () => {
    component.checkInitialState(null, null);
    expect(component.isInitialState).toBeTruthy();
  })

  it('should clear Layout Items', () => {
    component.clearLayoutItems();
    expect(component.thirdAccountsLayout.items).toHaveSize(0)
    expect(component.favoriteAccountsLayout.items).toHaveSize(0)
  })

  it('should handleAddAccountToFavorite but service response error', fakeAsync(() => {
    transferThirdService.addFavorite.and.returnValue(mockObservableError({}))
    component.handleAddAccountToFavorite({
      item: {
        account: '55555',
        alias: '55555'
      }
    } as any);
    tick(5000);
    expect(util.scrollToTop).toHaveBeenCalled();
    expect(util.hidePulseLoader).toHaveBeenCalled();
  }))

});
