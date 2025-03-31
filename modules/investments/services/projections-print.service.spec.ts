import { StorageService } from '@adf/security';
import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import jsPDF from 'jspdf';
import { UtilService } from 'src/app/service/common/util.service';
import { BusinessNameService } from 'src/app/service/shared/business-name.service';
import { ProjectionsPrintService } from './projections-print.service';

describe('ProjectionsPrintService', () => {
  let service: ProjectionsPrintService;

  let storageService: jasmine.SpyObj<StorageService>;
  let translate: jasmine.SpyObj<TranslateService>;
  let doc: jsPDF;

  beforeEach(() => {
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem']);
    const businessNameServiceSpy = jasmine.createSpyObj('BusinessNameService', ['getBusinessType']);
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    const datePipeSpy = jasmine.createSpyObj('DatePipe', ['datePipe']);
    const utilSpy = jasmine.createSpyObj('UtilService', ['util']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['modalService']);
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: BusinessNameService, useValue: businessNameServiceSpy },
        { provide: TranslateService, useValue: translateSpy },
        { provide: DatePipe, useValue: datePipeSpy },
        { provide: UtilService, useValue: utilSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
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
    });

    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;

    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;

    doc = new jsPDF();
    translate.instant.and.returnValue('tranlate fake');
    service = TestBed.inject(ProjectionsPrintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('test_build_titles', () => {
    const data = {};
    service.buildTitles(doc, data);
    expect(doc.getFontSize()).toEqual(12);
    expect(doc.getFont().fontStyle).toEqual('normal');
  });

  it('test_build_body', () => {
    const data = {
      accountDetail: {
        accountAlias: 'alias',
        accountName: 'name',
        account: 'account',
        currency: 'currency',
        status: 'status',
      },
      movements: [
        {
          date: 'date',
          days: 1,
          currency: 'currency',
          interest: 1,
          isr: 1,
          netInterest: 1,
          accumulated: 1,
          status: 'pagado',
        },
      ],
      total: {
        days: 1,
        currency: 'currency',
        interest: 1,
        isr: 1,
        netInterest: 1,
        accumulated: 1,
      },
    };
    service.buildBody(doc, data);
    expect(doc.getFontSize()).toEqual(14);
    expect(doc.getFont().fontStyle).toEqual('normal');
    expect(doc.getLineHeight()).toEqual(16.099999999999998);
  });

  it('test_happy_path_set_font', () => {
    storageService.getItem.and.returnValue(
      JSON.stringify({
        contactsInfo: {
          phone: '54345313',
          address: '123 Main',
        },
      })
    );

    const doc = {
      setFont: jasmine.createSpy(),
      setFontSize: jasmine.createSpy(),
      setTextColor: jasmine.createSpy(),
      splitTextToSize: jasmine.createSpy(),
      text: jasmine.createSpy(),
    };
    const data = {};
    service.buildPostFooter(doc, data);
    expect(doc.setFont).toHaveBeenCalledWith('Lato-Regular', 'normal');
    expect(doc.setFontSize).toHaveBeenCalledWith(8);
    expect(doc.setTextColor).toHaveBeenCalledWith(155, 155, 155);
  });
});
