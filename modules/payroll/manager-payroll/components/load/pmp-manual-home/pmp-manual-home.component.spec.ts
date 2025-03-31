import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PmpManualHomeComponent} from './pmp-manual-home.component';
import {PmpTransactionService} from "../../../services/transaction/pmp-transaction.service";
import {Router} from "@angular/router";
import {AdfFormatService, AdfFormBuilderService} from "@adf/components";
import {PmpldVoucherService} from "../../../services/definition/load/upload-file/pmpld-voucher.service";
import {UtilService} from "../../../../../../service/common/util.service";
import {ParameterManagementService} from "../../../../../../service/navegation-parameters/parameter-management.service";
import {PmpmdFormService} from "../../../services/definition/load/manually/pmpmd-form.service";
import {PmpldTableService} from "../../../services/definition/load/upload-file/pmpld-table.service";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {MockTranslatePipe} from "../../../../../../../assets/mocks/public/tranlatePipeMock";
import {PmpLoadHomeState} from "../../../interfaces/pmp-state.interface";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {SpplmdForm} from "../../../interfaces/pmp-manual-form.interface";
import {clickElement, mockObservable, mockObservableError, mockPromise} from "../../../../../../../assets/testing";
import {SPPMRoutes} from "../../../enums/pmp-routes.enum";
import {iSPPMTableBodyMock} from "../../../../../../../assets/mocks/modules/payroll/payroll.mock";
import {
  iGetThirdTransferResponseMock
} from "../../../../../../../assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock";

describe('SpplmHomeComponent', () => {
  let component: PmpManualHomeComponent;
  let fixture: ComponentFixture<PmpManualHomeComponent>;

  let router: jasmine.SpyObj<Router>;
  let adfFormBuilder: jasmine.SpyObj<AdfFormBuilderService>;
  let voucherDefinition: jasmine.SpyObj<PmpldVoucherService>;
  let adfFormatService: jasmine.SpyObj<AdfFormatService>;
  let utils: jasmine.SpyObj<UtilService>;
  let parameterManagerService: jasmine.SpyObj<ParameterManagementService>;
  let formDefinition: jasmine.SpyObj<PmpmdFormService>;
  let transactionService: jasmine.SpyObj<PmpTransactionService>;
  let sppTableDefinition: jasmine.SpyObj<PmpldTableService>;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup;

  beforeEach(async () => {

    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const adfFormBuilderSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition'])
    const voucherDefinitionSpy = jasmine.createSpyObj('PmpldVoucherService', ['buildVoucherLayout'])
    const adfFormatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['hidePulseLoader', 'scrollToTop', 'parseAmountStringToNumber', 'showPulseLoader', 'hideLoader', 'parseNumberAsFloat', 'showLoader'])
    const parameterManagerServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters'])
    const formDefinitionSpy = jasmine.createSpyObj('PmpmdFormService', ['buildForm'])
    const transactionServiceSpy = jasmine.createSpyObj('PmpTransactionService', ['consult'])
    const sppTableDefinitionSpy = jasmine.createSpyObj('PmpldTableService', ['tableLoadManuallyHeaders'])

    await TestBed.configureTestingModule({
      declarations: [ PmpManualHomeComponent, MockTranslatePipe ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AdfFormBuilderService, useValue: adfFormBuilderSpy },
        { provide: PmpldVoucherService, useValue: voucherDefinitionSpy },
        { provide: AdfFormatService, useValue: adfFormatServiceSpy },
        { provide: UtilService, useValue: utilsSpy },
        { provide: ParameterManagementService, useValue: parameterManagerServiceSpy },
        { provide: PmpmdFormService, useValue: formDefinitionSpy },
        { provide: PmpTransactionService, useValue: transactionServiceSpy },
        { provide: PmpldTableService, useValue: sppTableDefinitionSpy },
      ],
      imports : [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        FormsModule,
        ReactiveFormsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmpManualHomeComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    adfFormBuilder = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
    voucherDefinition = TestBed.inject(PmpldVoucherService) as jasmine.SpyObj<PmpldVoucherService>;
    adfFormatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    parameterManagerService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    formDefinition = TestBed.inject(PmpmdFormService) as jasmine.SpyObj<PmpmdFormService>;
    transactionService = TestBed.inject(PmpTransactionService) as jasmine.SpyObj<PmpTransactionService>;
    sppTableDefinition = TestBed.inject(PmpldTableService) as jasmine.SpyObj<PmpldTableService>;
    formBuilder = TestBed.inject(FormBuilder);

    formGroup = formBuilder.group({
      [SpplmdForm.ACCOUNT]: [''],
      [SpplmdForm.AMOUNT]: [''],
      [SpplmdForm.EMAIL]: ['', Validators.required],
    });

    const data:PmpLoadHomeState = {
      formState: {
        file: 'xlsx',
        amount: '10',
        credits: '10',
        load: '3'
      }
    }

    parameterManagerService.getParameter.withArgs('navigateStateParameters').and.returnValue(data);
    formDefinition.buildForm.and.returnValue({
      attributes: {}
    } as any)
    adfFormBuilder.formDefinition.and.returnValue(formGroup)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go back', () => {
    router.navigate.and.returnValue(mockPromise(true))
    clickElement(fixture, 'secondary', true);
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith([SPPMRoutes.HOME_LOAD])
  })

  it('should go to the next step', () => {
    spyOnProperty(component, 'isEnabledNextButton', "get").and.returnValue(true)
    router.navigate.and.returnValue(mockPromise(true))
    fixture.detectChanges();

    clickElement(fixture, 'next', true);
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith([SPPMRoutes.CONFIRMATION_LOAD_MANUAL])
  } )

  it('should add register but form is not valid', () => {
    component.form.reset();
    fixture.detectChanges();

    clickElement(fixture, 'addRegister', true);
    fixture.detectChanges();

    expect(component.form.valid).toBeFalsy()
  })

  it('should add register, but account is duplicated', () => {
    component.registers = [iSPPMTableBodyMock]
    component.form.patchValue({
      [SpplmdForm.ACCOUNT]: '785221256',
      [SpplmdForm.AMOUNT]: '10',
      [SpplmdForm.EMAIL]: 'test@example.com',
    })

    clickElement(fixture, 'addRegister', true);
    fixture.detectChanges();

    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual('payroll:error_label_account_duplicated');
  })

  it('should add register but the service response error or account do not exists', () => {
    const message: string = 'error cualquiera'
    transactionService.consult.and.returnValue(mockObservableError({error: {message}}))
    component.form.patchValue({
      [SpplmdForm.ACCOUNT]: '556534245',
      [SpplmdForm.AMOUNT]: '10',
      [SpplmdForm.EMAIL]: 'test@example.com',
    })

    clickElement(fixture, 'addRegister', true);
    fixture.detectChanges();

    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual(message);
  })

  it('should add register', ()=> {
    component.registers = []
    transactionService.consult.and.returnValue(mockObservable(iGetThirdTransferResponseMock))
    component.form.patchValue({
      [SpplmdForm.ACCOUNT]: '222990000048',
      [SpplmdForm.AMOUNT]: '10',
      [SpplmdForm.EMAIL]: 'test@example.com',
    })
    fixture.detectChanges();

    clickElement(fixture, 'addRegister', true);
    fixture.detectChanges();

    expect(formDefinition.buildForm).toHaveBeenCalled();
    expect(adfFormBuilder.formDefinition).toHaveBeenCalled();
    expect(component.typeAlert).toEqual('');
    expect(component.messageAlert).toEqual('');
  })

  it('should getRegisters', () => {
    component.registers = [];
    fixture.detectChanges();

    component.getRegisters([iSPPMTableBodyMock]);
    fixture.detectChanges();

    expect(component.registers).toEqual([iSPPMTableBodyMock]);
    expect(parameterManagerService.sendParameters).toHaveBeenCalled();
  })

});
