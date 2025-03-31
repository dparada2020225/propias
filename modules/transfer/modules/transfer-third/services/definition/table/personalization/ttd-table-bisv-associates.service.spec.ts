import {TestBed} from '@angular/core/testing';

import {TtdTableBisvAssociatesService} from './ttd-table-bisv-associates.service';
import {UtilService} from 'src/app/service/common/util.service';
import {TtdBaseTableService} from '../base/ttd-base-table.service';

describe('TtdTableBisvAssociatesService', () => {
  let service: TtdTableBisvAssociatesService;
  let util: jasmine.SpyObj<UtilService>;
  let base: jasmine.SpyObj<TtdBaseTableService>;

  beforeEach(() => {

    const utilSpy = jasmine.createSpyObj('UtilService', ['getTableOption'])
    const baseSpy = jasmine.createSpyObj('TtdBaseTableService', ['buiderTableHeader'])

    TestBed.configureTestingModule({
      providers: [
        { provide: UtilService, useValue: utilSpy },
        { provide: TtdBaseTableService, useValue: baseSpy },
      ]
    });
    service = TestBed.inject(TtdTableBisvAssociatesService);
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    base = TestBed.inject(TtdBaseTableService) as jasmine.SpyObj<TtdBaseTableService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build Third Table Layout', () => {
    const data = ['trasfer', 'update', 'delete']
    util.getTableOption.and.returnValue(data)
    const res = service.buildThirdTableLayout(data)
    expect(base.buiderTableHeader).toHaveBeenCalled()
  })

});
