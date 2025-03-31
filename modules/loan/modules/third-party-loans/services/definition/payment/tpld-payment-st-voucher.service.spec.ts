import { TestBed } from '@angular/core/testing';

import { AdfFormatService } from '@adf/components';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { UtilService } from 'src/app/service/common/util.service';
import { iTPLPVoucherStateMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { TpldPaymentStVoucherService } from './tpld-payment-st-voucher.service';

describe('TpldPaymentStVoucherService', () => {
  let service: TpldPaymentStVoucherService;
  let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>;
  let util: jasmine.SpyObj<UtilService>;
  let format: jasmine.SpyObj<AdfFormatService>;

  beforeEach(() => {

    const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['getUserDataTransaction'])
    const utilSpy = jasmine.createSpyObj('UtilService', ['getCurrencySymbolToIso'])
    const formatSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount', 'getFormatDateTime'])

    TestBed.configureTestingModule({
      providers: [
        { provide: UtilWorkFlowService, useValue: utilWorkFlowSpy },
        { provide: UtilService, useValue: utilSpy },
        { provide: AdfFormatService, useValue: formatSpy },
      ]
    });
    service = TestBed.inject(TpldPaymentStVoucherService);
    utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    format = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build Layout Voucher', () => {
    const res = service.buildLayoutVoucher(iTPLPVoucherStateMock, 'title', 'test')
    expect(res.groupList[0].attributes).toHaveSize(5)
    expect(res.title).toEqual('title')
    expect(res.subtitle).toEqual('test')
    expect(utilWorkFlow.getUserDataTransaction).toHaveBeenCalled();
  })

  it('should build Transaction History TPLVoucher', () => {
    const res = service.buildTransactionHistoryTPLVoucher(iTPLPVoucherStateMock, 'title', 'test', 'transaction', 'test')
    expect(res.groupList[0].attributes).toHaveSize(7)
    expect(res.title).toEqual('title')
    expect(res.className).toEqual('padding-side')
    expect(util.getCurrencySymbolToIso).toHaveBeenCalled();
    expect(format.formatAmount).toHaveBeenCalled();
  })

});
