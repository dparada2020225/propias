import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { iB2BDConsultModalParametersMock, iB2bConsultationDetailMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { B2bdConsultDefinitionService } from './b2bd-consult-definition.service';
import { B2bdConsultFormService } from './b2bd-consult-form.service';
import { B2bdConsultManagerService } from './b2bd-consult-manager.service';
import { B2bdConsultModalService } from './b2bd-consult-modal.service';
import { B2bdConsultVoucherService } from './b2bd-consult-voucher.service';

describe('B2bdConsultManagerService', () => {
    let service: B2bdConsultManagerService;
    let b2bConsultDefinition: jasmine.SpyObj<B2bdConsultDefinitionService>;
    let formDefinition: jasmine.SpyObj<B2bdConsultFormService>;
    let modalDefinition: jasmine.SpyObj<B2bdConsultModalService>;
    let voucherDefinition: jasmine.SpyObj<B2bdConsultVoucherService>;

    beforeEach(() => {

        const b2bConsultDefinitionSpy = jasmine.createSpyObj('B2bdConsultDefinitionService', ['buildPDfFile'])
        const formDefinitionSpy = jasmine.createSpyObj('B2bdConsultFormService', ['builderFormLayout'])
        const modalDefinitionSpy = jasmine.createSpyObj('B2bdConsultModalService', ['builderModalLayout'])
        const voucherDefinitionSpy = jasmine.createSpyObj('B2bdConsultVoucherService', ['builderVoucherLayout'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: B2bdConsultDefinitionService, useValue: b2bConsultDefinitionSpy },
                { provide: B2bdConsultFormService, useValue: formDefinitionSpy },
                { provide: B2bdConsultModalService, useValue: modalDefinitionSpy },
                { provide: B2bdConsultVoucherService, useValue: voucherDefinitionSpy },
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

        service = TestBed.inject(B2bdConsultManagerService);
        b2bConsultDefinition = TestBed.inject(B2bdConsultDefinitionService) as jasmine.SpyObj<B2bdConsultDefinitionService>;
        formDefinition = TestBed.inject(B2bdConsultFormService) as jasmine.SpyObj<B2bdConsultFormService>;
        modalDefinition = TestBed.inject(B2bdConsultModalService) as jasmine.SpyObj<B2bdConsultModalService>;
        voucherDefinition = TestBed.inject(B2bdConsultVoucherService) as jasmine.SpyObj<B2bdConsultVoucherService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build Pdf Layout', () => {
        service.buildPdfLayout(iB2bConsultationDetailMock, 'USD');
        expect(b2bConsultDefinition.buildPDfFile).toHaveBeenCalled();
    })

    it('should build Voucher Layout', () => {
        service.buildVoucherLayout(iB2bConsultationDetailMock, 'USD');
        expect(voucherDefinition.builderVoucherLayout).toHaveBeenCalled();
    })

    it('should build Modal Layout', () => {
        service.buildModalLayout(iB2BDConsultModalParametersMock);
        expect(modalDefinition.builderModalLayout).toHaveBeenCalled();
    })

    it('should build Form Layout', () => {
        service.buildFormLayout();
        expect(formDefinition.builderFormLayout).toHaveBeenCalled();
    })

});
