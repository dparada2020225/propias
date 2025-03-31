import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AdfButtonComponent, AdfSelectComponent } from '@adf/components';
import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Product } from 'src/app/enums/product.enum';
import { EProfile } from 'src/app/enums/profile.enum';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { BusinessNameService } from 'src/app/service/shared/business-name.service';
import { StatementsService } from 'src/app/service/shared/statements.service';
import { TokenizerAccountsService } from 'src/app/service/token/tokenizer-accounts.service';
import { mockModal } from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import { mockObservable, mockPromise } from 'src/assets/testing';
import { CheckStatementExcelService } from '../../services/check-statement-excel.service';
import { CheckStatementPrintService } from '../../services/check-statement-print.service';
import { StatementsUtilsService } from '../../services/statements-utils.service';
import { CheckStatementComponent } from './check-statement.component';

class ParameterManagementServiceMock {
  getSharedParameter() {
    return mockObservable({
      account: '25481',
      product: '1',
    });
  }
  getParameter() {
    return {
      account: '25481',
      product: '1',
    };
  }
  getMenuEquivalence() {
    return 'menu';
  }
  sendParameters(data?) {
    return data;
  }
}

class SpinnerClassMock {
  show() {
    return mockPromise(true);
  }
  hide() {
    return mockPromise(true);
  }
}

describe('CheckStatementComponent', () => {
  let component: CheckStatementComponent;
  let fixture: ComponentFixture<CheckStatementComponent>;

  let location: jasmine.SpyObj<Location>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let pdf: jasmine.SpyObj<CheckStatementPrintService>;
  let reporter: jasmine.SpyObj<CheckStatementExcelService>;
  let router: jasmine.SpyObj<Router>;
  let statementsService: jasmine.SpyObj<StatementsService>;
  let formBuilder: FormBuilder;
  let formGroup: FormGroup<{
    movementType: FormControl<string | null>;
    visualization: FormControl<string | null>;
    account: FormControl<string | null>;
  }>;

  beforeEach(async () => {
    const locationSpy = jasmine.createSpyObj('Location', ['back']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    const pdfSpy = jasmine.createSpyObj('CheckStatementPrintService', ['pdfGenerate']);

    const reporterSpy = jasmine.createSpyObj('CheckStatementExcelService', ['generate']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'router']);
    const statementsServiceSpy = jasmine.createSpyObj('StatementsService', ['statementsService', 'getMenmonics', 'data']);
    const tokenizerEncryptSpy = jasmine.createSpyObj('TokenizerAccountsService', ['']);
    const businessNameSpy = jasmine.createSpyObj('BusinessNameService', ['']);

    const utilSpy = jasmine.createSpyObj('UtilService', ['scrollToTop', 'hideLoader']);

    const statementsUtilsSpy = jasmine.createSpyObj('StatementsUtilsService', ['calcAmountOnOperations']);

    await TestBed.configureTestingModule({
      declarations: [CheckStatementComponent, AdfSelectComponent, AdfButtonComponent],
      providers: [
        ParameterManagementServiceMock,
        { provide: Location, useValue: locationSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: CheckStatementPrintService, useValue: pdfSpy },
        { provide: CheckStatementExcelService, useValue: reporterSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ParameterManagementService, useClass: ParameterManagementServiceMock },
        { provide: StatementsService, useValue: statementsServiceSpy },
        { provide: NgxSpinnerService, useClass: SpinnerClassMock },
        { provide: TokenizerAccountsService, useValue: tokenizerEncryptSpy },
        { provide: BusinessNameService, useValue: businessNameSpy },
        { provide: UtilService, useValue: utilSpy },
        { provide: StatementsUtilsService, useValue: statementsUtilsSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                mnemonicStatementResolver: [{ code: '1 1', description: 'test' }],
              },
            },
          },
        },
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

    fixture = TestBed.createComponent(CheckStatementComponent);
    component = fixture.componentInstance;

    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    pdf = TestBed.inject(CheckStatementPrintService) as jasmine.SpyObj<CheckStatementPrintService>;
    reporter = TestBed.inject(CheckStatementExcelService) as jasmine.SpyObj<CheckStatementExcelService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    statementsService = TestBed.inject(StatementsService) as jasmine.SpyObj<StatementsService>;
    formBuilder = TestBed.inject(FormBuilder);

    formGroup = formBuilder.group({
      movementType: ['', Validators.required],
      visualization: ['', Validators.required],
      account: ['', Validators.required],
    });

    component.form = formGroup;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open Filter Modal with day', fakeAsync(() => {
    modalService.open.and.returnValue(mockModal as NgbModalRef);
    statementsService.getMenmonics.and.returnValue(mockObservable([{ code: 'CHECK_TRANSACTIONS' }]));
    component.openFilterModal('day');
    tick();
    expect(statementsService.getMenmonics).toHaveBeenCalledWith('CHECK_TRANSACTION');
    expect(component.mapTransactions).toEqual({ CHECK_TRANSACTIONS: 'CHECK_TRANSACTIONS' });
  }));

  it('should open Filter Modal with day and form value = SCR', fakeAsync(() => {
    modalService.open.and.returnValue({
      result: mockPromise({
        filters: {
          initialDate: '5717',
          finalDate: '2017',
        },
      }),
      componentInstance: {},
    } as any);
    component.form.patchValue({
      visualization: 'SCR',
    });
    router.navigate.and.returnValue(mockPromise(true));
    fixture.detectChanges();

    component.openFilterModal('day');
    tick();
    expect(statementsService.getMenmonics).not.toHaveBeenCalled();

    component.onChangeAccount();
  }));

  it('should return when rirect = true', () => {
    component.return(true);
    expect(location.back).toHaveBeenCalled();
  });

  it('should return when rirect = false', fakeAsync(() => {
    component.return(false);
    tick();

    expect(component.availableDownload).toBeFalsy();
    expect(component.form.value).toBeDefined();
  }));

  // Tests that calculate method calculates the amounts for each operation in the array and updates the summary object with the calculated amounts
  it('test_calculate_with_valid_data', () => {
    const operations = [
      {
        transaction: '1',
        credit: '10.00',
        debit: '0.00',
        operationDate: '2022-01-01',
        operationTime: '12:00:00',
        description: 'desc1',
        channel: 'channel1',
        beneficiary: '',
      },
      {
        transaction: '2',
        credit: '0.00',
        debit: '20.00',
        operationDate: '2022-01-02',
        operationTime: '12:00:00',
        description: 'desc2',
        channel: 'channel2',
        beneficiary: '',
      },
      {
        transaction: '3',
        credit: '30.00',
        debit: '0.00',
        operationDate: '2022-01-03',
        operationTime: '12:00:00',
        description: 'desc3',
        channel: 'channel3',
        beneficiary: '',
      },
    ];
    const expectedAmounts = {
      debit: { description: 'label.statements.debits', transactionAmount: 2, amount: 20 },
      credit: { description: 'label.statements.credits', transactionAmount: 2, amount: 40 },
      'paid-checks': { description: 'label.statements.paid-checks', transactionAmount: 0, amount: 0 },
    };

    component.mapTransactions = {};
    component.amounts = {
      debit: { description: 'label.statements.debits', transactionAmount: 2, amount: 20 },
      credit: { description: 'label.statements.credits', transactionAmount: 2, amount: 40 },
      'paid-checks': { description: 'label.statements.paid-checks', transactionAmount: 0, amount: 0 },
    };
    component.information = { operations };
    component.profile = EProfile.SALVADOR;
    fixture.detectChanges();
    component.calculate(operations);
    expect(component.amounts).toEqual(expectedAmounts);
  });

  it('test_csv_report_generation', () => {
    const data = [{}, {}];
    const information = { operations: data, account: '123' };
    const form = { value: { visualization: 'CSV' } };
    component.information = information;
    component.form = form as any;
    component.download();
    expect(reporter.generate).toHaveBeenCalledWith(
      data,
      information,
      `estado_de_cuenta_${information['account']}_${component.timestamp}`,
      'csv'
    );
  });

  // Tests that an XLS report is generated when visualization is XLS
  it('test_xls_report_generation', () => {
    const data = [{}, {}];
    const information = { operations: data, account: '123' };
    const form = { value: { visualization: 'XLS' } };
    component.information = information;
    component.form = form as any;
    component.download();
    expect(reporter.generate).toHaveBeenCalledWith(data, information, `estado_de_cuenta_${information['account']}_${component.timestamp}`);
  });

  // Tests that a PDF report is generated when visualization is PDF
  it('test_pdf_report_generation', () => {
    const data = [{}, {}];
    const information = { operations: data, account: '123', authorizationNumber: '456' };
    const form = { value: { visualization: 'PDF' } };
    component.information = information;
    component.form = form as any;
    component.download();
    expect(pdf.pdfGenerate).toHaveBeenCalledWith(
      information,
      information.authorizationNumber,
      `estado_de_cuenta_${information['account']}_${component.timestamp}`,
      248
    );
  });

  // Tests that a warning is issued when reporter type is not defined
  it('test_reporter_type_not_defined_warning', () => {
    const data = [{}, {}];
    const information = { operations: data, account: '123' };
    const form = { value: { visualization: 'OTHER' } };
    spyOn(console, 'warn');
    component.information = information;
    component.form = form as any;
    component.download();
    expect(console.warn).toHaveBeenCalledWith('Reporter type not defined');
  });

  // Generated by CodiumAI

  describe('getProductEquivalencesForTranslate_method', () => {
    // Tests that the method returns the correct translation for Product.CHECK
    it('test_check_product_translation', () => {
      expect(component.getProductEquivalencesForTranslate(Product.CHECK)).toEqual('label.home.checks');
    });

    // Tests that the method returns the correct translation for Product.SAVINGS
    it('test_savings_product_translation', () => {
      expect(component.getProductEquivalencesForTranslate(Product.SAVINGS)).toEqual('label.home.savings');
    });

    // Tests that the method returns an empty string for an unknown product
    it('test_unknown_product_translation', () => {
      expect(component.getProductEquivalencesForTranslate('unknown')).toEqual('');
    });

    // Tests that the method handles null input
    it('test_null_input', () => {
      expect(component.getProductEquivalencesForTranslate(null as any)).toEqual('');
    });

    // Tests that the method handles undefined input
    it('test_undefined_input', () => {
      expect(component.getProductEquivalencesForTranslate(undefined as any)).toEqual('');
    });

    // Tests that the method handles empty string input
    it('test_empty_string_input', () => {
      expect(component.getProductEquivalencesForTranslate('')).toEqual('');
    });
  });
});
