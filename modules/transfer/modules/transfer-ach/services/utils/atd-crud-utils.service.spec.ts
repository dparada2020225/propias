import { TestBed } from '@angular/core/testing';

import { AtdCrudUtilsService } from './atd-crud-utils.service';

describe('AtdCrudUtilsService', () => {
  let service: AtdCrudUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AtdCrudUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
