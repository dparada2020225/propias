import { TestBed } from '@angular/core/testing';

import { Ttr365UtilsService } from './ttr-365-utils.service';

describe('Ttr365UtilsService', () => {
  let service: Ttr365UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ttr365UtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
