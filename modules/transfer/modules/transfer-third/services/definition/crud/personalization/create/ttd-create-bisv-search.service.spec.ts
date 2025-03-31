import { TestBed } from '@angular/core/testing';

import { TtdCreateBisvSearchService } from './ttd-create-bisv-search.service';
import { TtdBaseCrudService } from '../../base/ttd-base-crud.service';

describe('TtdCreateBisvSearchService', () => {
  let service: TtdCreateBisvSearchService;
  let base: jasmine.SpyObj<TtdBaseCrudService>;

  beforeEach(() => {
    const baseSpy = jasmine.createSpyObj('TtdBaseCrudService', ['builderLayoutAttribute'])
    TestBed.configureTestingModule({
      providers: [
        { provide: TtdBaseCrudService, useValue: baseSpy },
      ]
    });
    service = TestBed.inject(TtdCreateBisvSearchService);
    base = TestBed.inject(TtdBaseCrudService) as jasmine.SpyObj<TtdBaseCrudService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build Consulting Layout', () => {
    const res = service.buildConsultingLayout();
    expect(base.builderLayoutAttribute).toHaveBeenCalledTimes(2)
    expect(res.attributes).toHaveSize(2);
    expect(res.title).toEqual('transfers-third-title');
    expect(res.class).toEqual('third-transfer-container padding-side consulting-layout');
    expect(res.subtitle).toEqual('add_third_party_account');
  })

});
