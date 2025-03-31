import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CtpldFormService } from './ctpld-form.service';

describe('CtpldFormService', () => {
    let service: CtpldFormService;

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

        service = TestBed.inject(CtpldFormService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build Consult Loans Layout', () => {
        const res = service.buildConsultLoansLayout();
        expect(res.attributes).toHaveSize(1)
        expect(res.title).toEqual('payments_loans')
        expect(res.subtitle).toEqual('add_third_party_loans')
        expect(res.class).toEqual('padding-side')
    })

});
