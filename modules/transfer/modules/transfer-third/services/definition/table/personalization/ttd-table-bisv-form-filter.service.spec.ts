import { TestBed } from '@angular/core/testing';

import { TtdTableBisvFormFilterService } from './ttd-table-bisv-form-filter.service';
import { TtdBaseTableService } from '../base/ttd-base-table.service';

describe('TtdTableBisvFormFilterService', () => {
  let service: TtdTableBisvFormFilterService;
  let base: jasmine.SpyObj<TtdBaseTableService>;
  beforeEach(() => {
    const baseSpy = jasmine.createSpyObj('TtdBaseTableService', ['builderLayoutAttribute'])
    TestBed.configureTestingModule({
      providers: [
        { provide: TtdBaseTableService, useValue: baseSpy }
      ]
    });
    service = TestBed.inject(TtdTableBisvFormFilterService);
    base = TestBed.inject(TtdBaseTableService) as jasmine.SpyObj<TtdBaseTableService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build Filter Layout', () => {
    const res = service.buildFilterLayout()
    expect(base.builderLayoutAttribute).toHaveBeenCalledTimes(2)
    expect(res.attributes).toHaveSize(2)
  })

});
