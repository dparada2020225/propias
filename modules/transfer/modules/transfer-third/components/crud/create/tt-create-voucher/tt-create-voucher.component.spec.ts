import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdfAlertComponent, AdfButtonComponent} from '@adf/components';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {EProfile} from 'src/app/enums/profile.enum';
import {TransfersCrudPrintService} from 'src/app/modules/transfer/prints/transfers-crud-print.service';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {iThirdTransferCreateStateMock} from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';
import {TteTransferCrudService} from '../../../../services/execution/tte-transfer-add-account.service';
import {TtCreateVoucherComponent} from './tt-create-voucher.component';
import {clickElement, mockPromise} from "../../../../../../../../../assets/testing";
import {EThirdTransferUrlNavigationCollection} from "../../../../enums/third-transfer-navigate-parameters.enum";

describe('TtCreateVoucherComponent', () => {
  let component: TtCreateVoucherComponent;
  let fixture: ComponentFixture<TtCreateVoucherComponent>;

  let router: jasmine.SpyObj<Router>
  let parameterManagement: jasmine.SpyObj<ParameterManagementService>
  let createScreenManager: jasmine.SpyObj<TteTransferCrudService>
  let utils: jasmine.SpyObj<UtilService>
  let modalService: jasmine.SpyObj<NgbModal>

  beforeEach(async () => {

    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters'])
    const createScreenManagerSpy = jasmine.createSpyObj('TteTransferCrudService', ['voucherLayoutsMainBuilder'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['showLoader', 'hideLoader'])
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])
    const pdfServiceSpy = jasmine.createSpyObj('TransfersCrudPrintService', ['pdfGenerate'])

    await TestBed.configureTestingModule({
      declarations: [TtCreateVoucherComponent, AdfAlertComponent, AdfButtonComponent],
      providers: [
        TtCreateVoucherComponent,
        {provide: Router, useValue: routerSpy},
        {provide: ParameterManagementService, useValue: parameterManagementSpy},
        {provide: TteTransferCrudService, useValue: createScreenManagerSpy},
        {provide: UtilService, useValue: utilsSpy},
        {provide: NgbModal, useValue: modalServiceSpy},
        {provide: TransfersCrudPrintService, useValue: pdfServiceSpy},
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

    fixture = TestBed.createComponent(TtCreateVoucherComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    createScreenManager = TestBed.inject(TteTransferCrudService) as jasmine.SpyObj<TteTransferCrudService>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;

    parameterManagement.getParameter.and.returnValue(iThirdTransferCreateStateMock);

    const createConfirm = {
      reference: '123',
      account: 'currentAccount',
      alias: 'alias',
      email: 'email',
      detailAccount: { /* account details */},
      date: '2022-01-01'
    };
    const layoutJsonCrud = 'layoutJsonCrud' as any;
    const headBandLayout = ['headBandLayout'] as any;
    const layoutJsonCrudModal = 'layoutJsonCrudModal' as any;
    const pdfLayout = 'pdfLayout' as any;

    createScreenManager.voucherLayoutsMainBuilder.and.returnValue({
      layoutJsonCrud,
      headBandLayout,
      layoutJsonCrudModal,
      pdfLayout
    });

    component.reference = createConfirm.reference;
    component.currentAccount = createConfirm.account as any;
    component.formValues = {alias: createConfirm.alias, email: createConfirm.email};
    component.accountToAdd = createConfirm.detailAccount as any;
    component.dateTime = createConfirm.date;
    component['typeProfile'] = component['profile'];

    component.confirmationAssociationAccount();

    router.navigate.and.returnValue(mockPromise(true))

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should got to the prev Step', () => {
    component['profile'] = EProfile.SALVADOR;
    router.navigate.and.returnValue(Promise.resolve(true));
    clickElement(fixture, 'adf-button.secondary')
    fixture.detectChanges();
    expect(utils.showLoader).toHaveBeenCalled();
    expect(parameterManagement.sendParameters).toHaveBeenCalledWith(
      {
        navigationProtectedParameter: null,
        navigateStateParameters: null,
      }
    );
    expect(router.navigate).toHaveBeenCalledWith([EThirdTransferUrlNavigationCollection.HOMESV])
  })

  it('should go to the next step', () => {
    component['profile'] = EProfile.SALVADOR;
    component.isShowPrintButton = true;
    fixture.detectChanges()
    clickElement(fixture, 'adf-button.primary')
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/transfer/third/transaction'])
  })

  it('should hidden Alert', () => {
    component.hiddenAlert();
    expect(component.typeAlert).toBeNull()
    expect(component.messageAlert).toBeNull()
  })

  it('should return "secondary" if isShowPrintButton is true', () => {
    component.isShowPrintButton = true;
    expect(component.typePrevButton).toEqual('secondary');
  });

  it('should return "secondary" if typeProfile is not EProfile.HONDURAS', () => {
    component.isShowPrintButton = false;
    component['profile'] = 'someOtherValue';
    expect(component.typePrevButton).toEqual('secondary');
  });

  it('should set isFavorite, typeAlert, and messageAlert correctly', () => {
    const data = {
      favorite: false,
      typeAlert: 'error',
      message: 'An error occurred'
    };

    component.changeInfoAndShowAlert(data);

    expect(component.isFavorite).toBe(false);
    expect(component.typeAlert).toBe('error');
    expect(component.messageAlert).toBe('An error occurred');
  });

});
