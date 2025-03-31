import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { TtdTableFavoritesService } from './ttd-table-banpais-favorites.service';
import { UtilService } from 'src/app/service/common/util.service';
import { TtdBaseTableService } from '../base/ttd-base-table.service';

describe('TtdTableFavoritesService', () => {
    let service: TtdTableFavoritesService;
    let util: jasmine.SpyObj<UtilService>;
    let base: jasmine.SpyObj<TtdBaseTableService>;

    beforeEach(() => {

        const utilSpy = jasmine.createSpyObj('UtilService', ['getTableOption'])
        const baseSpy = jasmine.createSpyObj('TtdBaseTableService', ['buiderTableHeader'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: UtilService, useValue: utilSpy },
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

        service = TestBed.inject(TtdTableFavoritesService);
        util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
        base = TestBed.inject(TtdBaseTableService) as jasmine.SpyObj<TtdBaseTableService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build Favorite Table Layout', () => {
        const data = ['transfer', 'delete']

        util.getTableOption.and.returnValue(data)
        const res = service.buildFavoriteTableLayout(data)
        expect(base.buiderTableHeader).toHaveBeenCalledTimes(4)
        expect(res.headers).toHaveSize(4)
        expect(res.options).toHaveSize(4);
        expect(res.title).toEqual('ht_favorites')
    })



});
