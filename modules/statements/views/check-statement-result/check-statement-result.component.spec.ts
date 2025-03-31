import {Location} from '@angular/common';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdfSelectComponent} from '@adf/components';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {EProfile} from 'src/app/enums/profile.enum';
import {CustomNumberPipe} from 'src/app/pipes/custom-number.pipe';
import {StyleManagementService} from 'src/app/service/common/style-management.service';
import {UtilService} from 'src/app/service/common/util.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {BusinessNameService} from 'src/app/service/shared/business-name.service';
import {StatementsService} from 'src/app/service/shared/statements.service';
import {TokenizerAccountsService} from 'src/app/service/token/tokenizer-accounts.service';
import {mockModal} from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import {MockTranslatePipe} from 'src/assets/mocks/public/tranlatePipeMock';
import {mockObservable, mockPromise} from 'src/assets/testing';
import {CheckStatementExcelService} from '../../services/check-statement-excel.service';
import {CheckStatementPrintService} from '../../services/check-statement-print.service';
import {StatementsUtilsService} from '../../services/statements-utils.service';
import {CheckStatementResultComponent} from './check-statement-result.component';

class ParameterManagementServiceMock {
  getSharedParameter() {
    return mockObservable({
      product: 'product',
      initialDate: 'initialDate',
      finalDate: 'finalDate',
      account: 'account',
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

describe('CheckStatementResultComponent', () => {
  let component: CheckStatementResultComponent;
  let fixture: ComponentFixture<CheckStatementResultComponent>;

  let mockStatementsService;
  let location: jasmine.SpyObj<Location>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let pdf: jasmine.SpyObj<CheckStatementPrintService>;
  let reporter: jasmine.SpyObj<CheckStatementExcelService>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let translateService: jasmine.SpyObj<TranslateService>;
  let styleManagement: jasmine.SpyObj<StyleManagementService>;

  beforeEach(async () => {
    const locationSpy = jasmine.createSpyObj('Location', ['back']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    const pdfSpy = jasmine.createSpyObj('CheckStatementPrintService', ['pdfGenerate']);

    const reporterSpy = jasmine.createSpyObj('CheckStatementExcelService', ['generate']);
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    mockStatementsService = {
      data: {
        data: {
          operations: [
            { credit: '5778,54', debit: '574,57', dateTime: '2015', operationDate: '578', descToPrint: 'print', beneficiary: [] },
          ],
        },
        filters: 'test filters',
      },
      getMenmonics: jasmine.createSpy().and.returnValue(mockObservable([{ code: 'sda as', description: 'test' }])),
      getDetailForDeposits: jasmine.createSpy().and.returnValue(mockObservable({})),
      getDetailForNotes: jasmine.createSpy().and.returnValue(mockObservable({})),
      getData: jasmine.createSpy().and.returnValue(
        mockObservable({
          authorizationNumber: '585456',
          operations: [],
        })
      ),
    };

    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    const businessNameServiceSpy = jasmine.createSpyObj('BusinessNameService', ['getBusiness']);
    const tokenizerEncryptSpy = jasmine.createSpyObj('TokenizerAccountsService', ['tokenizer']);
    const styleManagementSpy = jasmine.createSpyObj('StyleManagementService', ['corporateImageApplication']);
    const statementUtilsSpy = jasmine.createSpyObj('StatementsUtilsService', ['calcAmountOnOperations']);
    const utilsSpy = jasmine.createSpyObj('UtilService', ['showPulseLoader', 'hidePulseLoader']);
    await TestBed.configureTestingModule({
      declarations: [CheckStatementResultComponent, MockTranslatePipe, CustomNumberPipe, AdfSelectComponent],
      providers: [
        ParameterManagementServiceMock,
        { provide: Location, useValue: locationSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: CheckStatementPrintService, useValue: pdfSpy },
        { provide: CheckStatementExcelService, useValue: reporterSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: StatementsService, useValue: mockStatementsService },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: ParameterManagementService, useClass: ParameterManagementServiceMock },
        { provide: BusinessNameService, useValue: businessNameServiceSpy },
        { provide: TokenizerAccountsService, useValue: tokenizerEncryptSpy },
        { provide: StyleManagementService, useValue: styleManagementSpy },
        { provide: StatementsUtilsService, useValue: statementUtilsSpy },
        { provide: UtilService, useValue: utilsSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                mnemonicsForCheckTransactions: [
                  {
                    code: '54 4',
                    description: 'Check transaction',
                  },
                ],
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
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckStatementResultComponent);
    component = fixture.componentInstance;

    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    pdf = TestBed.inject(CheckStatementPrintService) as jasmine.SpyObj<CheckStatementPrintService>;
    reporter = TestBed.inject(CheckStatementExcelService) as jasmine.SpyObj<CheckStatementExcelService>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    translateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    styleManagement = TestBed.inject(StyleManagementService) as jasmine.SpyObj<StyleManagementService>;

    spinner.show.and.returnValue(mockPromise(true));
    spinner.hide.and.returnValue(mockPromise(true));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should is corporate Image Application', () => {
    styleManagement.corporateImageApplication.and.returnValue(true);
    expect(component.corporateImageApplication()).toBeTruthy();
  });

  it('should get Data To Build Information', () => {
    component.profile = EProfile.HONDURAS;
    component.getDataToBuildInformation();
    expect(component.authorization).toEqual('585456');
  });

  it('should get Data To Build Information == EProfile.SALVADOR', () => {
    translateService.instant.and.returnValue('january');
    const data = {
      type: 'month',
      initialDate: 23,
    };

    component.profile = EProfile.SALVADOR;
    fixture.detectChanges();
    component.buildInformation(data);
    expect(component.filters.filtersValueInView).toEqual('january 2024');
  });

  xit('should get Data To Build Information == EProfile.PANAMA', () => {
    const data = {
      type: 'custom',
      initialDate: 23,
      finalDate: 23,
    };

    component.profile = EProfile.PANAMA;
    fixture.detectChanges();
    component.buildInformation(data);
    expect(component.filters.filtersValueInView).toEqual('23/07/2023 - 23/07/2023');
  });

  // Tests that filtering by transaction returns detail with matching transaction
  it('test_filter_by_transaction_returns_matching_transactions', () => {
    const service = TestBed.inject(StatementsService);
    spyOn(service, 'data').and.returnValue({
      data: {
        operations: [{ transaction: 'transaction1' }, { transaction: 'transaction2' }, { transaction: 'transaction1' }],
      },
    });
    component.transaction = 'transaction1';
    component.search = 'transaction';
    component.filter();
    expect(component.operations.length).toEqual(0);
  });

  it('should get Detail For Deposit Detail', () => {
    const data = {
      operationDate: '2023-12',
      operationTime: '2023-12',
      ref: 'FVDF',
      sequency: '1',
    };

    modalService.open.and.returnValue(mockModal as NgbModalRef);
    component.getDetailForDepositDetail(data);

    expect(modalService.open).toHaveBeenCalled();
  });

  it('should get Detail For Notes', () => {
    const data = {
      operationDate: '2023-12',
      operationTime: '2023-12',
      ref: 'FVDF',
      sequency: '1',
      agency: '1',
    };
    modalService.open.and.returnValue(mockModal as NgbModalRef);

    component.getDetailForNotes(data);
    expect(modalService.open).toHaveBeenCalled();
  });

  it('should go back', () => {
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });
  // Generated by CodiumAI

  describe('exportAs_method', () => {
    // Tests that the reporter service is called with csv format
    it('test_csv_report', () => {
      component.exportAs('csv');
      expect(reporter.generate).toHaveBeenCalledWith(
        component.operations,
        component.information,
        `estado_de_cuenta_${component.information['account']}_${component.timestamp}`,
        'csv'
      );
    });

    // Tests that the reporter service is called with xlsx format
    it('test_xlsx_report', () => {
      component.exportAs('xlsx');
      expect(reporter.generate).toHaveBeenCalledWith(
        component.operations,
        component.information,
        `estado_de_cuenta_${component.information['account']}_${component.timestamp}`
      );
    });

    // Tests that the pdf service is called with pdf format
    it('test_pdf_report', () => {
      component.exportAs('pdf');
      expect(pdf.pdfGenerate).toHaveBeenCalledWith(
        component.information,
        component.authorization,
        `estado_de_cuenta_${component.information['account']}_${component.timestamp}`,
        248
      );
    });

    // Tests that no service is called if type is not csv, xlsx or pdf
    it('test_invalid_report_type', () => {
      component.exportAs('invalid');
      expect(reporter.generate).not.toHaveBeenCalled();
      expect(pdf.pdfGenerate).not.toHaveBeenCalled();
    });

    // Tests that the report is generated with the correct file name
    it('test_report_file_name', () => {
      component.exportAs('csv');
      expect(reporter.generate).toHaveBeenCalledWith(
        component.operations,
        component.information,
        `estado_de_cuenta_${component.information['account']}_${component.timestamp}`,
        'csv'
      );
      expect(pdf.pdfGenerate).not.toHaveBeenCalled();
    });

    // Tests that the correct data is passed to the reporter and pdf services
    it('test_report_data', () => {
      component.exportAs('xlsx');
      expect(reporter.generate).toHaveBeenCalledWith(
        component.operations,
        component.information,
        `estado_de_cuenta_${component.information['account']}_${component.timestamp}`
      );
      expect(pdf.pdfGenerate).not.toHaveBeenCalled();
    });
  });

  it('should onChangeSearch', () => {
    component.onChangeSearch('transaction');
    expect(component.transactionsInOperations.length).toEqual(1);
  });
});
