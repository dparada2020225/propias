import { TestBed } from '@angular/core/testing';

import { TtdTableBisvFavoritesService } from './ttd-table-bisv-favorites.service';
import { UtilService } from 'src/app/service/common/util.service';
import { TtdBaseTableService } from '../base/ttd-base-table.service';

describe('TtdTableBisvFavoritesService', () => {
  let service: TtdTableBisvFavoritesService;
  let util: jasmine.SpyObj<UtilService>;
  let base: jasmine.SpyObj<TtdBaseTableService>;

  beforeEach(() => {
    const utilSpy = jasmine.createSpyObj('UtilService', ['getTableOption'])
    const baseSpy = jasmine.createSpyObj('TtdBaseTableService', ['buiderTableHeader'])
    TestBed.configureTestingModule({
      providers: [
        { provide: UtilService, useValue: utilSpy },
        { provide: TtdBaseTableService, useValue: baseSpy }
      ]
    });
    service = TestBed.inject(TtdTableBisvFavoritesService);
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    base = TestBed.inject(TtdBaseTableService) as jasmine.SpyObj<TtdBaseTableService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build Favorite Table Layout', () => {
    const data = ['delete', 'transfer']

    util.getTableOption.and.returnValue(data)
    const res = service.buildFavoriteTableLayout(data)
    expect(base.buiderTableHeader).toHaveBeenCalled()
    expect(res.title).toEqual('ht_favorites-bisv')
  })

});
