import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PmppPaymentComponent} from './pmpp-payment.component';
import {UtilService} from "../../../../../../service/common/util.service";
import {PmpTransactionService} from "../../../services/transaction/pmp-transaction.service";
import {PmpdFormService} from "../../../services/definition/payment/pmpd-form.service";
import {AdfFormBuilderService} from "@adf/components";
import {ActivatedRoute, Router} from "@angular/router";
import {PmpdTableService} from "../../../services/definition/payment/pmpd-table.service";
import {ParameterManagementService} from "../../../../../../service/navegation-parameters/parameter-management.service";
import {MockTranslatePipe} from "../../../../../../../assets/mocks/public/tranlatePipeMock";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {clickElement, mockObservable, mockObservableError, mockPromise} from "../../../../../../../assets/testing";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SppdFormAttributes} from "../../../interfaces/pmp-form.interface";
import {iAccount} from "../../../../../../../assets/mocks/modules/signature-tracking/mocksDetailTransaction";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {SPPMRoutes} from "../../../enums/pmp-routes.enum";
import {iGetDataPayrollMock} from "../../../../../../../assets/mocks/modules/payroll/payroll.mock";

describe('SppHomeComponent', () => {
  let component: PmppPaymentComponent;
  let fixture: ComponentFixture<PmppPaymentComponent>;

  let utils: jasmine.SpyObj<UtilService>;
  let transactionService: jasmine.SpyObj<PmpTransactionService>;
  let formDefinitionService: jasmine.SpyObj<PmpdFormService>;
  let adfFormBuilder: jasmine.SpyObj<AdfFormBuilderService>;
  let tableDefinition: jasmine.SpyObj<PmpdTableService>;
  let parameterManager: jasmine.SpyObj<ParameterManagementService>;
  let router: jasmine.SpyObj<Router>;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup;

  beforeEach(async () => {

    const utilsSpy = jasmine.createSpyObj('UtilService', ['showLoader', 'hideLoader', 'getProductAcronym'])
    const transactionServiceSpy = jasmine.createSpyObj('PmpTransactionService', ['getPayrollToPayment'])
    const formDefinitionServiceSpy = jasmine.createSpyObj('PmpdFormService', ['buildFormLayout'])
    const adfFormBuilderSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition'])
    const tableDefinitionSpy = jasmine.createSpyObj('PmpdTableService', ['buildTable'])
    const parameterManagerSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters', 'getParameter'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])

    await TestBed.configureTestingModule({
      declarations: [ PmppPaymentComponent, MockTranslatePipe ],
      providers: [
        { provide: UtilService, useValue: utilsSpy },
        { provide: PmpTransactionService, useValue: transactionServiceSpy },
        { provide: PmpdFormService, useValue: formDefinitionServiceSpy },
        { provide: AdfFormBuilderService, useValue: adfFormBuilderSpy },
        { provide: ActivatedRoute, useValue: {
            snapshot: {
              data:{
                sourceAccounts: [iAccount]
              }
            }
          } },
        { provide: PmpdTableService, useValue: tableDefinitionSpy },
        { provide: ParameterManagementService, useValue: parameterManagerSpy },
        { provide: Router, useValue: routerSpy },
      ],
      imports: [
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

    fixture = TestBed.createComponent(PmppPaymentComponent);
    component = fixture.componentInstance;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    transactionService = TestBed.inject(PmpTransactionService) as jasmine.SpyObj<PmpTransactionService>;
    formDefinitionService = TestBed.inject(PmpdFormService) as jasmine.SpyObj<PmpdFormService>;
    adfFormBuilder = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
    tableDefinition = TestBed.inject(PmpdTableService) as jasmine.SpyObj<PmpdTableService>;
    parameterManager = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    formBuilder = TestBed.inject(FormBuilder);

    formGroup = formBuilder.group({
      [SppdFormAttributes.SOURCE_ACCOUNT]: [''],
    });

    transactionService.getPayrollToPayment.and.returnValue(mockObservable(iGetDataPayrollMock))
    formDefinitionService.buildFormLayout.and.returnValue({
      attributes: {}
    } as any)
    adfFormBuilder.formDefinition.and.returnValue(formGroup)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go back', () => {
    router.navigate.and.returnValue(mockPromise(true));
    clickElement(fixture, 'secondary', true);
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith([SPPMRoutes.HOME])
  })

  it('should go to the next step', () => {
    router.navigate.and.returnValue(mockPromise(true));
    component.form.get(SppdFormAttributes.SOURCE_ACCOUNT)?.setValue(iAccount)
    component.sourceAccountSelected = iAccount;
    fixture.detectChanges()

    clickElement(fixture, 'primary', true);
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([SPPMRoutes.CONFIRMATION_PAYMENT])
  })

  it('should getPayrollDetail service response error', () => {
    const message:string = 'error hhtp'
    transactionService.getPayrollToPayment.and.returnValue(mockObservableError({message}))

    component.getPayrollDetail();

    expect(component.typeMessage).toEqual('error');
    expect(component.message).toEqual(message)

  })


});
