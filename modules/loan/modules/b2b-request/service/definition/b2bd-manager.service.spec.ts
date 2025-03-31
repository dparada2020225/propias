import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { b2bdModalInterfaceMock, iB2bRequestMock, iB2bRequestResponseMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { B2bdFormService } from './b2bd-form.service';
import { B2bdManagerService } from './b2bd-manager.service';
import { B2bdModalService } from './b2bd-modal.service';
import { B2bdPdfService } from './b2bd-pdf.service';
import { B2bdVoucherService } from './b2bd-voucher.service';

describe('B2bdManagerService', () => {
    let service: B2bdManagerService;
    let pdfLayoutService: jasmine.SpyObj<B2bdPdfService>;
    let formLayoutService: jasmine.SpyObj<B2bdFormService>;
    let voucherLayoutService: jasmine.SpyObj<B2bdVoucherService>;
    let modalLayoutService: jasmine.SpyObj<B2bdModalService>;
    let currency: string;

    beforeEach(() => {

        const pdfLayoutServiceSpy = jasmine.createSpyObj('B2bdPdfService', ['buildPDfFile'])
        const formLayoutServiceSpy = jasmine.createSpyObj('B2bdFormService', ['builderFormLayout'])
        const voucherLayoutServiceSpy = jasmine.createSpyObj('B2bdVoucherService', ['builderLayoutVoucher'])
        const modalLayoutServiceSpy = jasmine.createSpyObj('B2bdModalService', ['builderModalLayout'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: B2bdPdfService, useValue: pdfLayoutServiceSpy },
                { provide: B2bdFormService, useValue: formLayoutServiceSpy },
                { provide: B2bdVoucherService, useValue: voucherLayoutServiceSpy },
                { provide: B2bdModalService, useValue: modalLayoutServiceSpy },
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

        service = TestBed.inject(B2bdManagerService);
        pdfLayoutService = TestBed.inject(B2bdPdfService) as jasmine.SpyObj<B2bdPdfService>;
        formLayoutService = TestBed.inject(B2bdFormService) as jasmine.SpyObj<B2bdFormService>;
        voucherLayoutService = TestBed.inject(B2bdVoucherService) as jasmine.SpyObj<B2bdVoucherService>;
        modalLayoutService = TestBed.inject(B2bdModalService) as jasmine.SpyObj<B2bdModalService>;
        currency = 'USD'
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build Pdf Layout', () => {
        service.buildPdfLayout(iB2bRequestResponseMock, currency)
        expect(pdfLayoutService.buildPDfFile).toHaveBeenCalledWith(iB2bRequestResponseMock, currency)
    })

    it('should build Voucher Layout', () => {
        service.buildVoucherLayout(iB2bRequestResponseMock, currency)
        expect(voucherLayoutService.builderLayoutVoucher).toHaveBeenCalledWith(iB2bRequestResponseMock, currency)
    })

    it('should build Form Layout', () => {
        service.buildFormLayout(currency);
        expect(formLayoutService.builderFormLayout).toHaveBeenCalledWith(currency)
    })

    it('should build Modal Layout', () => {
        service.buildModalLayout(b2bdModalInterfaceMock);
        expect(modalLayoutService.builderModalLayout).toHaveBeenCalledWith(b2bdModalInterfaceMock)
    })

    it('should build Execute Request', () => {
        const res = service.buildExecuteRequest(iB2bRequestMock)
        expect(res).toBeTruthy()
    })

});
