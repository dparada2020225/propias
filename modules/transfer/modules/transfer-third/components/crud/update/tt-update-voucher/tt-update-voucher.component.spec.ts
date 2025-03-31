import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TtUpdateVoucherComponent} from './tt-update-voucher.component';
import {Router} from '@angular/router';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {TteTransferUpdateAccountService} from '../../../../services/execution/tte-transfer-update-account.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TransfersCrudPrintService} from 'src/app/modules/transfer/prints/transfers-crud-print.service';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {iThirdTransferUpdateStateMock} from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';
import {AdfButtonComponent} from '@adf/components';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {EProfile} from "../../../../../../../../enums/profile.enum";
import {clickElement} from "../../../../../../../../../assets/testing";
import {EThirdTransferUrlNavigationCollection} from "../../../../enums/third-transfer-navigate-parameters.enum";

describe('TtUpdateVoucherComponent', () => {
  let component: TtUpdateVoucherComponent;
  let fixture: ComponentFixture<TtUpdateVoucherComponent>;

  let router: jasmine.SpyObj<Router>;
  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let builderAttributes: jasmine.SpyObj<TteTransferUpdateAccountService>;
  let modalService: jasmine.SpyObj<NgbModal>;


  beforeEach(async () => {

    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters'])
    const builderAttributesSpy = jasmine.createSpyObj('TteTransferUpdateAccountService', ['voucherLayoutUpdate'])
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])
    const pdfServiceSpy = jasmine.createSpyObj('TransfersCrudPrintService', ['pdfGenerate'])

    await TestBed.configureTestingModule({
      declarations: [TtUpdateVoucherComponent, AdfButtonComponent],
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: ParameterManagementService, useValue: parameterManagementSpy},
        {provide: TteTransferUpdateAccountService, useValue: builderAttributesSpy},
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

    fixture = TestBed.createComponent(TtUpdateVoucherComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    builderAttributes = TestBed.inject(TteTransferUpdateAccountService) as jasmine.SpyObj<TteTransferUpdateAccountService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;

    parameterManagement.getParameter.and.returnValue(iThirdTransferUpdateStateMock)

    const layoutJsonCrud = 'layoutJsonCrud' as any;
    const layoutJsonCrudModal = 'layoutJsonCrudModal' as any;
    const pdfLayout = 'pdfLayout' as any;

    builderAttributes.voucherLayoutUpdate.and.returnValue({
      layoutJsonCrud,
      layoutJsonCrudModal,
      pdfLayout
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should go to the prev step', () => {
    component['profile'] = EProfile.SALVADOR;
    router.navigate.and.returnValue(Promise.resolve(true))
    fixture.detectChanges();

    clickElement(fixture, 'adf-button.secondary')
    fixture.detectChanges();
    expect(parameterManagement.sendParameters).toHaveBeenCalledWith({
      navigationProtectedParameter: null,
      navigateStateParameters: null,
    })
    expect(router.navigate).toHaveBeenCalledWith([EThirdTransferUrlNavigationCollection.HOMESV])
  })

  it('should hidden alert', () => {
    component.hiddenAlert();
    expect(component.typeAlert).toBeNull()
    expect(component.messageAlert).toBeNull()
  })

});
