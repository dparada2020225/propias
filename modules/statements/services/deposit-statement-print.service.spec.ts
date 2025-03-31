import {TestBed} from '@angular/core/testing';

import {StorageService} from '@adf/security';
import {DatePipe} from '@angular/common';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {UtilService} from 'src/app/service/common/util.service';
import {BusinessNameService} from 'src/app/service/shared/business-name.service';
import {DepositStatementPrintService} from './deposit-statement-print.service';

describe('DepositStatementPrintService', () => {
  let service: DepositStatementPrintService;
  let translate: jasmine.SpyObj<TranslateService>;
  let doc;

  beforeEach(() => {
    const businessNameServiceSpy = jasmine.createSpyObj('BusinessNameService', ['businessNameService', 'getBusinessType']);
    const datePipeSpy = jasmine.createSpyObj('DatePipe', ['datePipe']);
    const translateSpy = jasmine.createSpyObj('TranslateService', ['translate', 'instant', 'currentLang']);
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['storageService', 'getItem']);
    const utilSpy = jasmine.createSpyObj('UtilService', ['util', 'removeLeftPadZeros']);
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
    service = TestBed.inject(DepositStatementPrintService);
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;

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

  it('should build Titles', () => {
    translate.instant.and.returnValue('translate fake');

    service.buildTitles(doc, {});
    expect(doc.setFontSize).toHaveBeenCalledWith(14);
    expect(doc.setTextColor).toHaveBeenCalledWith(10, 73, 137);
    expect(doc.line).toHaveBeenCalledWith(10, 43, 200, 43);
  });

  it('should build body', () => {
    translate.instant.and.returnValue('translate fake');

    const data = {
      information: {
        detail: [{ description: 'description' }],
        agency: '1',
        deposit: '7425',
      },
      operation: {
        value: 'test',
        operationDate: '12',
        operationTime: '12',
      },
      general: {
        currency: 'usd',
        account: '8673564',
      },
    };

    service.buildBody(doc, data);
    expect(doc.text).toHaveBeenCalled();
    expect(doc.line).toHaveBeenCalled()
  });

  it('should buildPostFooter', () => {
    spyOn(service, 'buildPosterFooterForStatementModule');
    service.buildPostFooter(doc, {});
    expect(service.buildPosterFooterForStatementModule).toHaveBeenCalled();
  });
});
