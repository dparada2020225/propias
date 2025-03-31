import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TpldTableOwnService } from './tpld-table-own.service';

describe('TpldTableOwnService', () => {
    let service: TpldTableOwnService;


    beforeEach(() => {

        TestBed.configureTestingModule({
            declarations: [],
            providers: [

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

        service = TestBed.inject(TpldTableOwnService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build Own Loan Table Layout', () => {
        const res = service.buildOwnLoanTableLayout();
        expect(res.headers).toHaveSize(4)
        expect(res.options).toHaveSize(2)
        expect(res.title).toEqual('owns_loans')
    })

});
