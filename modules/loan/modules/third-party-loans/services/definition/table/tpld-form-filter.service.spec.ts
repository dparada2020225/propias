import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { iFormFilterParametersMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { TpldFormFilterService } from './tpld-form-filter.service';

describe('TpldFormFilterService', () => {
    let service: TpldFormFilterService;

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

        service = TestBed.inject(TpldFormFilterService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build Filter Layout', () => {
        const res = service.buildFilterLayout(iFormFilterParametersMock)
        expect(res.attributes).toHaveSize(1)
    })

});
