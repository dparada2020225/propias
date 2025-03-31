import { TestBed } from '@angular/core/testing';

import { Tm365PrintService } from './tm365-print.service';

describe('Tm365PrintService', () => {
  let service: Tm365PrintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tm365PrintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
