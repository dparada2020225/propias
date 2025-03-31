import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { iConsultDetailTPLMock, iVoucherPaymentTPLMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { TpldConfirmPaymentService } from './tpld-confirm-payment.service';
import { TpldPaymentDetailService } from './tpld-payment-detail.service';
import { TpldPaymentFormService } from './tpld-payment-form.service';
import { TpldPaymentManagerService } from './tpld-payment-manager.service';
import { TpldVoucherModalService } from './tpld-voucher-modal.service';
import { TpldVoucherPdfService } from './tpld-voucher-pdf.service';

describe('TpldPaymentManagerService', () => {
    let service: TpldPaymentManagerService;
    let paymentFormDefinition: jasmine.SpyObj<TpldPaymentFormService>;
    let paymentConfirmDefinition: jasmine.SpyObj<TpldConfirmPaymentService>;
    let paymentDetailDefinition: jasmine.SpyObj<TpldPaymentDetailService>;
    let paymentVoucherModalDefinition: jasmine.SpyObj<TpldVoucherModalService>;
    let paymentVoucherPdfDefinition: jasmine.SpyObj<TpldVoucherPdfService>;

    beforeEach(() => {

        const paymentFormDefinitionSpy = jasmine.createSpyObj('TpldPaymentFormService', ['buildFormLayout'])
        const paymentConfirmDefinitionSpy = jasmine.createSpyObj('TpldConfirmPaymentService', ['builderConfirmPaymentLayout', 'builderLayoutConfirmation'])
        const paymentDetailDefinitionSpy = jasmine.createSpyObj('TpldPaymentDetailService', ['buildDetailPaymentDetail'])
        const paymentVoucherModalDefinitionSpy = jasmine.createSpyObj('TpldVoucherModalService', ['builderLayoutVoucherModal'])
        const paymentVoucherPdfDefinitionSpy = jasmine.createSpyObj('TpldVoucherPdfService', ['buildOwnTransferPdf'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: TpldPaymentFormService, useValue: paymentFormDefinitionSpy },
                { provide: TpldConfirmPaymentService, useValue: paymentConfirmDefinitionSpy },
                { provide: TpldPaymentDetailService, useValue: paymentDetailDefinitionSpy },
                { provide: TpldVoucherModalService, useValue: paymentVoucherModalDefinitionSpy },
                { provide: TpldVoucherPdfService, useValue: paymentVoucherPdfDefinitionSpy },
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

        service = TestBed.inject(TpldPaymentManagerService);
        paymentFormDefinition = TestBed.inject(TpldPaymentFormService) as jasmine.SpyObj<TpldPaymentFormService>;
        paymentConfirmDefinition = TestBed.inject(TpldConfirmPaymentService) as jasmine.SpyObj<TpldConfirmPaymentService>;
        paymentDetailDefinition = TestBed.inject(TpldPaymentDetailService) as jasmine.SpyObj<TpldPaymentDetailService>;
        paymentVoucherModalDefinition = TestBed.inject(TpldVoucherModalService) as jasmine.SpyObj<TpldVoucherModalService>;
        paymentVoucherPdfDefinition = TestBed.inject(TpldVoucherPdfService) as jasmine.SpyObj<TpldVoucherPdfService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build Form Layout', () => {
        service.buildFormLayout();
        expect(paymentFormDefinition.buildFormLayout).toHaveBeenCalled();
    })

    it('should build Payment Confirm Screen Form', () => {
        service.buildPaymentConfirmScreenForm();
        expect(paymentConfirmDefinition.builderConfirmPaymentLayout).toHaveBeenCalled();
    })

    it('should build Payment Confirm Screen Reading', () => {
        service.buildPaymentConfirmScreenReading('data', '8521');
        expect(paymentConfirmDefinition.builderLayoutConfirmation).toHaveBeenCalled();
    })

    it('should build Payment Detail Layout', () => {
        service.buildPaymentDetailLayout(iConsultDetailTPLMock, '7522');
        expect(paymentDetailDefinition.buildDetailPaymentDetail).toHaveBeenCalled();
    })

    it('should build Voucher Payment Modal', () => {
        service.buildVoucherPaymentModal(iVoucherPaymentTPLMock)
        expect(paymentVoucherModalDefinition.builderLayoutVoucherModal).toHaveBeenCalled();
    })

    it('should build Voucher Payment PDF', () => {
        service.buildVoucherPaymentPDF(iVoucherPaymentTPLMock)
        expect(paymentVoucherPdfDefinition.buildOwnTransferPdf).toHaveBeenCalled();
    })

});
