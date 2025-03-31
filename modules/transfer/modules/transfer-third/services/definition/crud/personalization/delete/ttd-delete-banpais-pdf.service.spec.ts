import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { TTDDeletePdfService } from './ttd-delete-banpais-pdf.service';
import { UtilService } from 'src/app/service/common/util.service';
import { TtdBaseCrudService } from '../../base/ttd-base-crud.service';
import { iThirdTransferPdfMock } from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';

describe('TTDDeletePdfService', () => {
    let service: TTDDeletePdfService;
    let util: jasmine.SpyObj<UtilService>;
    let base: jasmine.SpyObj<TtdBaseCrudService>;

    beforeEach(() => {

        const utilSpy = jasmine.createSpyObj('UtilService', ['getLabelProduct', 'getLabelCurrency'])
        const baseSpy = jasmine.createSpyObj('TtdBaseCrudService', ['builderPdfAttributes'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: UtilService, useValue: utilSpy },
                { provide: TtdBaseCrudService, useValue: baseSpy },
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

        service = TestBed.inject(TTDDeletePdfService);
        util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
        base = TestBed.inject(TtdBaseCrudService) as jasmine.SpyObj<TtdBaseCrudService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build Delete PDF', () => {
        util.getLabelProduct.and.returnValue('1')
        util.getLabelCurrency.and.returnValue('USD')
        const res = service.buildDeletePDF(iThirdTransferPdfMock)
        expect(base.builderPdfAttributes).toHaveBeenCalledTimes(6)
        expect(res.items).toHaveSize(6)
        expect(res.title).toEqual('Transfer Pdf')
        expect(res.reference).toEqual('QWE44')
        expect(res.fileName).toEqual('transfer-third')
    })

});
