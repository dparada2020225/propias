import { AdfFormatService } from '@adf/components';
import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';
import { iB2BDModalDefinitionParametersMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { B2bdPaymentModalService } from './b2bd-payment-modal.service';

describe('B2bdPaymentModalService', () => {
    let service: B2bdPaymentModalService;
    let adfFormatService: jasmine.SpyObj<AdfFormatService>;
    let translateService: jasmine.SpyObj<TranslateService>;
    let utils: jasmine.SpyObj<UtilService>;

    beforeEach(() => {
        const adfFormatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount'])
        const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant'])
        const utilsSpy = jasmine.createSpyObj('UtilService', ['getLabelProduct'])
        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: AdfFormatService, useValue: adfFormatServiceSpy },
                { provide: TranslateService, useValue: translateServiceSpy },
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

        service = TestBed.inject(B2bdPaymentModalService);
        adfFormatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
        translateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
        utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should builder Modal Layout', () => {
        const res = service.builderModalLayout(iB2BDModalDefinitionParametersMock);
        expect(res.titleModal).toEqual('voucher_transfer_title');
        expect(res.viewModal).toEqual('v-list');
        expect(res.attributeList[0].attributes.length).toEqual(4);
        expect(res.attributeList[1].attributes.length).toEqual(6);
        expect(adfFormatService.formatAmount).toHaveBeenCalledTimes(5)
        expect(translateService.instant).toHaveBeenCalledTimes(1)
        expect(utils.getLabelProduct).toHaveBeenCalledTimes(1)
    })

});
