import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { iConsultThirdPartyLoanMock } from '../../../../../../../../../assets/mocks/modules/loan/loan.data.mock';
import { TplCreateFormService } from './tpl-create-form.service';

describe('TplCreateFormService', () => {
    let service: TplCreateFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [],
            imports: [
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader,
                    },
                }),
            ],
        });

        service = TestBed.inject(TplCreateFormService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build Create Account Layout', () => {
        const res = service.buildCreateAccountLayout('55253532', iConsultThirdPartyLoanMock)
        expect(res.attributes).toHaveSize(7);
        expect(res.title).toEqual('payments_loans')
        expect(res.subtitle).toEqual('add_third_party_loans')
    })

});
