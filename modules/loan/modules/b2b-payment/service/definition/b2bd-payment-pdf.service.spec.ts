import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { iB2BDPdfDefinitionParametersMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { B2bdPaymentPdfService } from './b2bd-payment-pdf.service';

describe('B2bdPaymentPdfService', () => {
    let service: B2bdPaymentPdfService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [],
            imports: [
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader,
                    },
                }),
            ],
        });

        service = TestBed.inject(B2bdPaymentPdfService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build PDf File', () => {
        const res = service.buildPDfFile(iB2BDPdfDefinitionParametersMock);
        expect(res.data).toHaveSize(10)
        expect(res.reference).toEqual(123456789)
    })

});
