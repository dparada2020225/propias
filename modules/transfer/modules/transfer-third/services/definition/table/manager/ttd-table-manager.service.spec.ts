import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { TtdTableManagerService } from './ttd-table-manager.service';
import { TtdTableFavoritesService } from '../personalization/ttd-table-banpais-favorites.service';
import { TtdTableBisvFavoritesService } from '../personalization/ttd-table-bisv-favorites.service';
import { TtdTableAssociatesService } from '../personalization/ttd-table-banpais-associates.service';
import { TtdTableBisvAssociatesService } from '../personalization/ttd-table-bisv-associates.service';
import { TtdTableFormFilterService } from '../personalization/ttd-table-banpais-form-filter.service';
import { TtdTableBisvFormFilterService } from '../personalization/ttd-table-bisv-form-filter.service';
import { EProfile } from 'src/app/enums/profile.enum';

describe('TtdTableManagerService', () => {
    let service: TtdTableManagerService;

    let tableFavoriteDefinition: jasmine.SpyObj<TtdTableFavoritesService>;
    let tableFavoriteDefinitionBisv: jasmine.SpyObj<TtdTableBisvFavoritesService>;

    let tableAssociateDefinition: jasmine.SpyObj<TtdTableAssociatesService>;
    let tableAssociateDefinitionBisv: jasmine.SpyObj<TtdTableBisvAssociatesService>;

    let filterForm: jasmine.SpyObj<TtdTableFormFilterService>;
    let filterFormBisv: jasmine.SpyObj<TtdTableBisvFormFilterService>;

    beforeEach(() => {

        const tableFavoriteDefinitionSpy = jasmine.createSpyObj('TtdTableFavoritesService', ['buildFavoriteTableLayout'])
        const tableFavoriteDefinitionBisvSpy = jasmine.createSpyObj('TtdTableBisvFavoritesService', ['buildFavoriteTableLayout'])
        const tableAssociateDefinitionSpy = jasmine.createSpyObj('TtdTableAssociatesService', ['buildThirdTableLayout'])
        const tableAssociateDefinitionBisvSpy = jasmine.createSpyObj('TtdTableBisvAssociatesService', ['buildThirdTableLayout'])
        const filterFormSpy = jasmine.createSpyObj('TtdTableFormFilterService', ['buildFilterLayout'])
        const filterFormBisvSpy = jasmine.createSpyObj('TtdTableBisvFormFilterService', ['buildFilterLayout'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: TtdTableFavoritesService, useValue: tableFavoriteDefinitionSpy },
                { provide: TtdTableBisvFavoritesService, useValue: tableFavoriteDefinitionBisvSpy },
                { provide: TtdTableAssociatesService, useValue: tableAssociateDefinitionSpy },
                { provide: TtdTableBisvAssociatesService, useValue: tableAssociateDefinitionBisvSpy },
                { provide: TtdTableFormFilterService, useValue: filterFormSpy },
                { provide: TtdTableBisvFormFilterService, useValue: filterFormBisvSpy },
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

        service = TestBed.inject(TtdTableManagerService);
        tableFavoriteDefinition = TestBed.inject(TtdTableFavoritesService) as jasmine.SpyObj<TtdTableFavoritesService>;
        tableFavoriteDefinitionBisv = TestBed.inject(TtdTableBisvFavoritesService) as jasmine.SpyObj<TtdTableBisvFavoritesService>;
        tableAssociateDefinition = TestBed.inject(TtdTableAssociatesService) as jasmine.SpyObj<TtdTableAssociatesService>;
        tableAssociateDefinitionBisv = TestBed.inject(TtdTableBisvAssociatesService) as jasmine.SpyObj<TtdTableBisvAssociatesService>;
        filterForm = TestBed.inject(TtdTableFormFilterService) as jasmine.SpyObj<TtdTableFormFilterService>;
        filterFormBisv = TestBed.inject(TtdTableBisvFormFilterService) as jasmine.SpyObj<TtdTableBisvFormFilterService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build Favorite Table', () => {
        const data = ['create', 'transfer']
        service.profile = EProfile.HONDURAS;
        service.buildFavoriteTable(data)
        expect(tableFavoriteDefinition.buildFavoriteTableLayout).toHaveBeenCalledWith(data)

        service.profile = EProfile.SALVADOR;
        service.buildFavoriteTable(data)
        expect(tableFavoriteDefinitionBisv.buildFavoriteTableLayout).toHaveBeenCalledWith(data)

        service.profile = null as any
        service.buildFavoriteTable(data)
        expect(tableFavoriteDefinition.buildFavoriteTableLayout).toHaveBeenCalledWith(data)
    })

    it('should build Associate Table', () => {
        const data = ['create', 'update', 'delete', 'trasnfer']
        service.profile = EProfile.HONDURAS
        service.buildAssociateTable(data)
        expect(tableAssociateDefinition.buildThirdTableLayout).toHaveBeenCalledWith(data)

        service.profile = EProfile.SALVADOR
        service.buildAssociateTable(data)
        expect(tableAssociateDefinitionBisv.buildThirdTableLayout).toHaveBeenCalledWith(data)

        service.profile = null as any
        service.buildAssociateTable(data)
        expect(tableAssociateDefinition.buildThirdTableLayout).toHaveBeenCalledWith(data)
    })

    it('should build Filter Form', () => {
        service.profile = EProfile.HONDURAS;
        service.buildFilterForm()
        expect(filterForm.buildFilterLayout).toHaveBeenCalled()
        service.profile = EProfile.SALVADOR;
        service.buildFilterForm()
        expect(filterFormBisv.buildFilterLayout).toHaveBeenCalled()
        service.profile = null as any;
        service.buildFilterForm()
        expect(filterForm.buildFilterLayout).toHaveBeenCalled()
    })

});
