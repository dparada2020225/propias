import { AdfFormatService } from '@adf/components';
import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';
import { iB2BDPaymentBuildFormParametersMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { B2bdPaymentFormService } from './b2bd-payment-form.service';

describe('B2bdPaymentFormService', () => {
    let service: B2bdPaymentFormService;
    let adfFormatService: jasmine.SpyObj<AdfFormatService>;
    let utils: jasmine.SpyObj<UtilService>;


    beforeEach(() => {
        const adfFormatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['getFormatDateTime', 'formatAmount'])
        const utilsSpy = jasmine.createSpyObj('UtilService', ['getLabelCurrency', 'parsePercent', 'getAmountMask'])
        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: AdfFormatService, useValue: adfFormatServiceSpy },
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

        service = TestBed.inject(B2bdPaymentFormService);
        adfFormatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
        utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build Payment Execution Data', () => {
        adfFormatService.getFormatDateTime.and.returnValue({
            standard: '2015'
        }as any)
        const res = service.buildFormLayout(iB2BDPaymentBuildFormParametersMock)
        expect(res.title).toEqual('b2b')
        expect(res.subtitle).toEqual('payment')
        expect(res.attributes).toHaveSize(19)
    })

});
