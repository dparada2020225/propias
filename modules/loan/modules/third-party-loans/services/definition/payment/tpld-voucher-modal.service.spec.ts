import { AdfFormatService } from '@adf/components';
import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { UtilService } from 'src/app/service/common/util.service';
import { iVoucherPaymentTPLMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { TpldVoucherModalService } from './tpld-voucher-modal.service';

describe('TpldVoucherModalService', () => {
    let service: TpldVoucherModalService;
    let util: jasmine.SpyObj<UtilService>;
    let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>;
    let translate: jasmine.SpyObj<TranslateService>;
    let formatService: jasmine.SpyObj<AdfFormatService>;

    beforeEach(() => {

        const utilSpy = jasmine.createSpyObj('UtilService', ['getLabelProduct', 'getCurrencySymbolToIso'])
        const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['getUserDataModalPdf', 'getHeadBandLayout', 'buildImagesToModal'])
        const translateSpy = jasmine.createSpyObj('TranslateService', ['instant'])
        const formatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['getFormatDateTime', 'formatAmount'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: UtilService, useValue: utilSpy },
                { provide: UtilWorkFlowService, useValue: utilWorkFlowSpy },
                { provide: TranslateService, useValue: translateSpy },
                { provide: AdfFormatService, useValue: formatServiceSpy },
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

        service = TestBed.inject(TpldVoucherModalService);
        util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
        utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
        translate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
        formatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should builder Layout Voucher Modal', () => {
        const res = service.builderLayoutVoucherModal(iVoucherPaymentTPLMock);
        expect(res.attributeList[0].attributes.length).toEqual(5);
        expect(res.titleModal).toEqual('payments_loans');
        expect(res.containerValue).toEqual('note_list')
        expect(util.getLabelProduct).toHaveBeenCalled();
        expect(utilWorkFlow.getUserDataModalPdf).toHaveBeenCalled();
        expect(translate.instant).toHaveBeenCalled();
        expect(formatService.getFormatDateTime).toHaveBeenCalled();
    })

});