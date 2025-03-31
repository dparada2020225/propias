import { TestBed } from '@angular/core/testing';

import { StProcessMultipleSvService } from './st-process-multiple-sv.service';

describe('StProcessMultipleSvService', () => {
  let service: StProcessMultipleSvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StProcessMultipleSvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
