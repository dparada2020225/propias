import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {TransferThirdHomeComponent} from './transfer-third-home.component';
import {AdfButtonComponent, AdfFormBuilderService} from '@adf/components';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {UtilWorkFlowService} from 'src/app/service/common/util-work-flow.service';
import {UtilService} from 'src/app/service/common/util.service';
import {ValidationTriggerTimeService} from 'src/app/service/common/validation-trigger-time.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {TtdTableManagerService} from '../../services/definition/table/manager/ttd-table-manager.service';
import {TransferThirdService} from '../../services/transaction/transfer-third.service';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {FormBuilder, Validators} from '@angular/forms';
import {TableOption} from 'src/app/modules/transfer/interface/table.enum';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {iThirdTransfersAccountsMock} from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';
import {EThirdTransferNavigateParameters} from '../../enums/third-transfer-navigate-parameters.enum';
import {IThirdTransferUpdateState} from '../../interfaces/third-transfer-persistence.interface';
import {mockModal} from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import {of} from 'rxjs';
import {
  iThirdTransferTransactionResponseMock
} from '../../../../../../../assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';

describe('TransferThirdHomeComponent', () => {
  let component: TransferThirdHomeComponent;
  let fixture: ComponentFixture<TransferThirdHomeComponent>;

  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let router: jasmine.SpyObj<Router>;
  let util: jasmine.SpyObj<UtilService>;
  let tableManagerService: jasmine.SpyObj<TtdTableManagerService>;
  let thirdFormBuilder: jasmine.SpyObj<AdfFormBuilderService>;
  let transferThirdService: jasmine.SpyObj<TransferThirdService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {

    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const utilSpy = jasmine.createSpyObj('UtilService', ['hideLoader', 'getLicensesTransactions', 'searchByMultipleAttributes', 'getLabelProduct', 'showLoader'])
    const tableManagerServiceSpy = jasmine.createSpyObj('TtdTableManagerService', ['buildFavoriteTable', 'buildAssociateTable', 'buildFilterForm'])
    const thirdFormBuilderSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition'])
    const transferThirdServiceSpy = jasmine.createSpyObj('TransferThirdService', ['getAssociatedThirdAccounts', 'deleteFavorite', 'delete'])
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])
    const validationTriggerTimeSpy = jasmine.createSpyObj('ValidationTriggerTimeService', ['validate', 'isAvailableSchedule', 'openModal'])
    const utilWorkflowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['buildDeleteFavoriteAlert', 'buildDeleteAchAlert'])

    await TestBed.configureTestingModule({
      declarations: [TransferThirdHomeComponent, AdfButtonComponent],
      providers: [
        {provide: ParameterManagementService, useValue: parameterManagementSpy},
        {provide: Router, useValue: routerSpy},
        {provide: UtilService, useValue: utilSpy},
        {provide: TtdTableManagerService, useValue: tableManagerServiceSpy},
        {provide: AdfFormBuilderService, useValue: thirdFormBuilderSpy},
        {provide: TransferThirdService, useValue: transferThirdServiceSpy},
        {provide: NgbModal, useValue: modalServiceSpy},
        {provide: ValidationTriggerTimeService, useValue: validationTriggerTimeSpy},
        {provide: UtilWorkFlowService, useValue: utilWorkflowSpy},
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              data: {
                menuOptionsLicenses: [TableOption.CREATE, TableOption.DELETE, TableOption.UPDATE],
                associatedThirdAccounts: []
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

    fixture = TestBed.createComponent(TransferThirdHomeComponent);
    component = fixture.componentInstance;

    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    tableManagerService = TestBed.inject(TtdTableManagerService) as jasmine.SpyObj<TtdTableManagerService>;
    thirdFormBuilder = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
    transferThirdService = TestBed.inject(TransferThirdService) as jasmine.SpyObj<TransferThirdService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;

    tableManagerService.buildFavoriteTable.and.returnValue({
      items: [TableOption.CREATE, TableOption.DELETE, TableOption.UPDATE]
    } as any)

    tableManagerService.buildAssociateTable.and.returnValue({
      items: [TableOption.CREATE, TableOption.DELETE, TableOption.UPDATE]
    } as any)
    tableManagerService.buildFilterForm.and.returnValue({
      attributes: {},

    } as any)
    formBuilder = new FormBuilder();

    const thirdTransferForm = formBuilder.group({
      typeFilter: ['', Validators.required],
      filter: ['', Validators.required]
    })

    thirdFormBuilder.formDefinition.and.returnValue(thirdTransferForm)

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to the create account', fakeAsync(() => {
    router.navigate.and.returnValue(Promise.resolve(true))
    component.menuOptionsLicenses = [TableOption.CREATE]
    component.goToCreateAccountFlow();
    tick(4000);
    expect(util.showLoader).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/transfer/third/create'])
  }))

  it('should get action table TableOption.UPDATE', () => {
    router.navigate.and.returnValue(Promise.resolve(true));
    const selectAccountTemp = {
      action: TableOption.UPDATE,
      item: iThirdTransfersAccountsMock
    }

    component.getActionTable(selectAccountTemp)

    expect(util.showLoader).toHaveBeenCalled();
    expect(parameterManagement.sendParameters).toHaveBeenCalledWith({
      navigationProtectedParameter: EThirdTransferNavigateParameters.CRUD_UPDATE_FORM,
      navigateStateParameters: {
        accountToUpdate: selectAccountTemp.item,
      } as IThirdTransferUpdateState,
    })
    expect(router.navigate).toHaveBeenCalledWith(['/transfer/third/update'])
  })

  it('should get action table TableOption.TRANSFER', () => {
    router.navigate.and.returnValue(Promise.resolve(true));
    const selectAccountTemp = {
      action: TableOption.TRANSFER,
      item: iThirdTransfersAccountsMock
    }

    component.getActionTable(selectAccountTemp)

    expect(util.showLoader).toHaveBeenCalled();
    expect(parameterManagement.sendParameters).toHaveBeenCalledWith({
      navigationProtectedParameter: EThirdTransferNavigateParameters.TRANSFER_HOME,
      navigateStateParameters: {
        targetAccount: selectAccountTemp.item,
        sourceAccount: null,
        formValues: null,
      }
    })
    expect(router.navigate).toHaveBeenCalledWith(['/transfer/third/transaction'])
  })

  it('should get action table TableOption.TRANSFER', () => {

    const data = {
      body: iThirdTransferTransactionResponseMock,
      selectedAccount: iThirdTransfersAccountsMock
    }

    router.navigate.and.returnValue(Promise.resolve(true));
    transferThirdService.delete.and.returnValue(of(data))
    modalService.open.and.returnValue(mockModal as NgbModalRef)
    const selectAccountTemp = {
      action: TableOption.DELETE,
      item: iThirdTransfersAccountsMock
    }

    component.getActionTable(selectAccountTemp)
    expect(modalService.open).toHaveBeenCalled()
  })

  it('should search Account', () => {
    spyOn(component, 'filterAccountList').and.returnValue([iThirdTransfersAccountsMock])
    component.searchAccount('123456')
    expect(component.filterAccountList).toHaveBeenCalled();
    expect(component.favoriteAccountsLayout.items).toEqual([iThirdTransfersAccountsMock])
  })

  it('should search Account but return empty', () => {
    spyOn(component, 'filterAccountList').and.returnValue([])
    component.searchAccount('123456')
    expect(component.filterAccountList).toHaveBeenCalled();
    expect(component.typeAlertFavoriteAccount).toEqual('warning')
    expect(component.messageAlertFavoriteAccount).toEqual('no_matches_found')
  })

  it('should filter Account List', () => {
    const r = component.filterAccountList([iThirdTransfersAccountsMock], '222990000048')
    expect(r.length).toEqual(1)
  })


  it('should show Alert', () => {
    component.showAlert('success', 'next step')
    expect(component.typeAlert).toEqual('success')
    expect(component.messageAlert).toEqual('next step')
  })

  it('should resetStorage', () => {
    component.resetStorage();
    expect(parameterManagement.sendParameters).toHaveBeenCalledWith({
      navigationProtectedParameter: null
    })
  })

  it('should getActionFavoriteTable TableOption.DELETE_FAVORITE', () => {

    modalService.open.and.returnValue(mockModal as NgbModalRef)

    transferThirdService.deleteFavorite.and.returnValue(of())

    const data = {
      action: TableOption.DELETE_FAVORITE,
      item: {
        account: '54'
      }
    }
    component.getActionFavoriteTable(data)
    expect(modalService.open).toHaveBeenCalled();
  })

  it('should getActionFavoriteTable TableOption.TRANSFER', () => {
    spyOn(component, 'goToTransferFlow')

    const data = {
      action: TableOption.TRANSFER,
      item: {
        account: '54'
      }
    }
    component.getActionFavoriteTable(data)
    expect(component.goToTransferFlow).toHaveBeenCalledWith(data.item as any)
  })


  it('should get getAssociatedThirdAccounts', () => {

    util.getLabelProduct.and.returnValue('ahorros')
    component.getAssociatedThirdAccounts([iThirdTransfersAccountsMock])

    expect(component.associatedThirdFavoriteAccounts.length).toEqual(1)

  })

});
