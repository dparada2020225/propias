import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';
import { B2bdFormService } from './b2bd-form.service';

describe('B2bdFormService', () => {
    let service: B2bdFormService;

    beforeEach(() => {
        const utilServiceSpy = jasmine.createSpyObj('UtilService', ['getAmountMask'])
        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: UtilService, useValue: utilServiceSpy },
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

        service = TestBed.inject(B2bdFormService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should builder Form Layout', () => {
        const form = service.builderFormLayout('USD');
        expect(form.title).toEqual('b2b-request-title-forms')
        expect(form.subtitle).toEqual('request')
        expect(form.class).toEqual('container-form padding-side b2b-request-container-form')
        expect(form.attributes).toHaveSize(7)
    })
});
