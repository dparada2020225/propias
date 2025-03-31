import { TestBed } from '@angular/core/testing';

import { StorageService } from '@adf/security';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';
import { BusinessNameService } from 'src/app/service/shared/business-name.service';
import { NoteStatementPrintService } from './note-statement-print.service';

describe('NoteStatementPrintService', () => {
  let service: NoteStatementPrintService;
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
    service = TestBed.inject(NoteStatementPrintService);

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

  it('should build titles', () => {
    service.currentLanguage = 'en';
    const data = {
      type: 'CREDITO',
      name: 'test',
    };

    service.buildTitles(doc, data);
    expect(doc.setFontSize).toHaveBeenCalledWith(10);
    expect(doc.setTextColor).toHaveBeenCalledWith(90, 90, 90);
  });

  it('should build body', () => {
    const data = {
      concept: 'common',
      date: '2014',
      typeAccount: 'nor',
      account: '876',
      alias: 'alias',
      agency: '1',
      reasonCode: 'true',
      observation: '2016',
      reference: '6877',
      address: '9+85',
      reason: 'normal',
      description: '695',
      currency: '$',
      amount: '537',
    };

    service.buildBody(doc, data);

    expect(doc.text).toHaveBeenCalledTimes(24);
  });

  it('should buildPostFooter', () => {
    spyOn(service, 'buildPosterFooterForStatementModule');
    service.buildPostFooter(doc, {});
    expect(service.buildPosterFooterForStatementModule).toHaveBeenCalled();
  });
});
