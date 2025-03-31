import {TestBed} from '@angular/core/testing';

import {ReservationDetailPrintService} from './reservation-detail-print.service';
import {TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";
import {BusinessNameService} from "../shared/business-name.service";
import {UtilService} from "../common/util.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {StorageService} from "@adf/security";

describe('ReservationDetailPrintService', () => {
  let service: ReservationDetailPrintService;

  let translate: jasmine.SpyObj<TranslateService>;
  let businessNameService: jasmine.SpyObj<BusinessNameService>;
  let datePipe: jasmine.SpyObj<DatePipe>;
  let storageService: jasmine.SpyObj<StorageService>;
  let util: jasmine.SpyObj<UtilService>;
  let modalService: jasmine.SpyObj<NgbModal>;

  beforeEach(() => {

    const translateSpy = jasmine.createSpyObj('TranslateService', ['defaultLang', 'currentLang', 'instant'])
    const businessNameServiceSpy = jasmine.createSpyObj('BusinessNameService', ['getBusinessType', 'getBusiness'])
    const datePipeSpy = jasmine.createSpyObj('DatePipe', ['transform'])
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem'])
    const utilSpy = jasmine.createSpyObj('UtilService', ['getUserName'])
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open', 'dismissAll'])

    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        {provide: TranslateService, useValue: translateSpy},
        {provide: BusinessNameService, useValue: businessNameServiceSpy},
        {provide: DatePipe, useValue: datePipeSpy},
        {provide: StorageService, useValue: storageServiceSpy},
        {provide: UtilService, useValue: utilSpy},
        {provide: NgbModal, useValue: modalServiceSpy},
      ]
    });
    service = TestBed.inject(ReservationDetailPrintService);
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    businessNameService = TestBed.inject(BusinessNameService) as jasmine.SpyObj<BusinessNameService>;
    datePipe = TestBed.inject(DatePipe) as jasmine.SpyObj<DatePipe>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
