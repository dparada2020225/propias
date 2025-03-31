import {TestBed} from '@angular/core/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TteTransferVoucherService} from "./tte-transfer-voucher.service";
import {TtdTransferManagerService} from "../definition/transaction/manager/ttd-transfer-manager.service";
import {UtilWorkFlowService} from "../../../../../../service/common/util-work-flow.service";
import {UtilService} from "../../../../../../service/common/util.service";
import {AdfFormatService} from "@adf/components";
import {
  iTTEVoucherLayoutRequestMock
} from "../../../../../../../assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock";

describe('TteTransferVoucherService', () => {
  let service: TteTransferVoucherService;

  let definitionServiceManager: jasmine.SpyObj<TtdTransferManagerService>;
  let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>;
  let formatService: jasmine.SpyObj<AdfFormatService>;
  let util: jasmine.SpyObj<UtilService>;

  beforeEach(() => {

    const definitionServiceManagerSpy = jasmine.createSpyObj('TtdTransferManagerService', ['buildTransferConfirmationStep4', 'buildTransferPdfStep5', 'buildTransferModalStep5'])
    const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['getHeadBandLayoutConfirm'])
    const formatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['getFormatDateTime'])
    const utilSpy = jasmine.createSpyObj('UtilService', ['getUserName'])

    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        {provide: TtdTransferManagerService, useValue: definitionServiceManagerSpy},
        {provide: UtilWorkFlowService, useValue: utilWorkFlowSpy},
        {provide: AdfFormatService, useValue: formatServiceSpy},
        {provide: UtilService, useValue: utilSpy},
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });

    service = TestBed.inject(TteTransferVoucherService);
    definitionServiceManager = TestBed.inject(TtdTransferManagerService) as jasmine.SpyObj<TtdTransferManagerService>;
    utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
    formatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should voucherLayoutsMainBuilder set values', () => {
    formatService.getFormatDateTime.and.returnValue({
      fullFormat: '121212'
    } as any)
    util.getUserName.and.returnValue('VCONTRERAS12')

    service.voucherLayoutsMainBuilder(iTTEVoucherLayoutRequestMock)

    expect(definitionServiceManager.buildTransferConfirmationStep4).toHaveBeenCalled();
    expect(utilWorkFlow.getHeadBandLayoutConfirm).toHaveBeenCalled();
    expect(definitionServiceManager.buildTransferPdfStep5).toHaveBeenCalled();
    expect(definitionServiceManager.buildTransferModalStep5).toHaveBeenCalled();

  })

});
