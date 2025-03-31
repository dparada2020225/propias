import { TestBed } from '@angular/core/testing';

import { M365StorageService } from './m365-storage.service';

describe('M365StorageService', () => {
  let service: M365StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(M365StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
