import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { iThirdPartyLoanAssociateMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { TplUpdateService } from './tpl-update.service';

describe('TplUpdateService', () => {
    let service: TplUpdateService;

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

        service = TestBed.inject(TplUpdateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build Update Account Layout', () => {
        const res = service.buildUpdateAccountLayout(iThirdPartyLoanAssociateMock);
        expect(res.attributes).toHaveSize(7)
        expect(res.title).toEqual('payments_loans')
        expect(res.subtitle).toEqual('edit_third_party_loan')
    })
});
