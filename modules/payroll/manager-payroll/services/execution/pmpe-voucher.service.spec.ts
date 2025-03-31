import {TestBed} from '@angular/core/testing';

import {PmpeVoucherService} from './pmpe-voucher.service';
import {AdfFormatService} from "@adf/components";
import {UtilWorkFlowService} from "../../../../../service/common/util-work-flow.service";
import {PmpdTableService} from "../definition/payment/pmpd-table.service";
import {PmpdVoucherService} from "../definition/payment/pmpd-voucher.service";
import {PmpdVoucherModalService} from "../definition/payment/pmpd-voucher-modal.service";
import {TranslateService} from "@ngx-translate/core";
import {
  iSPPESignatureTrackingParametersMock,
  iSPPEVoucherParametersMock
} from "../../../../../../assets/mocks/modules/payroll/payroll.mock";

describe('SppeVoucherService', () => {
  let service: PmpeVoucherService;

  let adfFormatService: jasmine.SpyObj<AdfFormatService>;
  let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>;
  let tableDefinition: jasmine.SpyObj<PmpdTableService>;
  let voucherDefinition: jasmine.SpyObj<PmpdVoucherService>;
  let proofVoucherDefinition: jasmine.SpyObj<PmpdVoucherModalService>;
  let translate: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {

    const adfFormatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['getFormatDateTime'])
    const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['getHeadBandLayoutConfirm'])
    const tableDefinitionSpy = jasmine.createSpyObj('PmpdTableService', ['buildTable'])
    const voucherDefinitionSpy = jasmine.createSpyObj('PmpdVoucherService', ['buildVoucherForSignatureTracking', 'buildConfirmationVoucher'])
    const proofVoucherDefinitionSpy = jasmine.createSpyObj('PmpdVoucherModalService', ['tableDefinition', 'builderLayoutVoucherModal'])
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant'])

    TestBed.configureTestingModule({
      providers: [
        { provide: AdfFormatService, useValue: adfFormatServiceSpy },
        { provide: UtilWorkFlowService, useValue: utilWorkFlowSpy },
        { provide: PmpdTableService, useValue: tableDefinitionSpy },
        { provide: PmpdVoucherService, useValue: voucherDefinitionSpy },
        { provide: PmpdVoucherModalService, useValue: proofVoucherDefinitionSpy },
        { provide: TranslateService, useValue: translateSpy },
      ]
    });
    service = TestBed.inject(PmpeVoucherService);
    adfFormatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
    utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
    tableDefinition = TestBed.inject(PmpdTableService) as jasmine.SpyObj<PmpdTableService>;
    voucherDefinition = TestBed.inject(PmpdVoucherService) as jasmine.SpyObj<PmpdVoucherService>;
    proofVoucherDefinition = TestBed.inject(PmpdVoucherModalService) as jasmine.SpyObj<PmpdVoucherModalService>;
    translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should buildDefaultVoucher', () => {
    voucherDefinition.buildConfirmationVoucher.and.returnValue({} as any);
    adfFormatService.getFormatDateTime.and.returnValue({} as any);
    tableDefinition.buildTable.and.returnValue({} as any);
    proofVoucherDefinition.builderLayoutVoucherModal.and.returnValue({} as any);
    proofVoucherDefinition.tableDefinition.and.returnValue({} as any);

    const res = service.buildDefaultVoucher(iSPPEVoucherParametersMock);

    expect(res).toBeDefined();
  })

  it('should buildDefaultVoucherForSignatureTracking', () => {
    voucherDefinition.buildConfirmationVoucher.and.returnValue({} as any);
    tableDefinition.buildTable.and.returnValue({} as any);

    const res = service.buildDefaultVoucherForSignatureTracking(iSPPEVoucherParametersMock)

    expect(res).toBeDefined();
  })

  it('should buildSignatureTrackingVoucherLayout', () => {
    voucherDefinition.buildVoucherForSignatureTracking.and.returnValue({} as any);
    tableDefinition.buildTable.and.returnValue({} as any);

    const res = service.buildSignatureTrackingVoucherLayout(iSPPESignatureTrackingParametersMock);

    expect(res).toBeDefined();
  })

});
