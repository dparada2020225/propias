import {AdfFormatService} from '@adf/components';
import {TestBed} from '@angular/core/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {UtilWorkFlowService} from 'src/app/service/common/util-work-flow.service';
import {UtilService} from 'src/app/service/common/util.service';
import {iDataPaymentMock} from '../../../../../../../../assets/mocks/modules/loan/loan.data.mock';
import {TpldConfirmPaymentService} from './tpld-confirm-payment.service';

describe('TpldConfirmPaymentService', () => {
    let service: TpldConfirmPaymentService;
    let util: jasmine.SpyObj<UtilService>;
    let formatService: jasmine.SpyObj<AdfFormatService>;
    let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>;

    beforeEach(() => {

        const utilSpy = jasmine.createSpyObj('UtilService', ['getCurrencySymbolToIso', 'buildMaskToEmailField'])
        const formatServiceSpy = jasmine.createSpyObj('AdfFormatService', ['formatAmount'])
        const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['getUserDataTransaction'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: UtilService, useValue: utilSpy },
                { provide: AdfFormatService, useValue: formatServiceSpy },
                { provide: UtilWorkFlowService, useValue: utilWorkFlowSpy },
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

        service = TestBed.inject(TpldConfirmPaymentService);
        util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
        formatService = TestBed.inject(AdfFormatService) as jasmine.SpyObj<AdfFormatService>;
        utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should builder Layout Confirmation', () => {
        const res = service.builderLayoutConfirmation(iDataPaymentMock, '100')
        expect(res.groupList[0].attributes).toHaveSize(3)
        expect(res.title).toEqual('payments_loans')
        expect(res.subtitle).toEqual('confirmation_paymentTPL')
        expect(util.getCurrencySymbolToIso).toHaveBeenCalled();
        expect(utilWorkFlow.getUserDataTransaction).toHaveBeenCalled();
        expect(formatService.formatAmount).toHaveBeenCalled();
    })

    it('should builder Confirm Payment Layout', () => {
        const res = service.builderConfirmPaymentLayout();
        expect(res.attributes).toHaveSize(2)
        expect(res.class).toEqual('container-form padding-side')
    })

});
