import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { TTDCreateSeachService } from './ttd-create-banpais-seach.service';
import { TtdBaseCrudService } from '../../base/ttd-base-crud.service';

describe('TTDCreateSeachService', () => {
    let service: TTDCreateSeachService;
    let base: jasmine.SpyObj<TtdBaseCrudService>;
    beforeEach(() => {

        const baseSpy = jasmine.createSpyObj('TtdBaseCrudService', ['builderLayoutAttribute'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: TtdBaseCrudService, useValue: baseSpy },
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

        service = TestBed.inject(TTDCreateSeachService);
        base = TestBed.inject(TtdBaseCrudService) as jasmine.SpyObj<TtdBaseCrudService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build Consulting Layout', () => {

        const res = service.buildConsultingLayout()
        expect(base.builderLayoutAttribute).toHaveBeenCalledTimes(2);
        expect(res.attributes).toHaveSize(2)
        expect(res.title).toEqual('transfers-third-title')
        expect(res.subtitle).toEqual('add_third_party_account')
        expect(res.class).toEqual('third-transfer-container padding-side consulting-layout')

    })

});
