import { TestBed } from '@angular/core/testing';

import { AverageBalancePrintService } from './average-balance-print.service';

describe('AverageBalancePrintService', () => {
  let service: AverageBalancePrintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AverageBalancePrintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
