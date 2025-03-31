import {TestBed} from '@angular/core/testing';

import {TransfersPrintService} from './transfers-print.service';
import {TranslateService} from "@ngx-translate/core";
import {StorageService} from "@adf/security";
import {UtilService} from "../../../service/common/util.service";
import {BusinessNameService} from "../../../service/shared/business-name.service";
import {DatePipe} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

describe('TransfersPrintService', () => {
  let service: TransfersPrintService;

  let translate: jasmine.SpyObj<TranslateService>;
  let storageService: jasmine.SpyObj<StorageService>;
  let util: jasmine.SpyObj<UtilService>;
  let doc;

  beforeEach(() => {
    const businessNameServiceSpy = jasmine.createSpyObj('BusinessNameService', ['businessNameService', 'getBusinessType']);
    const datePipeSpy = jasmine.createSpyObj('DatePipe', ['datePipe']);
    const translateSpy = jasmine.createSpyObj('TranslateService', ['translate', 'instant']);
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['storageService', 'getItem']);
    const utilSpy = jasmine.createSpyObj('UtilService', ['util', 'getLabelProduct', 'getProfile']);
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
    service = TestBed.inject(TransfersPrintService);
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
