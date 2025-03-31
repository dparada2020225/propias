import {TestBed} from '@angular/core/testing';

import {StorageService} from '@adf/security';
import {DatePipe} from '@angular/common';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {EProfile} from 'src/app/enums/profile.enum';
import {UtilService} from 'src/app/service/common/util.service';
import {BusinessNameService} from 'src/app/service/shared/business-name.service';
import {CheckStatementPrintService} from './check-statement-print.service';

describe('CheckStatementPrintService', () => {
  let service: CheckStatementPrintService;
  let translate: jasmine.SpyObj<TranslateService>;
  let storageService: jasmine.SpyObj<StorageService>;
  let doc;

  beforeEach(() => {
    const businessNameServiceSpy = jasmine.createSpyObj('BusinessNameService', ['businessNameService', 'getBusinessType']);
    const datePipeSpy = jasmine.createSpyObj('DatePipe', ['datePipe']);
    const translateSpy = jasmine.createSpyObj('TranslateService', ['translate', 'instant']);
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['storageService', 'getItem']);
    const utilSpy = jasmine.createSpyObj('UtilService', ['util']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['modalService']);
    TestBed.configureTestingModule({
      providers: [
        { provide: BusinessNameService, useValue: businessNameServiceSpy },
        { provide: DatePipe, useValue: datePipeSpy },
        { provide: TranslateService, useValue: translateSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: UtilService, useValue: utilSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
      ],
    });
    service = TestBed.inject(CheckStatementPrintService);
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;

    doc = {
      setFont: jasmine.createSpy(),
      setFontSize: jasmine.createSpy(),
      setTextColor: jasmine.createSpy(),
      splitTextToSize: jasmine.createSpy(),
      text: jasmine.createSpy(),
      line: jasmine.createSpy(),
      internal: {
        getNumberOfPages: jasmine.createSpy(),
        pageSize: {
          getWidth: jasmine.createSpy(),
        },
      },
      autoTable: jasmine.createSpy(),
      lastAutoTable: {
        finalY: jasmine.createSpy(),
      },
      setDrawColor: jasmine.createSpy(),
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('builds titles with bipa profile', () => {
    const data = { accountName: 'test account name' };
    service.profile = EProfile.PANAMA;
    service.buildTitles(doc, data);
    expect(doc.setTextColor).toHaveBeenCalledWith(44, 139, 158);
  });

  it('test_happy_path_profile_banpais', () => {
    const data = { accountName: 'test account name' };
    service.profile = EProfile.HONDURAS;
    service.buildTitles(doc, data);
    expect(doc.setTextColor).toHaveBeenCalledWith(10, 73, 137);
  });

  it('test_happy_path_profile_bisv', () => {
    const data = { accountName: 'test account name' };
    service.profile = EProfile.SALVADOR;
    service.buildTitles(doc, data);
    expect(doc.setTextColor).toHaveBeenCalledWith(12, 63, 120);
  });

  it('test_happy_path_profile_unrecognized', () => {
    const data = { accountName: 'test account name' };
    service.profile = 'unrecognized' as any;
    service.buildTitles(doc, data);
    expect(doc.setTextColor).toHaveBeenCalledWith(1, 92, 141);
  });

  it('test_empty_items_array', () => {
    translate.instant.and.returnValue('translate fake');
    const data = {
      accountName: 'Account Name',
      operations: [],
    };

    service.buildBody(doc, data);
    expect(doc.text).toHaveBeenCalled()
  });

  it('test_special_characters_in_data', () => {
    translate.instant.and.returnValue('translate fake');

    const data = {
      accountName: 'Account Name',
      summary: {
        credit: {
          description: 'test',
          transactionAmount: '687',
          amount: 658.21,
        },
        debit: {
          description: 'test',
          transactionAmount: '687',
          amount: 658.21,
        },
        'paid-checks': {
          description: 'test',
          transactionAmount: '654',
          amount: 658.21,
        },
      },
      operations: [
        {
          operationDate: '2022-01-01',
          transaction: 'TRX',
          ref: 'REF',
          descToPrint: 'Description with special characters: áéíóúñ',
          debit: '10.00',
          credit: '',
          balance: '10.00',
        },
      ],
    };

    service.buildBody(doc, data);
    expect(doc.autoTable).toHaveBeenCalledTimes(4);
  });

  it('test_happy_path_columns_4_to_6', () => {
    const a = {
      column: { index: 5 },
      section: 'body',
      cell: {
        styles: {
          halign: '',
        },
      },
    };
    const expected = 'right';

    service.moveTextToRight(a);

    expect(a.cell.styles.halign).toBe(expected);
  });

  it('test_happy_path_postfooter_description', () => {
    translate.instant.and.returnValue('translate fake');

    const data = {};

    storageService.getItem.and.returnValue(JSON.stringify({ contactsInfo: { phone: '12345678' } }));
    service.buildPostFooter(doc, data);
    expect(doc.setFont).toHaveBeenCalledWith('Lato-Regular', 'normal');
    expect(doc.setFontSize).toHaveBeenCalledWith(8);
    expect(doc.setTextColor).toHaveBeenCalledWith(155, 155, 155);
    expect(doc.setFont).toHaveBeenCalledWith('Lato-Regular', 'normal');
    expect(doc.setFontSize).toHaveBeenCalledWith(10);
    expect(doc.setTextColor).toHaveBeenCalledWith(90, 90, 90);
  });
});
