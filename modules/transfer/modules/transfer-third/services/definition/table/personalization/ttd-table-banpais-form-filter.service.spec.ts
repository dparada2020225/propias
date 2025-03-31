import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { TtdTableFormFilterService } from './ttd-table-banpais-form-filter.service';
import { TtdBaseTableService } from '../base/ttd-base-table.service';

describe('TtdTableFormFilterService', () => {
    let service: TtdTableFormFilterService;
    let base: jasmine.SpyObj<TtdBaseTableService>;
    beforeEach(() => {
        const baseSpy = jasmine.createSpyObj('TtdBaseTableService', ['builderLayoutAttribute'])
        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: TtdBaseTableService, useValue: baseSpy }
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

        service = TestBed.inject(TtdTableFormFilterService);
        base = TestBed.inject(TtdBaseTableService) as jasmine.SpyObj<TtdBaseTableService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build Filter Layout', () => {
        const res = service.buildFilterLayout();
        expect(base.builderLayoutAttribute).toHaveBeenCalledTimes(1)
        expect(res.attributes).toHaveSize(1)
        expect(res.title).toEqual('transfers-third-title')
        expect(res.subtitle).toEqual('my_third_party_account')
        expect(res.class).toEqual('padding-side')
    })

});
