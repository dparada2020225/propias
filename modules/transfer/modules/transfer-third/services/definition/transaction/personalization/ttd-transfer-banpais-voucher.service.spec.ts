import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { TtdTransferVoucherService } from './ttd-transfer-banpais-voucher.service';
import { UtilService } from 'src/app/service/common/util.service';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { AdfFormatService } from '@adf/components';
import { TtdBaseTransferService } from '../base/ttd-base-transfer.service';
import { iThirdTransferSampleVoucherMock } from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';

describe('TtdTransferVoucherService', () => {
    let service: TtdTransferVoucherService;
    let util: jasmine.SpyObj<UtilService>;
    let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>;
    let formatService: jasmine.SpyObj<AdfFormatService>;
    let base: jasmine.SpyObj<TtdBaseTransferService>;

    beforeEach(() => {

        const utilSpy = jasmine.createSpyObj('UtilService', ['geCurrencSymbol'])
        const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['getUserDataTransaction'])
        const formatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount'])
        const baseSpy = jasmine.createSpyObj('TtdBaseTransferService', ['builderDataReading'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                TtdTransferVoucherService,
                { provide: UtilService, useValue: utilSpy },
                { provide: UtilWorkFlowService, useValue: utilWorkFlowSpy },
                { provide: AdfFormatService, useValue: formatServiceSpy },
                { provide: TtdBaseTransferService, useValue: baseSpy },
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

        service = TestBed.inject(TtdTransferVoucherService);
        util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
        utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
        formatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
        base = TestBed.inject(TtdBaseTransferService) as jasmine.SpyObj<TtdBaseTransferService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build Sample Voucher', () => {
        util.geCurrencSymbol.and.returnValue('usd')
        const res = service.buildSampleVoucher(iThirdTransferSampleVoucherMock)
        expect(res.title).toEqual('transfer')
        expect(base.builderDataReading).toHaveBeenCalledTimes(6)
        expect(utilWorkFlow.getUserDataTransaction).toHaveBeenCalledTimes(2)
        expect(formatService.formatAmount).toHaveBeenCalled();
    })

});
