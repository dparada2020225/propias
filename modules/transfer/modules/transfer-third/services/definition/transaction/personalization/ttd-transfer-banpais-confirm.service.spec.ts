import {TestBed} from '@angular/core/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TtdTransferConfirmService} from './ttd-transfer-banpais-confirm.service';
import {UtilService} from 'src/app/service/common/util.service';
import {UtilWorkFlowService} from 'src/app/service/common/util-work-flow.service';
import {AdfFormatService} from '@adf/components';
import {TtdBaseTransferService} from '../base/ttd-base-transfer.service';
import {
  iThirdTransferConfirmationVoucherMock
} from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';

describe('TtdTransferConfirmService', () => {
  let service: TtdTransferConfirmService;
  let util: jasmine.SpyObj<UtilService>;
  let base: jasmine.SpyObj<TtdBaseTransferService>;

  beforeEach(() => {

    const utilSpy = jasmine.createSpyObj('UtilService', ['geCurrencSymbol'])
    const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['getUserDataTransaction'])
    const formatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount'])
    const baseSpy = jasmine.createSpyObj('TtdBaseTransferService', ['builderDataReading'])

    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        {provide: UtilService, useValue: utilSpy},
        {provide: UtilWorkFlowService, useValue: utilWorkFlowSpy},
        {provide: AdfFormatService, useValue: formatServiceSpy},
        {provide: TtdBaseTransferService, useValue: baseSpy}
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

    service = TestBed.inject(TtdTransferConfirmService);
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    base = TestBed.inject(TtdBaseTransferService) as jasmine.SpyObj<TtdBaseTransferService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build Confirmation Voucher', () => {
    util.geCurrencSymbol.and.returnValue('usd')
    const res = service.buildConfirmationVoucher(iThirdTransferConfirmationVoucherMock, true);
    expect(base.builderDataReading).toHaveBeenCalledTimes(6)
    expect(res.title).toEqual('transfer')
    expect(res.subtitle).toEqual('third')
    expect(res.className).toEqual('padding-side')
    expect(res.groupList[0].attributes).toHaveSize(6)
  })

  it('should build Confirmation Voucher with !isSignatureTrackingUpdate', () => {
    util.geCurrencSymbol.and.returnValue('usd')
    const res = service.buildConfirmationVoucher(iThirdTransferConfirmationVoucherMock, false);
    expect(base.builderDataReading).toHaveBeenCalledTimes(7)
    expect(res.title).toEqual('transfer')
    expect(res.subtitle).toEqual('third')
    expect(res.className).toEqual('padding-side')
    expect(res.groupList[0].attributes).toHaveSize(7)
  })

});
