import { AdfFormatService } from '@adf/components';
import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';
import { TpldPaymentFormService } from './tpld-payment-form.service';

describe('TpldPaymentFormService', () => {
    let service: TpldPaymentFormService;
    let formatService: jasmine.SpyObj<AdfFormatService>;

    beforeEach(() => {

        const utilSpy = jasmine.createSpyObj('UtilService', [''])
        const formatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount'])

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

        service = TestBed.inject(TpldPaymentFormService);
        formatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build Form Layout', () => {
        const res = service.buildFormLayout();
        expect(res.attributes).toHaveSize(3)
        expect(res.class).toEqual('padding-side')
    })

    it('should build Debited Account Select Attributes', () => {
        const res = service.buildDebitedAccountSelectAttributes({
            name: 'test',
            currency: 'USD',
            availableAmount: '5421'
        })

        expect(res).toHaveSize(2);
        expect(formatService.formatAmount).toHaveBeenCalled();
    })

});
