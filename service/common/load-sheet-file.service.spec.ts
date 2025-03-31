import { TestBed } from '@angular/core/testing';

import { LoadSheetFileService } from './load-sheet-file.service';

describe('LoadSheetFileService', () => {
  let service: LoadSheetFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadSheetFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
