import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ProjectionsExcelService } from './projections-excel.service';

describe('ProjectionsExcelService', () => {
  let service: ProjectionsExcelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });

    service = TestBed.inject(ProjectionsExcelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Tests that formatData formats data with commas correctly
  it('test_format_data_with_commas', () => {
    const data = {
      date: '2022-01-01',
      days: 10,
      interest: '1,000',
      isr: '100',
      netInterest: '900',
      accumulated: '9,000',
      status: 'status',
    };
    const result = service.formatData(data);
    expect(result).toEqual(['2022-01-01', 10, 1000, 100, 900, 9000, 'status']);
  });

  // Tests that formatData formats data with strings correctly
  it('test_format_data_with_strings', () => {
    const data = {
      date: '2022-01-01',
      days: 10,
      interest: '1000',
      isr: '100',
      netInterest: '900',
      accumulated: '9000',
      status: 'status',
    };
    const result = service.formatData(data);
    expect(result).toEqual(['2022-01-01', 10, 1000, 100, 900, 9000, 'status']);
  });

  // Tests that the method returns an array with four elements when given an object with accountDetail property
  it('test_happy_path_returns_array_with_four_elements', () => {
    const object = {
      accountDetail: {
        accountAlias: 'alias',
        accountName: 'name',
        account: '1234',
        currency: 'USD',
      },
    };
    const result = service.formatDataheader(object);
    expect(result).toEqual(['alias', 'name', '1234', 'USD']);
  });

  it('test_csv_formatting', () => {
    const list = [
      {
        date: '2022-01-01',
        days: 10,
        interest: '100.00',
        isr: '10.00',
        netInterest: '90.00',
        accumulated: '1000.00',
        status: 'paid',
      },
    ];
    const object = {
      accountDetail: {
        accountAlias: 'alias',
        accountName: 'name',
        account: '1234567890',
        currency: 'MXN',
      },
    };
    const worksheet = {
      addRow: jasmine.createSpy(),
      getColumn: jasmine.createSpy().and.returnValue({ values: [] }),
      getRow: jasmine.createSpy().and.returnValue({ value: [] }),
    };
    const type = 'csv';
    service.buildBody(list, object, worksheet, type);
    expect(worksheet.addRow).toHaveBeenCalledTimes(1);
  });

  it('test_non_csv_formatting', () => {
    const list = [
      {
        date: '2022-01-01',
        days: 10,
        interest: '100.00',
        isr: '10.00',
        netInterest: '90.00',
        accumulated: '1000.00',
        status: 'paid',
      },
    ];
    const object = {
      accountDetail: {
        accountAlias: 'alias',
        accountName: 'name',
        account: '1234567890',
        currency: 'MXN',
      },
    };
    const worksheet = {
      addRow: jasmine.createSpy(),
      getColumn: jasmine.createSpy().and.returnValue({ values: [] }),
      getRow: jasmine.createSpy().and.returnValue({ value: [] }),
    };
    const type = 'xlsx';
    service.buildBody(list, object, worksheet, type);
    expect(worksheet.addRow).toHaveBeenCalledTimes(2);
  });
});
