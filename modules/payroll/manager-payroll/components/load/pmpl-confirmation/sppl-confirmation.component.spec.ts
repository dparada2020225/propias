import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {SpplConfirmationComponent} from './sppl-confirmation.component';
import {ActivatedRoute, Router} from "@angular/router";
import {ParameterManagementService} from "../../../../../../service/navegation-parameters/parameter-management.service";
import {UtilService} from "../../../../../../service/common/util.service";
import {PmpldVoucherService} from "../../../services/definition/load/upload-file/pmpld-voucher.service";
import {AdfButtonComponent, AdfFormatService} from "@adf/components";
import {PmpldTableService} from "../../../services/definition/load/upload-file/pmpld-table.service";
import {MockTranslatePipe} from "../../../../../../../assets/mocks/public/tranlatePipeMock";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {SPPView} from "../../../enums/pmp-view.enum";
import {iPmpLoadFileStateMock} from "../../../../../../../assets/mocks/modules/payroll/payroll.mock";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {clickElement, mockObservable, mockObservableError, mockPromise} from "../../../../../../../assets/testing";
import {SPPMRoutes} from "../../../enums/pmp-routes.enum";
import {SpplLoadpayrollTransactionService} from "../../../services/execution/sppl-loadpayroll-transaction.service";

describe('SpplConfirmationComponent', () => {
  let component: SpplConfirmationComponent;
  let fixture: ComponentFixture<SpplConfirmationComponent>;

  let parameterManagerService: jasmine.SpyObj<ParameterManagementService>;
  let router: jasmine.SpyObj<Router>;
  let utils: jasmine.SpyObj<UtilService>;
  let voucherDefinition: jasmine.SpyObj<PmpldVoucherService>;
  let adfFormat: jasmine.SpyObj<AdfFormatService>;
  let sppTableDefinition: jasmine.SpyObj<PmpldTableService>;
  let serviceTransactions: jasmine.SpyObj<SpplLoadpayrollTransactionService>;

  beforeEach(async () => {

    const parameterManagerServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['hideLoader', 'showLoader'])
    const voucherDefinitionSpy = jasmine.createSpyObj('PmpldVoucherService', ['buildVoucherLayout'])
    const adfFormatSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount'])
    const sppTableDefinitionSpy = jasmine.createSpyObj('PmpldTableService', ['tableLoadManuallyHeaders'])
    const serviceTransactionsSpy = jasmine.createSpyObj('SpplLoadpayrollTransactionService', ['init', 'execute'])

    await TestBed.configureTestingModule({
      declarations: [ SpplConfirmationComponent, MockTranslatePipe, AdfButtonComponent ],
      providers: [
        {provide: ParameterManagementService, useValue: parameterManagerServiceSpy},
        {provide: Router, useValue: routerSpy},
        {provide: UtilService, useValue: utilsSpy},
        {provide: PmpldVoucherService, useValue: voucherDefinitionSpy},
        {provide: AdfFormatService, useValue: adfFormatSpy},
        {provide: PmpldTableService, useValue: sppTableDefinitionSpy},
        {provide: SpplLoadpayrollTransactionService, useValue: serviceTransactionsSpy},
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              data: {
                view: SPPView.LOAD_FILE
              }
            }
          }
        },
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

    fixture = TestBed.createComponent(SpplConfirmationComponent);
    component = fixture.componentInstance;

    parameterManagerService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    voucherDefinition = TestBed.inject(PmpldVoucherService) as jasmine.SpyObj<PmpldVoucherService>;
    adfFormat = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
    sppTableDefinition = TestBed.inject(PmpldTableService) as jasmine.SpyObj<PmpldTableService>;
    serviceTransactions = TestBed.inject(SpplLoadpayrollTransactionService) as jasmine.SpyObj<SpplLoadpayrollTransactionService>;

    parameterManagerService.getParameter.withArgs('navigateStateParameters').and.returnValue(iPmpLoadFileStateMock);

    router.navigate.and.returnValue(mockPromise(true))
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go back with view = SPPView.LOAD_FILE', () => {

    component.currentView = SPPView.LOAD_FILE;
    fixture.detectChanges();

    clickElement(fixture, 'secondary', true);
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([SPPMRoutes.HOME])
  })

  it('should go back with view = SPPView.MANUAL', () => {

    component.currentView = SPPView.MANUAL;
    fixture.detectChanges();

    clickElement(fixture, 'secondary', true);
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([SPPMRoutes.HOME_LOAD_MANUAL])
  })

  it('should go to the next step with view = SPPView.LOAD_FILE', fakeAsync(() => {
    serviceTransactions.execute.and.returnValue(mockObservable({} as never))
    component.currentView = SPPView.LOAD_FILE;
    fixture.detectChanges();

    clickElement(fixture, 'next', true)
    fixture.detectChanges();
    tick();

    expect(router.navigate).toHaveBeenCalledWith([SPPMRoutes.VOUCHER_LOAD_FILE])
  }))

  it('should go to the next step with view = SPPView.MANUAL', fakeAsync(() => {
    serviceTransactions.execute.and.returnValue(mockObservable({} as never))

    component.currentView = SPPView.MANUAL;
    fixture.detectChanges();

    clickElement(fixture, 'next', true)
    fixture.detectChanges();
    tick();

    expect(router.navigate).toHaveBeenCalledWith([SPPMRoutes.VOUCHER_LOAD_MANUAL])
  }))

  it('should service Transactions response error', () => {

    serviceTransactions.execute.and.returnValue(mockObservableError({} as any))
    fixture.detectChanges();

    clickElement(fixture, 'next', true)
    fixture.detectChanges();

    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual('error:st-missing-connection')
  })

});
