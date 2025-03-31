import {TestBed} from '@angular/core/testing';

import {PmpdVoucherModalService} from './pmpd-voucher-modal.service';
import {TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import {AdfFormatService} from "@adf/components";
import {UtilWorkFlowService} from "../../../../../../service/common/util-work-flow.service";
import {UtilService} from "../../../../../../service/common/util.service";
import {
  OtdTransferBaseVoucherModalService
} from "../../../../../transfer/modules/transfer-own/services/definition/base/otd-transfer-base-voucher-modal.service";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {
  iloadParticipantMock,
  iSPPVoucherModalParametersMock
} from "../../../../../../../assets/mocks/modules/payroll/payroll.mock";
import {Participant} from "../../../interfaces/pmp-payment-home.interface";

describe('SppdVoucherModalService', () => {
  let service: PmpdVoucherModalService;

  let translate: jasmine.SpyObj<TranslateService>;
  let formatService: jasmine.SpyObj<AdfFormatService>;
  let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>;
  let utilService: jasmine.SpyObj<UtilService>;
  let baseVoucherModal: jasmine.SpyObj<OtdTransferBaseVoucherModalService>;

  beforeEach(() => {

    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant'])
    const formatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount', 'getFormatDateTime'])
    const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['getHeadBandLayout', 'buildImagesToModal'])
    const utilServiceSpy = jasmine.createSpyObj('UtilService', ['parseNumberAsFloat', 'getLabelProduct', 'geCurrencSymbol'])
    const baseVoucherModalSpy = jasmine.createSpyObj('OtdTransferBaseVoucherModalService', ['builderAttributes'])

    TestBed.configureTestingModule({
      providers: [
        {provide: TranslateService, useValue: translateSpy},
        {provide: AdfFormatService, useValue: formatServiceSpy},
        {provide: UtilWorkFlowService, useValue: utilWorkFlowSpy},
        {provide: UtilService, useValue: utilServiceSpy},
        {provide: OtdTransferBaseVoucherModalService, useValue: baseVoucherModalSpy},
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    service = TestBed.inject(PmpdVoucherModalService);
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    formatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
    utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
    utilService = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    baseVoucherModal = TestBed.inject(OtdTransferBaseVoucherModalService) as jasmine.SpyObj<OtdTransferBaseVoucherModalService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should builderLayoutVoucherModal', ()=> {

    const req = service.builderLayoutVoucherModal(iSPPVoucherModalParametersMock);
    expect(req).toBeDefined();
    expect(req.titleModal).toEqual('payroll:label_voucher_modal')
    expect(req.containerValue).toEqual('note_list-sv')
  })

  it('should tableDefinition', () => {
    const req = service.tableDefinition([iloadParticipantMock as Participant]);
    expect(req).toBeDefined();
  })

});
