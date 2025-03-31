import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';

import {AdfFormBuilderService} from '@adf/components';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {
  iACHCFormMock,
  iCOResponseAccountMock,
  iCOResponseCreditsMock,
  iCOResponseDebitsMock,
  iCOTransactionCreditDetailMock,
} from 'src/assets/mocks/modules/transfer/service/transfer-ach/ach.data.mock';
import {MockTranslatePipe} from 'src/assets/mocks/public/tranlatePipeMock';
import {clickElement, mockObservable, mockObservableError, mockPromise} from 'src/assets/testing';
import {CACH_TYPE_MOVEMENTS} from '../../const/cach-common.enum';
import {AttributeFormConsultAch, EConsultACHTableActions} from '../../interfaces/consult-ach-form.interface';
import {CadManagerService} from '../../services/definition/cad-manager.service';
import {ConsultAchExcelServiceService} from '../../services/print/consult-ach-excel-service.service';
import {ConsultAchPrintService} from '../../services/print/consult-ach-print.service';
import {ConsultAchService} from '../../services/transaction/consult-ach.service';
import {ConsultAchHomeComponent} from './consult-ach-home.component';

xdescribe('ConsultAchHomeComponent', () => {
  let component: ConsultAchHomeComponent;
  let fixture: ComponentFixture<ConsultAchHomeComponent>;

  let consultAchDefinitionManager: jasmine.SpyObj<CadManagerService>;
  let adfFormBuilder: jasmine.SpyObj<AdfFormBuilderService>;
  let translateService: jasmine.SpyObj<TranslateService>;
  let consultAchTransaction: jasmine.SpyObj<ConsultAchService>;
  let router: jasmine.SpyObj<Router>;
  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let pdfGeneralService: jasmine.SpyObj<ConsultAchPrintService>;
  let xlsService: jasmine.SpyObj<ConsultAchExcelServiceService>;
  let util: jasmine.SpyObj<UtilService>;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup;

  beforeEach(async () => {
    const consultAchDefinitionManagerSpy = jasmine.createSpyObj('CadManagerService', ['buildTableLayout', 'buildFormLayout']);
    const adfFormBuilderSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    const consultAchTransactionSpy = jasmine.createSpyObj('ConsultAchService', [
      'getTransactionDebits',
      'getTransactionCredit',
      'getTransactionCreditDetail',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters']);
    const pdfGeneralServiceSpy = jasmine.createSpyObj('ConsultAchPrintService', ['pdfGenerate']);
    const xlsServiceSpy = jasmine.createSpyObj('ConsultAchExcelServiceService', ['generate']);
    const utilSpy = jasmine.createSpyObj('UtilService', [
      'hidePulseLoader',
      'scrollToTop',
      'showPulseLoader',
      'hideLoader',
      'showLoader',
      'parseCustomNumber',
    ]);

    await TestBed.configureTestingModule({
      declarations: [ConsultAchHomeComponent, MockTranslatePipe],
      providers: [
        { provide: CadManagerService, useValue: consultAchDefinitionManagerSpy },
        { provide: AdfFormBuilderService, useValue: adfFormBuilderSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: ConsultAchService, useValue: consultAchTransactionSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ParameterManagementService, useValue: parameterManagementSpy },
        { provide: ConsultAchPrintService, useValue: pdfGeneralServiceSpy },
        { provide: ConsultAchExcelServiceService, useValue: xlsServiceSpy },
        { provide: UtilService, useValue: utilSpy },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        ReactiveFormsModule,
        FormsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultAchHomeComponent);
    component = fixture.componentInstance;

    consultAchDefinitionManager = TestBed.inject(CadManagerService) as jasmine.SpyObj<CadManagerService>;
    adfFormBuilder = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
    translateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    consultAchTransaction = TestBed.inject(ConsultAchService) as jasmine.SpyObj<ConsultAchService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    pdfGeneralService = TestBed.inject(ConsultAchPrintService) as jasmine.SpyObj<ConsultAchPrintService>;
    xlsService = TestBed.inject(ConsultAchExcelServiceService) as jasmine.SpyObj<ConsultAchExcelServiceService>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    formBuilder = TestBed.inject(FormBuilder);

    formGroup = formBuilder.group({
      [AttributeFormConsultAch.InitDate]: '',
      [AttributeFormConsultAch.FinalDate]: '',
      [AttributeFormConsultAch.MinRange]: '',
      [AttributeFormConsultAch.MaxRange]: ['', [Validators.required]],
      [AttributeFormConsultAch.TypeOfOperation]: ['', [Validators.required]],
    });

    consultAchDefinitionManager.buildFormLayout.and.returnValue({
      attributes: [],
    } as any);

    adfFormBuilder.formDefinition.and.returnValue(formGroup);
    parameterManagement.getParameter.and.returnValue(iACHCFormMock);

    consultAchTransaction.getTransactionCredit.and.returnValue(mockObservable(iCOResponseCreditsMock));

    fixture.detectChanges();
  });

  it('should create ConsultAchHomeComponent', () => {
    expect(component).toBeTruthy();
  });

  it('button "return" should call method backStep() when do click', () => {
    router.navigate.and.returnValue(mockPromise(true));
    component.isShowNextButton = true;
    fixture.detectChanges();

    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('button "return" should call method backStep() when do click', () => {
    component.isShowNextButton = false;
    fixture.detectChanges();

    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();

    expect(component.isShowNextButton).toBeTruthy();
    expect(component.isShowTable).toBeFalsy();
    expect(component.isLoadingTable).toBeTruthy();
    expect(component.showFilterValue).toBeFalsy();
  });

  it('should sendTransactionDebit', () => {
    consultAchTransaction.getTransactionDebits.and.returnValue(mockObservable(iCOResponseDebitsMock));

    const initDate: number = 1;
    const finalDate: number = 5;

    component.sendTransactionDebit(initDate, finalDate);

    expect(component.isShowNextButton).toBeFalsy();
  });

  it('should getActionTable', () => {
    router.navigate.and.returnValue(mockPromise(true));
    consultAchTransaction.getTransactionCreditDetail.and.returnValue(mockObservable(iCOTransactionCreditDetailMock));
    component.form.get(AttributeFormConsultAch.TypeOfMovement)?.setValue(CACH_TYPE_MOVEMENTS.CREDIT);
    fixture.detectChanges();
    component.getActionTable({
      action: EConsultACHTableActions.VIEW_DETAIL,
      item: iCOResponseAccountMock,
    });

    expect(router.navigate).toHaveBeenCalledWith(['/transfer/consult-ach/detail']);
    expect(parameterManagement.sendParameters).toHaveBeenCalled();
  });

  it('should generateCsvFile', () => {
    component.isShowTable = true;
    component.isShowExport = true;

    fixture.detectChanges();

    clickElement(fixture, 'i.banca-regional-csv');
    fixture.detectChanges();

    expect(xlsService.generate).toHaveBeenCalledWith(component.tableInfo, {}, 'Consulta de operaciones', 'csv');
  });

  it('should generateXlsFile', () => {
    component.isShowTable = true;
    component.isShowExport = true;

    fixture.detectChanges();

    clickElement(fixture, 'i.banca-regional-xls');
    fixture.detectChanges();

    expect(xlsService.generate).toHaveBeenCalledWith(component.tableInfo, {}, 'Consulta de operaciones');
  });

  it('should exportGeneralFile', () => {
    component.isShowTable = true;
    component.isShowExport = true;

    fixture.detectChanges();

    clickElement(fixture, 'i.banca-regional-printer');
    fixture.detectChanges();

    expect(pdfGeneralService.pdfGenerate).toHaveBeenCalled();
  });

  it('should sendTransactionCredit service response error', () => {
    const message: string = 'Error sending';

    consultAchTransaction.getTransactionCredit.and.returnValue(
      mockObservableError({
        error: { message },
      })
    );

    component.sendTransactionCredit(12, 23);

    expect(component.typeAlert).toEqual('error');
    expect(component.messageAlert).toEqual(message);
  });
});
