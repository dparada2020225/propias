import { TestBed } from '@angular/core/testing';

import { AmS365SipaUtilsService } from './am-s365-sipa-utils.service';

describe('AmS365SipaUtilsService', () => {
  let service: AmS365SipaUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmS365SipaUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
