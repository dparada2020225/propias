import { TestBed } from '@angular/core/testing';

import { StProcessMultipleBpService } from './st-process-multiple-bp.service';

describe('StProcessMultipleBpService', () => {
  let service: StProcessMultipleBpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StProcessMultipleBpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
