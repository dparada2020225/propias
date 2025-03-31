import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ThHomeComponent} from './th-home.component';
import {ValidationTriggerTimeService} from "../../../../../../service/common/validation-trigger-time.service";
import {ThdManagerService} from "../../services/definition/thd-manager.service";
import {AdfFormBuilderService} from "@adf/components";
import {ActivatedRoute, Router} from "@angular/router";
import {TransactionHistoryService} from "../../services/transaction/transaction-history.service";
import {ParameterManagementService} from "../../../../../../service/navegation-parameters/parameter-management.service";
import {StorageService} from "@adf/security";
import {UtilService} from "../../../../../../service/common/util.service";
import {ThPrintService} from "../../print/th-print.service";
import {ThExcelService} from "../../print/th-excel.service";
import {TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import {TmCommonService} from "../../../../services/tm-common.service";
// import {TmDetailHandlerService} from "../../../../services/tm-detail-handler.service";
import {MockTranslatePipe} from "../../../../../../../assets/mocks/public/tranlatePipeMock";
import {ETransactionHistoryViews} from "../../enums/transaction-history.enum";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AttributeFormTransactionHistory} from "../../enums/transaction-history-control-name.enum";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { TmDetailHandlerService } from 'src/app/modules/transaction-manager/services/core/bp/tm-detail-handler.service';

describe('ThHomeComponent', () => {
  let component: ThHomeComponent;
  let fixture: ComponentFixture<ThHomeComponent>;

  let transactionHistoryDefinitionManager: jasmine.SpyObj<ThdManagerService>;
  let adfFormDefinition: jasmine.SpyObj<AdfFormBuilderService>;
  let router: jasmine.SpyObj<Router>;
  let transactionHistory: jasmine.SpyObj<TransactionHistoryService>;
  let parameterManager: jasmine.SpyObj<ParameterManagementService>;
  let storage: jasmine.SpyObj<StorageService>;
  let util: jasmine.SpyObj<UtilService>;
  let pdf: jasmine.SpyObj<ThPrintService>;
  let reporter: jasmine.SpyObj<ThExcelService>;
  let translate: jasmine.SpyObj<TranslateService>;
  let transactionManagerCommon: jasmine.SpyObj<TmCommonService>;
  let detailHandlerManager: jasmine.SpyObj<TmDetailHandlerService>;
  let validationTriggerTime: jasmine.SpyObj<ValidationTriggerTimeService>;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup;

  beforeEach(async () => {

    const transactionHistoryDefinitionManagerSpy = jasmine.createSpyObj('ThdManagerService', ['parseTransactions', 'buildTableLayout', 'buildConsultFormLayout'])
    const adfFormDefinitionSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const transactionHistorySpy = jasmine.createSpyObj('TransactionHistoryService', ['getTransactions'])
    const parameterManagerSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters'])
    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem'])
    const utilSpy = jasmine.createSpyObj('UtilService', ['hideLoader', 'scrollToTop', 'searchByMultipleAttributes', 'showLoader'])
    const pdfSpy = jasmine.createSpyObj('ThPrintService', ['pdfGenerate'])
    const reporterSpy = jasmine.createSpyObj('ThExcelService', ['generate'])
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant'])
    const transactionManagerCommonSpy = jasmine.createSpyObj('TmCommonService', ['handleNavigateToEmbbededBanking', 'isSupportedTransaction'])
    const detailHandlerManagerSpy = jasmine.createSpyObj('TmDetailHandlerService', ['goToDetailTransaction'])
    const validationTriggerTimeSpy = jasmine.createSpyObj('ValidationTriggerTimeService', ['isAvailableSchedule', 'openModal', 'validate'])

    await TestBed.configureTestingModule({
      declarations: [ ThHomeComponent, MockTranslatePipe ],
      providers: [
        { provide: ThdManagerService, useValue: transactionHistoryDefinitionManagerSpy },
        { provide: AdfFormBuilderService, useValue: adfFormDefinitionSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: {
            snapshot:{
              data:{
                view: ETransactionHistoryViews.HOME,
                scheduleService: '121212'
              }
            }
          } },
        { provide: TransactionHistoryService, useValue: transactionHistorySpy },
        { provide: ParameterManagementService, useValue: parameterManagerSpy },
        { provide: StorageService, useValue: storageSpy },
        { provide: UtilService, useValue: utilSpy },
        { provide: ThPrintService, useValue: pdfSpy },
        { provide: ThExcelService, useValue: reporterSpy },
        { provide: TranslateService, useValue: translateSpy },
        { provide: TmCommonService, useValue: transactionManagerCommonSpy },
        { provide: TmDetailHandlerService, useValue: detailHandlerManagerSpy },
        { provide: ValidationTriggerTimeService, useValue: validationTriggerTimeSpy },
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
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

    fixture = TestBed.createComponent(ThHomeComponent);
    component = fixture.componentInstance;

    transactionHistoryDefinitionManager = TestBed.inject(ThdManagerService) as jasmine.SpyObj<ThdManagerService>;
    adfFormDefinition = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    transactionHistory = TestBed.inject(TransactionHistoryService) as jasmine.SpyObj<TransactionHistoryService>;
    parameterManager = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    storage = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    pdf = TestBed.inject(ThPrintService) as jasmine.SpyObj<ThPrintService>;
    reporter = TestBed.inject(ThExcelService) as jasmine.SpyObj<ThExcelService>;
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    transactionManagerCommon = TestBed.inject(TmCommonService) as jasmine.SpyObj<TmCommonService>;
    detailHandlerManager = TestBed.inject(TmDetailHandlerService) as jasmine.SpyObj<TmDetailHandlerService>;
    validationTriggerTime = TestBed.inject(ValidationTriggerTimeService) as jasmine.SpyObj<ValidationTriggerTimeService>;
    formBuilder = TestBed.inject(FormBuilder);

    storage.getItem.and.returnValue( JSON.stringify({onlineBankingCoreServices: ''}))
    transactionHistoryDefinitionManager.buildConsultFormLayout.and.returnValue({attributes: []} as any)

    formGroup = formBuilder.group({
      [AttributeFormTransactionHistory.INITIAL_DATE]: ['', [Validators.required]],
      [AttributeFormTransactionHistory.FINAL_DATE]: [''],
    });

    adfFormDefinition.formDefinition.and.returnValue(formGroup);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
