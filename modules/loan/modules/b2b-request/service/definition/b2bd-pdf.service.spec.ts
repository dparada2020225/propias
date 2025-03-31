import { AdfFormatService } from '@adf/components';
import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';
import { iB2bRequestResponseMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { B2bdPdfService } from './b2bd-pdf.service';

describe('B2bdPdfService', () => {
    let service: B2bdPdfService;
    let formatService: jasmine.SpyObj<AdfFormatService>;
    let utils: jasmine.SpyObj<UtilService>;

    beforeEach(() => {
        const formatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount', 'getFormatDateTime'])
        const utilsSpy = jasmine.createSpyObj('UtilService', ['parsePercent'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: AdfFormatService, useValue: formatServiceSpy },
                { provide: UtilService, useValue: utilsSpy },
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

        service = TestBed.inject(B2bdPdfService);
        formatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
        utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build PDf File', () => {
        const mock = { ...iB2bRequestResponseMock };
        mock.reference = '123456789'

        formatService.getFormatDateTime.and.returnValue({
            date: '12121212'
        } as any)
        const res = service.buildPDfFile(mock, 'USD')
        expect(res.reference).toEqual(123456789)
        expect(res.data).toHaveSize(11)
        expect(utils.parsePercent).toHaveBeenCalled();
    })

});
