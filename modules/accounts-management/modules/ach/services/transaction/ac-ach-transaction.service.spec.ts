import { TestBed } from '@angular/core/testing';

import { AcAchTransactionService } from './ac-ach-transaction.service';

describe('AcAchTransactionService', () => {
  let service: AcAchTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcAchTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
