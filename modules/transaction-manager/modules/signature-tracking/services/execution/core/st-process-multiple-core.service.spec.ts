import { TestBed } from '@angular/core/testing';

import { StProcessMultipleCoreService } from './st-process-multiple-core.service';

describe('StProcessMultipleCoreService', () => {
  let service: StProcessMultipleCoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StProcessMultipleCoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
