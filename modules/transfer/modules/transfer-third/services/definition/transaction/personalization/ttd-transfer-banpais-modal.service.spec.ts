import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader, TranslateService } from '@ngx-translate/core';
import { TtdTransferModalService } from './ttd-transfer-banpais-modal.service';
import { UtilService } from 'src/app/service/common/util.service';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { AdfFormatService } from '@adf/components';
import { TtdBaseTransferService } from '../base/ttd-base-transfer.service';
import { iThirdTransferModalMock } from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';

describe('TtdTransferModalService', () => {
    let service: TtdTransferModalService;
    let translate: jasmine.SpyObj<TranslateService>;
    let util: jasmine.SpyObj<UtilService>;
    let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>;
    let formatService: jasmine.SpyObj<AdfFormatService>;
    let base: jasmine.SpyObj<TtdBaseTransferService>;

    beforeEach(() => {

        const translateSpy = jasmine.createSpyObj('TranslateService', ['instant'])
        const utilSpy = jasmine.createSpyObj('UtilService', ['getLabelProduct', 'geCurrencSymbol'])
        const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['getUserDataModalPdf', 'getHeadBandLayout', 'buildImagesToModal'])
        const formatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount'])
        const baseSpy = jasmine.createSpyObj('TtdBaseTransferService', ['builderDataReading'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: TranslateService, useValue: translateSpy },
                { provide: UtilService, useValue: utilSpy },
                { provide: UtilWorkFlowService, useValue: utilWorkFlowSpy },
                { provide: AdfFormatService, useValue: formatServiceSpy },
                { provide: TtdBaseTransferService, useValue: baseSpy }
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

        service = TestBed.inject(TtdTransferModalService);
        translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
        util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
        utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
        formatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
        base = TestBed.inject(TtdBaseTransferService) as jasmine.SpyObj<TtdBaseTransferService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build Modal Layout', () => {
        util.getLabelProduct.and.returnValue('input')
        util.geCurrencSymbol.and.returnValue('usd')
        const res = service.buildModalLayout(iThirdTransferModalMock)
        expect(translate.instant).toHaveBeenCalled();
        expect(formatService.formatAmount).toHaveBeenCalled();
        expect(utilWorkFlow.getUserDataModalPdf).toHaveBeenCalled()
        expect(utilWorkFlow.getHeadBandLayout).toHaveBeenCalled()
        expect(utilWorkFlow.buildImagesToModal).toHaveBeenCalled()
        expect(base.builderDataReading).toHaveBeenCalledTimes(9)
        expect(res.containerValue).toEqual('note_list')
        expect(res.titleModal).toEqual('transfers-third-title')
    })

});
