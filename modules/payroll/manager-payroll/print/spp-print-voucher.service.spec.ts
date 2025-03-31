import {TestBed} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';
import {SppPrintVoucherService} from "./spp-print-voucher.service";
import {BusinessNameService} from "../../../../service/shared/business-name.service";
import {DatePipe} from "@angular/common";
import {StorageService} from "@adf/security";
import {UtilService} from "../../../../service/common/util.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {EProfile} from "../../../../enums/profile.enum";

describe('SppPrintVoucherService', () => {
  let service: SppPrintVoucherService;

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

    service = TestBed.inject(SppPrintVoucherService);
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;

    doc = {
      setFont: jasmine.createSpy(),
      setFontSize: jasmine.createSpy(),
      setTextColor: jasmine.createSpy(),
      splitTextToSize: jasmine.createSpy(),
      text: jasmine.createSpy(),
      line: jasmine.createSpy(),
      internal: {
        getNumberOfPages: jasmine.createSpy(),
        getFontSize: jasmine.createSpy(),
        getFont: jasmine.createSpy(),
        pageSize: {
          getWidth: jasmine.createSpy(),
        },
      },
      autoTable: jasmine.createSpy().and.callFake((_, __, options) => {
        options.headStyles = options.headStyles || {};
        options.headStyles.fontStyle = 'bold'; // Make sure this is a valid value
        return {
          headStyles: options.headStyles
        };
      }),
      lastAutoTable: {
        finalY: jasmine.createSpy(),
      },
      setDrawColor: jasmine.createSpy(),
    };

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should buildPostFooter', () => {
   //Por que no hace nada
    const res = service.buildPostFooter(doc, {});
    expect(res).toBeUndefined()
  })

  it('should buildTitles', () => {
    util.getProfile.and.returnValue(EProfile.SALVADOR);
    service.buildTitles(doc, {reference: '451sd'});

    expect(translate.instant).toHaveBeenCalled();
  })

/*
  it('should build the body', () => {
    service.buildBody(doc, iSPPEVoucherParametersMock);
  });
*/

});
