import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { B2bdConsultFormService } from './b2bd-consult-form.service';

describe('B2bdConsultFormService', () => {
    let service: B2bdConsultFormService;

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

        service = TestBed.inject(B2bdConsultFormService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should builder Form Layout', () => {
        const res = service.builderFormLayout();
        expect(res.title).toEqual('b2b')
        expect(res.subtitle).toEqual('b2b-consultion')
        expect(res.class).toEqual('container-form padding-side container-b2b-consultation')
        expect(res.attributes).toHaveSize(1);
    })

});
