import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { iConsultThirdPartyLoanMock, iHeadBandLayoutMock, iThirdPartyLoanAssociateMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { TpldConfirmService } from '../confirm-screen/tpld-confirm.service';
import { TpldPaymentFormService } from '../payment/tpld-payment-form.service';
import { CtpldFormService } from './create/ctpld-form.service';
import { TplCreateFormService } from './create/tpl-create-form.service';
import { TplCrudManagerService } from './tpl-crud-manager.service';
import { TplUpdateService } from './update/tpl-update.service';

describe('TplCrudManagerService', () => {
    let service: TplCrudManagerService;
    let consultLoansService: jasmine.SpyObj<CtpldFormService>;
    let createThirdPartyLoans: jasmine.SpyObj<TplCreateFormService>;
    let updateThirdPartyLoans: jasmine.SpyObj<TplUpdateService>;
    let paymentThirdPartyLoans: jasmine.SpyObj<TpldPaymentFormService>;
    let confirmationThirdPartyLoans: jasmine.SpyObj<TpldConfirmService>;

    beforeEach(() => {

        const consultLoansServiceSpy = jasmine.createSpyObj('CtpldFormService', ['buildConsultLoansLayout'])
        const createThirdPartyLoansSpy = jasmine.createSpyObj('TplCreateFormService', ['buildCreateAccountLayout'])
        const updateThirdPartyLoansSpy = jasmine.createSpyObj('TplUpdateService', ['buildUpdateAccountLayout'])
        const paymentThirdPartyLoansSpy = jasmine.createSpyObj('TpldPaymentFormService', ['buildDebitedAccountSelectAttributes'])
        const confirmationThirdPartyLoansSpy = jasmine.createSpyObj('TpldConfirmService', ['builderLayoutConfirmation', 'getHeadBandLayout'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: CtpldFormService, useValue: consultLoansServiceSpy },
                { provide: TplCreateFormService, useValue: createThirdPartyLoansSpy },
                { provide: TplUpdateService, useValue: updateThirdPartyLoansSpy },
                { provide: TpldPaymentFormService, useValue: paymentThirdPartyLoansSpy },
                { provide: TpldConfirmService, useValue: confirmationThirdPartyLoansSpy },
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

        service = TestBed.inject(TplCrudManagerService);
        consultLoansService = TestBed.inject(CtpldFormService) as jasmine.SpyObj<CtpldFormService>;
        createThirdPartyLoans = TestBed.inject(TplCreateFormService) as jasmine.SpyObj<TplCreateFormService>;
        updateThirdPartyLoans = TestBed.inject(TplUpdateService) as jasmine.SpyObj<TplUpdateService>;
        paymentThirdPartyLoans = TestBed.inject(TpldPaymentFormService) as jasmine.SpyObj<TpldPaymentFormService>;
        confirmationThirdPartyLoans = TestBed.inject(TpldConfirmService) as jasmine.SpyObj<TpldConfirmService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should builder Consult Loans Form', () => {
        service.builderConsultLoansForm();
        expect(consultLoansService.buildConsultLoansLayout).toHaveBeenCalled();
    })

    it('should builder Create Loans Form', () => {
        service.builderCreateLoansForm('1205085', iConsultThirdPartyLoanMock)
        expect(createThirdPartyLoans.buildCreateAccountLayout).toHaveBeenCalled();
    })

    it('should builder Update Loans Form', () => {
        service.builderUpdateLoansForm(iThirdPartyLoanAssociateMock)
        expect(updateThirdPartyLoans.buildUpdateAccountLayout).toHaveBeenCalled();
    })

    it('should build Debited Account Select', () => {
        service.buildDebitedAccountSelect('test');
        expect(paymentThirdPartyLoans.buildDebitedAccountSelectAttributes).toHaveBeenCalled();
    })

    it('should build Confirmation Layout', () => {
        service.buildConfirmationLayout('test');
        expect(confirmationThirdPartyLoans.builderLayoutConfirmation).toHaveBeenCalled();
    })

    it('should build Head Band Layout', () => {
        service.buildHeadBandLayout(iHeadBandLayoutMock);
        expect(confirmationThirdPartyLoans.getHeadBandLayout).toHaveBeenCalled();
    })

});
