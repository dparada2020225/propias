import {AdfFormatService} from '@adf/components';
import {TestBed} from '@angular/core/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {UtilService} from 'src/app/service/common/util.service';
import {iConsultDetailTPLMock} from 'src/assets/mocks/modules/loan/loan.data.mock';
import {TpldPaymentDetailService} from './tpld-payment-detail.service';

describe('TpldPaymentDetailService', () => {
    let service: TpldPaymentDetailService;
    let util: jasmine.SpyObj<UtilService>;
    let formatService: jasmine.SpyObj<AdfFormatService>;

    beforeEach(() => {

        const utilSpy = jasmine.createSpyObj('UtilService', ['getCurrencySymbolToIso', 'parseAmountStringToNumber'])
        const formatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['getFormatDateTime', 'formatAmount'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: UtilService, useValue: utilSpy },
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

        service = TestBed.inject(TpldPaymentDetailService);
        util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
        formatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build Detail Payment Detail', () => {
        const res = service.buildDetailPaymentDetail(iConsultDetailTPLMock, 'asdasew');
        expect(res.groupList[0].attributes).toHaveSize(7)
        expect(res.className).toEqual('padding-side')
        expect(util.getCurrencySymbolToIso).toHaveBeenCalled();
        expect(formatService.getFormatDateTime).toHaveBeenCalled();
    })

});
