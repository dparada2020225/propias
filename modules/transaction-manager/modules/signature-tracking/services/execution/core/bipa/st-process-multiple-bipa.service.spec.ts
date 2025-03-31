import { TestBed } from '@angular/core/testing';

import { StProcessMultipleBipaService } from './st-process-multiple-bipa.service';

describe('StProcessMultipleBipaService', () => {
  let service: StProcessMultipleBipaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StProcessMultipleBipaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
