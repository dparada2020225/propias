import { AdfFormatService } from '@adf/components';
import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';
import { iB2BDPaymentConfirmationDefinitionParametersMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { B2bdPaymentConfirmationService } from './b2bd-payment-confirmation.service';

describe('B2bdPaymentConfirmationService', () => {
    let service: B2bdPaymentConfirmationService;
    let adfFormatService: jasmine.SpyObj<AdfFormatService>;
    let utils: jasmine.SpyObj<UtilService>;

    beforeEach(() => {

        const adfFormatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount'])
        const utilsSpy = jasmine.createSpyObj('UtilService', ['getLabelProduct'])

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

        service = TestBed.inject(B2bdPaymentConfirmationService);
        adfFormatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
        utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    
    it('should builder Confirmation Layout', () => {
        const res = service.builderConfirmationLayout(iB2BDPaymentConfirmationDefinitionParametersMock)
        expect(res.title).toEqual('payment_b2b_title')
        expect(res.subtitle).toEqual('confirm_payment')
        expect(res.className).toEqual('padding-side')
        expect(res.groupList[0].attributes.length).toEqual(3)
    })

});
