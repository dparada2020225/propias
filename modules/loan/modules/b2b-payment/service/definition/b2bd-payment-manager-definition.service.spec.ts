import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { iB2BDModalDefinitionParametersMock, iB2BDPaymentBuildFormParametersMock, iB2BDPaymentConfirmationDefinitionParametersMock, iB2BDPaymentVoucherDefinitionParametersMock, iB2BDPdfDefinitionParametersMock, iB2bPaymentParametersToExecuteTransactionMock, iPaymentAccountMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { B2bdPaymentConfirmationService } from './b2bd-payment-confirmation.service';
import { B2bdPaymentDefinitionService } from './b2bd-payment-definition.service';
import { B2bdPaymentFormService } from './b2bd-payment-form.service';
import { B2bdPaymentManagerDefinitionService } from './b2bd-payment-manager-definition.service';
import { B2bdPaymentModalService } from './b2bd-payment-modal.service';
import { B2bdPaymentPdfService } from './b2bd-payment-pdf.service';
import { B2bdPaymentTableService } from './b2bd-payment-table.service';
import { B2bdPaymentVoucherService } from './b2bd-payment-voucher.service';

describe('B2bdPaymentManagerDefinitionService', () => {
    let service: B2bdPaymentManagerDefinitionService;
    let confirmationDefinition: jasmine.SpyObj<B2bdPaymentConfirmationService>;
    let formDefinition: jasmine.SpyObj<B2bdPaymentFormService>;
    let modalDefinition: jasmine.SpyObj<B2bdPaymentModalService>;
    let pdfDefinition: jasmine.SpyObj<B2bdPaymentPdfService>;
    let tableDefinition: jasmine.SpyObj<B2bdPaymentTableService>;
    let voucherDefinition: jasmine.SpyObj<B2bdPaymentVoucherService>;
    let paymentDefinition: jasmine.SpyObj<B2bdPaymentDefinitionService>;


    beforeEach(() => {

        const confirmationDefinitionSpy = jasmine.createSpyObj('B2bdPaymentConfirmationService', ['builderConfirmationLayout'])
        const formDefinitionSpy = jasmine.createSpyObj('B2bdPaymentFormService', ['buildFormLayout'])
        const modalDefinitionSpy = jasmine.createSpyObj('B2bdPaymentModalService', ['builderModalLayout'])
        const pdfDefinitionSpy = jasmine.createSpyObj('B2bdPaymentPdfService', ['buildPDfFile'])
        const tableDefinitionSpy = jasmine.createSpyObj('B2bdPaymentTableService', ['tableLayout'])
        const voucherDefinitionSpy = jasmine.createSpyObj('B2bdPaymentVoucherService', ['builderVoucherLayout'])
        const paymentDefinitionSpy = jasmine.createSpyObj('B2bdPaymentDefinitionService', ['buildPaymentExecutionData'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: B2bdPaymentConfirmationService, useValue: confirmationDefinitionSpy },
                { provide: B2bdPaymentFormService, useValue: formDefinitionSpy },
                { provide: B2bdPaymentModalService, useValue: modalDefinitionSpy },
                { provide: B2bdPaymentPdfService, useValue: pdfDefinitionSpy },
                { provide: B2bdPaymentTableService, useValue: tableDefinitionSpy },
                { provide: B2bdPaymentVoucherService, useValue: voucherDefinitionSpy },
                { provide: B2bdPaymentDefinitionService, useValue: paymentDefinitionSpy },
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

        service = TestBed.inject(B2bdPaymentManagerDefinitionService);
        confirmationDefinition = TestBed.inject(B2bdPaymentConfirmationService) as jasmine.SpyObj<B2bdPaymentConfirmationService>;
        formDefinition = TestBed.inject(B2bdPaymentFormService) as jasmine.SpyObj<B2bdPaymentFormService>;
        modalDefinition = TestBed.inject(B2bdPaymentModalService) as jasmine.SpyObj<B2bdPaymentModalService>;
        pdfDefinition = TestBed.inject(B2bdPaymentPdfService) as jasmine.SpyObj<B2bdPaymentPdfService>;
        tableDefinition = TestBed.inject(B2bdPaymentTableService) as jasmine.SpyObj<B2bdPaymentTableService>;
        voucherDefinition = TestBed.inject(B2bdPaymentVoucherService) as jasmine.SpyObj<B2bdPaymentVoucherService>;
        paymentDefinition = TestBed.inject(B2bdPaymentDefinitionService) as jasmine.SpyObj<B2bdPaymentDefinitionService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build Pdf Layout', () => {
        service.buildPdfLayout(iB2BDPdfDefinitionParametersMock);
        expect(pdfDefinition.buildPDfFile).toHaveBeenCalled();
    })

    it('should build Modal Layout', () => {
        service.buildModalLayout(iB2BDModalDefinitionParametersMock)
        expect(modalDefinition.builderModalLayout).toHaveBeenCalled();
    })

    it('should build Table Layout', () => {
        service.buildTableLayout([iPaymentAccountMock], 'USD');
        expect(tableDefinition.tableLayout).toHaveBeenCalled();
    })

    it('should build Form Layout', () => {
        service.buildFormLayout(iB2BDPaymentBuildFormParametersMock);
        expect(formDefinition.buildFormLayout).toHaveBeenCalled();
    })

    it('should build Confirmation Layout', () => {
        service.buildConfirmationLayout(iB2BDPaymentConfirmationDefinitionParametersMock);
        expect(confirmationDefinition.builderConfirmationLayout).toHaveBeenCalled();
    })

    it('should build Voucher Layout', () => {
        service.buildVoucherLayout(iB2BDPaymentVoucherDefinitionParametersMock)
        expect(voucherDefinition.builderVoucherLayout).toHaveBeenCalled();
    })

    it('should build Data To Execute Transaction', () => {
        service.buildDataToExecuteTransaction(iB2bPaymentParametersToExecuteTransactionMock);
        expect(paymentDefinition.buildPaymentExecutionData).toHaveBeenCalled();
    })

});
