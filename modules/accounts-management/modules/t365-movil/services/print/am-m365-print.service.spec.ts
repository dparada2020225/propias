import { TestBed } from '@angular/core/testing';

import { AmM365PrintService } from './am-m365-print.service';

describe('AmM365PrintService', () => {
  let service: AmM365PrintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmM365PrintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
