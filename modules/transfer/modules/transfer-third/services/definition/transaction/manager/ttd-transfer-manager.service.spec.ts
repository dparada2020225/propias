import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { TtdTransferManagerService } from './ttd-transfer-manager.service';
import { TtdTransferConfirmService } from '../personalization/ttd-transfer-banpais-confirm.service';
import { TtdTransferBisvConfirmService } from '../personalization/ttd-transfer-bisv-confirm.service';
import { TtdTransferVoucherService } from '../personalization/ttd-transfer-banpais-voucher.service';
import { TtdTransferBisvVoucherService } from '../personalization/ttd-transfer-bisv-voucher.service';
import { TtdTransferModalService } from '../personalization/ttd-transfer-banpais-modal.service';
import { TtdTransferBisvModalService } from '../personalization/ttd-transfer-bisv-modal.service';
import { TtdTransferPdfService } from '../personalization/ttd-transfer-banpais-pdf.service';
import { TtdTransferBisvPdfService } from '../personalization/ttd-transfer-bisv-pdf.service';
import { TtdTransferFormService } from '../personalization/ttd-transfer-banpais-form.service';
import { TtdTransferBisvFormService } from '../personalization/ttd-transfer-bisv-form.service';
import { EProfile } from 'src/app/enums/profile.enum';
import { iPdfLayoutMock, iTTDFormMock, iThirdTransferConfirmationVoucherMock, iThirdTransferModalMock, iThirdTransferSampleVoucherMock } from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';

describe('TtdTransferManagerService', () => {
    let service: TtdTransferManagerService;

    let transferConfirm: jasmine.SpyObj<TtdTransferConfirmService>;
    let transferBisvConfirm: jasmine.SpyObj<TtdTransferBisvConfirmService>;

    let transferVoucher: jasmine.SpyObj<TtdTransferVoucherService>;
    let transferBisvVoucher: jasmine.SpyObj<TtdTransferBisvVoucherService>;

    let transferModal: jasmine.SpyObj<TtdTransferModalService>;
    let transferBisvModal: jasmine.SpyObj<TtdTransferBisvModalService>;

    let transferPdf: jasmine.SpyObj<TtdTransferPdfService>;
    let transferBisvPdf: jasmine.SpyObj<TtdTransferBisvPdfService>;

    let transferForm: jasmine.SpyObj<TtdTransferFormService>;
    let transferBisvForm: jasmine.SpyObj<TtdTransferBisvFormService>;

    beforeEach(() => {

        const transferConfirmSpy = jasmine.createSpyObj('TtdTransferConfirmService', ['buildConfirmationVoucher'])
        const transferBisvConfirmSpy = jasmine.createSpyObj('TtdTransferBisvConfirmService', ['buildConfirmationVoucher'])
        const transferVoucherSpy = jasmine.createSpyObj('TtdTransferVoucherService', ['buildSampleVoucher'])
        const transferBisvVoucherSpy = jasmine.createSpyObj('TtdTransferBisvVoucherService', ['buildSampleVoucher'])
        const transferModalSpy = jasmine.createSpyObj('TtdTransferModalService', ['buildModalLayout'])
        const transferBisvModalSpy = jasmine.createSpyObj('TtdTransferBisvModalService', ['buildModalLayout'])
        const transferPdfSpy = jasmine.createSpyObj('TtdTransferPdfService', ['buildThirdTransferPdf'])
        const transferBisvPdfSpy = jasmine.createSpyObj('TtdTransferBisvPdfService', ['buildThirdTransferPdf'])
        const transferFormSpy = jasmine.createSpyObj('TtdTransferFormService', ['buildSimpleThirdTransferLayout'])
        const transferBisvFormSpy = jasmine.createSpyObj('TtdTransferBisvFormService', ['buildSimpleThirdTransferLayout'])


        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                TtdTransferManagerService,
                { provide: TtdTransferConfirmService, useValue: transferConfirmSpy },
                { provide: TtdTransferBisvConfirmService, useValue: transferBisvConfirmSpy },
                { provide: TtdTransferVoucherService, useValue: transferVoucherSpy },
                { provide: TtdTransferBisvVoucherService, useValue: transferBisvVoucherSpy },
                { provide: TtdTransferModalService, useValue: transferModalSpy },
                { provide: TtdTransferBisvModalService, useValue: transferBisvModalSpy },
                { provide: TtdTransferPdfService, useValue: transferPdfSpy },
                { provide: TtdTransferBisvPdfService, useValue: transferBisvPdfSpy },
                { provide: TtdTransferFormService, useValue: transferFormSpy },
                { provide: TtdTransferBisvFormService, useValue: transferBisvFormSpy },
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

        service = TestBed.inject(TtdTransferManagerService);
        transferConfirm = TestBed.inject(TtdTransferConfirmService) as jasmine.SpyObj<TtdTransferConfirmService>;
        transferBisvConfirm = TestBed.inject(TtdTransferBisvConfirmService) as jasmine.SpyObj<TtdTransferBisvConfirmService>;
        transferVoucher = TestBed.inject(TtdTransferVoucherService) as jasmine.SpyObj<TtdTransferVoucherService>;
        transferBisvVoucher = TestBed.inject(TtdTransferBisvVoucherService) as jasmine.SpyObj<TtdTransferBisvVoucherService>;
        transferModal = TestBed.inject(TtdTransferModalService) as jasmine.SpyObj<TtdTransferModalService>;
        transferBisvModal = TestBed.inject(TtdTransferBisvModalService) as jasmine.SpyObj<TtdTransferBisvModalService>;
        transferPdf = TestBed.inject(TtdTransferPdfService) as jasmine.SpyObj<TtdTransferPdfService>;
        transferBisvPdf = TestBed.inject(TtdTransferBisvPdfService) as jasmine.SpyObj<TtdTransferBisvPdfService>;
        transferForm = TestBed.inject(TtdTransferFormService) as jasmine.SpyObj<TtdTransferFormService>;
        transferBisvForm = TestBed.inject(TtdTransferBisvFormService) as jasmine.SpyObj<TtdTransferBisvFormService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build Transfer Form Step1', () => {
        service.profile = EProfile.HONDURAS;
        service.buildTransferFormStep1(iTTDFormMock)
        expect(transferForm.buildSimpleThirdTransferLayout).toHaveBeenCalledWith(iTTDFormMock)

        service.profile = EProfile.SALVADOR;
        service.buildTransferFormStep1(iTTDFormMock)
        expect(transferBisvForm.buildSimpleThirdTransferLayout).toHaveBeenCalledWith(iTTDFormMock)

        service.profile = null as any;
        service.buildTransferFormStep1(iTTDFormMock)
        expect(transferForm.buildSimpleThirdTransferLayout).toHaveBeenCalledWith(iTTDFormMock)
    })

    it('should build Transfer Voucher Step2', () => {
        service.profile = EProfile.HONDURAS;
        service.buildTransferVoucherStep2(iThirdTransferSampleVoucherMock)
        expect(transferVoucher.buildSampleVoucher).toHaveBeenCalled()

        service.profile = EProfile.SALVADOR;
        service.buildTransferVoucherStep2(iThirdTransferSampleVoucherMock)
        expect(transferBisvVoucher.buildSampleVoucher).toHaveBeenCalled()

        service.profile = null as any;
        service.buildTransferVoucherStep2(iThirdTransferSampleVoucherMock)
        expect(transferVoucher.buildSampleVoucher).toHaveBeenCalled()
    })

    it('should build Transfer Confirmation Step4', () => {
        service.profile = EProfile.HONDURAS;
        service.buildTransferConfirmationStep4(iThirdTransferConfirmationVoucherMock)
        expect(transferConfirm.buildConfirmationVoucher).toHaveBeenCalled()

        service.profile = EProfile.SALVADOR;
        service.buildTransferConfirmationStep4(iThirdTransferConfirmationVoucherMock)
        expect(transferBisvConfirm.buildConfirmationVoucher).toHaveBeenCalled()

        service.profile = null as any;
        service.buildTransferConfirmationStep4(iThirdTransferConfirmationVoucherMock)
        expect(transferConfirm.buildConfirmationVoucher).toHaveBeenCalled()
    })

    it('should build Transfer Modal Step5', () => {
        service.profile = EProfile.HONDURAS;
        service.buildTransferModalStep5(iThirdTransferModalMock)
        expect(transferModal.buildModalLayout).toHaveBeenCalled()

        service.profile = EProfile.SALVADOR;
        service.buildTransferModalStep5(iThirdTransferModalMock)
        expect(transferBisvModal.buildModalLayout).toHaveBeenCalled()

        service.profile = null as any;
        service.buildTransferModalStep5(iThirdTransferModalMock)
        expect(transferModal.buildModalLayout).toHaveBeenCalled()
    })

    it('should build Transfer Pdf Step5', () => {
        service.profile = EProfile.HONDURAS;
        service.buildTransferPdfStep5(iPdfLayoutMock)
        expect(transferPdf.buildThirdTransferPdf).toHaveBeenCalled()

        service.profile = EProfile.SALVADOR;
        service.buildTransferPdfStep5(iPdfLayoutMock)
        expect(transferBisvPdf.buildThirdTransferPdf).toHaveBeenCalled()

        service.profile = null as any;
        service.buildTransferPdfStep5(iPdfLayoutMock)
        expect(transferPdf.buildThirdTransferPdf).toHaveBeenCalled()
    })

});
