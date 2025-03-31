import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {EProfile} from 'src/app/enums/profile.enum';
import {TransfersCrudPrintService} from 'src/app/modules/transfer/prints/transfers-crud-print.service';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {TteTransferDeleteAccountService} from '../../../../services/execution/tte-transfer-delete-account.service';
import {TtdDeleteComponent} from './ttd-delete.component';

describe('TtdDeleteComponent', () => {
  let component: TtdDeleteComponent;
  let fixture: ComponentFixture<TtdDeleteComponent>;

  let router: jasmine.SpyObj<Router>
  let parameterManagement: jasmine.SpyObj<ParameterManagementService>
  let deleteManager: jasmine.SpyObj<TteTransferDeleteAccountService>
  let utils: jasmine.SpyObj<UtilService>
  let modalService: jasmine.SpyObj<NgbModal>

  beforeEach(async () => {

    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters'])
    const deleteManagerSpy = jasmine.createSpyObj('TteTransferDeleteAccountService', ['voucherDeleteLayout'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['showLoader', 'hideLoader'])
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])
    const pdfServiceSpy = jasmine.createSpyObj('TransfersCrudPrintService', ['pdfGenerate'])

    await TestBed.configureTestingModule({
      declarations: [TtdDeleteComponent],
      providers: [
        TtdDeleteComponent,
        { provide: Router, useValue: routerSpy },
        { provide: ParameterManagementService, useValue: parameterManagementSpy },
        { provide: TteTransferDeleteAccountService, useValue: deleteManagerSpy },
        { provide: UtilService, useValue: utilsSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: TransfersCrudPrintService, useValue: pdfServiceSpy },
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

    fixture = TestBed.createComponent(TtdDeleteComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    deleteManager = TestBed.inject(TteTransferDeleteAccountService) as jasmine.SpyObj<TteTransferDeleteAccountService>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;

    const createConfirm = {
      reference: '123',
      account: 'currentAccount',
      alias: 'alias',
      email: 'email',
      detailAccount: { /* account details */ },
      date: '2022-01-01'
    };
    const layoutJsonCrud = 'layoutJsonCrud' as any;
    const headBandLayout = ['headBandLayout'] as any;
    const layoutJsonCrudModal = 'layoutJsonCrudModal' as any;
    const pdfLayout = 'pdfLayout' as any;

    deleteManager.voucherDeleteLayout.and.returnValue({
      layoutJsonCrud,
      headBandLayout,
      layoutJsonCrudModal,
      pdfLayout
    });

    component.reference = createConfirm.reference;
    component.currentAccount = createConfirm.account as any;
    component.dateTime = createConfirm.date;
    component.typeProfile = component.profile;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should got to the prev Step', () => {
    router.navigate.and.returnValue(Promise.resolve(true));
    const btn = fixture.debugElement.query(By.css('adf-button.secondary'))
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(utils.showLoader).toHaveBeenCalled();
    expect(parameterManagement.sendParameters).toHaveBeenCalledWith(
      {
        navigationProtectedParameter: null,
        navigateStateParameters: null,
      }
    );
    expect(router.navigate).toHaveBeenCalledWith(['/transfer/third'])
  })

  it('should hidden Alert', () => {
    component.hiddenAlert();
    expect(component.typeAlert).toBeNull()
    expect(component.messageAlert).toBeNull()
  })

  it('should return "primary" if isShowPrintButton is false and typeProfile is EProfile.HONDURAS', () => {
    component.isShowPrintButton = false;
    component.typeProfile = EProfile.HONDURAS;
    expect(component.typePrevButton).toEqual('primary');
  });

  it('should return "secondary" if isShowPrintButton is true', () => {
    component.isShowPrintButton = true;
    expect(component.typePrevButton).toEqual('secondary');
  });

  it('should return "secondary" if typeProfile is not EProfile.HONDURAS', () => {
    component.isShowPrintButton = false;
    component.typeProfile = 'someOtherValue';
    expect(component.typePrevButton).toEqual('secondary');
  });

});
