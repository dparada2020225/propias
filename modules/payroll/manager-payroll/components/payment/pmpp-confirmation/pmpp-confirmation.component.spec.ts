import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PmppConfirmationComponent} from './pmpp-confirmation.component';
import {PmpdTableService} from "../../../services/definition/payment/pmpd-table.service";
import {ParameterManagementService} from "../../../../../../service/navegation-parameters/parameter-management.service";
import {Router} from "@angular/router";
import {UtilService} from "../../../../../../service/common/util.service";
import {PmpdVoucherService} from "../../../services/definition/payment/pmpd-voucher.service";
import {PmpeTransactionService} from "../../../services/execution/pmpe-transaction.service";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {MockTranslatePipe} from "../../../../../../../assets/mocks/public/tranlatePipeMock";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {clickElement, mockPromise} from "../../../../../../../assets/testing";
import {SPPMRoutes} from "../../../enums/pmp-routes.enum";
import {iAccount} from "../../../../../../../assets/mocks/modules/signature-tracking/mocksDetailTransaction";
import {iGetDataPayrollMock} from "../../../../../../../assets/mocks/modules/payroll/payroll.mock";

describe('SppConfirmationComponent', () => {
  let component: PmppConfirmationComponent;
  let fixture: ComponentFixture<PmppConfirmationComponent>;

  let tableDefinition: jasmine.SpyObj<PmpdTableService>;
  let parameterManager: jasmine.SpyObj<ParameterManagementService>;
  let router: jasmine.SpyObj<Router>;
  let utils: jasmine.SpyObj<UtilService>;
  let voucherDefinition: jasmine.SpyObj<PmpdVoucherService>;
  let executeTransaction: jasmine.SpyObj<PmpeTransactionService>;

  beforeEach(async () => {

    const tableDefinitionSpy = jasmine.createSpyObj('PmpdTableService', ['buildTable'])
    const parameterManagerSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['showLoader', 'getDate'])
    const voucherDefinitionSpy = jasmine.createSpyObj('PmpdVoucherService', ['buildConfirmationVoucher'])
    const executeTransactionSpy = jasmine.createSpyObj('PmpeTransactionService', ['resetMessage', 'message', 'execute', 'init'])

    await TestBed.configureTestingModule({
      declarations: [ PmppConfirmationComponent, MockTranslatePipe ],
      providers: [
        { provide: PmpdTableService, useValue: tableDefinitionSpy },
        { provide: ParameterManagementService, useValue: parameterManagerSpy },
        { provide: Router, useValue: routerSpy },
        { provide: UtilService, useValue: utilsSpy },
        { provide: PmpdVoucherService, useValue: voucherDefinitionSpy },
        { provide: PmpeTransactionService, useValue: executeTransactionSpy },
      ],
      imports: [
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

    fixture = TestBed.createComponent(PmppConfirmationComponent);
    component = fixture.componentInstance;
    tableDefinition = TestBed.inject(PmpdTableService) as jasmine.SpyObj<PmpdTableService>;
    parameterManager = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    voucherDefinition = TestBed.inject(PmpdVoucherService) as jasmine.SpyObj<PmpdVoucherService>;
    executeTransaction = TestBed.inject(PmpeTransactionService) as jasmine.SpyObj<PmpeTransactionService>;


    parameterManager.getParameter.withArgs('navigateStateParameters').and.returnValue({
      sourceAccount: iAccount,
      paymentDetail: iGetDataPayrollMock
    })

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go back', () => {
    router.navigate.and.returnValue(mockPromise(true));
    clickElement(fixture, 'return', true);
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith([SPPMRoutes.HOME_PAYMENT])
  })




  it('should show alert', () => {
    const type:string = 'warning';
    const message:string = 'Se a enviado a firmas'
    component.showAlert(type, message);
    expect(component.typeMessage).toEqual(type)
    expect(component.message).toEqual(message)
  })

});
