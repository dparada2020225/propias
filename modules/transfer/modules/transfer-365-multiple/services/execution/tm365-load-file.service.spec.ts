import { TestBed } from '@angular/core/testing';

import { Tm365LoadFileService } from './tm365-load-file.service';

describe('Tm365LoadFileService', () => {
  let service: Tm365LoadFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tm365LoadFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
