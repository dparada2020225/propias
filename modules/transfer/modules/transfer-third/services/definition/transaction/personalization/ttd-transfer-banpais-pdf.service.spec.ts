import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader, TranslateService } from '@ngx-translate/core';
import { TtdTransferPdfService } from './ttd-transfer-banpais-pdf.service';
import { UtilService } from 'src/app/service/common/util.service';
import { AdfFormatService } from '@adf/components';
import { TtdBaseTransferService } from '../base/ttd-base-transfer.service';
import { iPdfLayoutMock } from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';

describe('TtdTransferPdfService', () => {
    let service: TtdTransferPdfService;
    let util: jasmine.SpyObj<UtilService>;
    let formatService: jasmine.SpyObj<AdfFormatService>;
    let translateService: jasmine.SpyObj<TranslateService>;
    let base: jasmine.SpyObj<TtdBaseTransferService>;

    beforeEach(() => {

        const utilSpy = jasmine.createSpyObj('UtilService', ['geCurrencSymbol', 'getLabelProduct', 'separatorValidation'])
        const formatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount'])
        const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant'])
        const baseSpy = jasmine.createSpyObj('TtdBaseTransferService', ['builderDataPdf'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: UtilService, useValue: utilSpy },
                { provide: AdfFormatService, useValue: formatServiceSpy },
                { provide: TranslateService, useValue: translateServiceSpy },
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

        service = TestBed.inject(TtdTransferPdfService);
        util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
        formatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
        translateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
        base = TestBed.inject(TtdBaseTransferService) as jasmine.SpyObj<TtdBaseTransferService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build Third Transfer Pdf', () => {
        util.getLabelProduct.and.returnValue('input')
        util.geCurrencSymbol.and.returnValue('usd')
        util.separatorValidation.and.returnValue('-')
        const res = service.buildThirdTransferPdf(iPdfLayoutMock)
        expect(base.builderDataPdf).toHaveBeenCalledTimes(9)
        expect(res.items).toHaveSize(9)
        expect(formatService.formatAmount).toHaveBeenCalled();
        expect(translateService.instant).toHaveBeenCalled()
    })

});
